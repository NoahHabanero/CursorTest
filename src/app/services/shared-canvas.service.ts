import { Injectable, signal, effect } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { ToastService } from './toast.service';

export interface SharedCanvasState {
  id?: number;
  html: string;
  css: string;
  js: string;
  version: number;
  command_history: string[];
  last_command: string;
  last_updated: string;
  contributor_count: number;
}

const STORAGE_KEY_SUPABASE_URL = 'supabase-url';
const STORAGE_KEY_SUPABASE_KEY = 'supabase-anon-key';
const CANVAS_ROW_ID = 1; // Single shared canvas

/**
 * SharedCanvasService - Syncs canvas state across all users via Supabase
 * Free tier: 500MB database, unlimited API requests, real-time subscriptions
 */
@Injectable({
  providedIn: 'root'
})
export class SharedCanvasService {
  private supabase: SupabaseClient | null = null;
  private channel: RealtimeChannel | null = null;
  
  isConnected = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  connectionError = signal<string | null>(null);
  lastSyncTime = signal<Date | null>(null);
  contributorCount = signal<number>(0);
  
  // Callbacks for when state changes from cloud
  onStateUpdate: ((state: SharedCanvasState) => void) | null = null;

  constructor(private toastService: ToastService) {
    // Try to connect with saved credentials
    this.tryAutoConnect();
  }

  private tryAutoConnect() {
    const url = localStorage.getItem(STORAGE_KEY_SUPABASE_URL);
    const key = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY);
    
    if (url && key) {
      this.connect(url, key, true);
    }
  }

  hasCredentials(): boolean {
    return !!(localStorage.getItem(STORAGE_KEY_SUPABASE_URL) && 
              localStorage.getItem(STORAGE_KEY_SUPABASE_KEY));
  }

  async connect(url: string, anonKey: string, silent = false): Promise<boolean> {
    this.isLoading.set(true);
    this.connectionError.set(null);

    try {
      // Create Supabase client
      this.supabase = createClient(url, anonKey, {
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });

      // Test connection by fetching data
      const { data, error } = await this.supabase
        .from('canvas_state')
        .select('*')
        .eq('id', CANVAS_ROW_ID)
        .single();

      if (error) {
        // If no row exists, create it
        if (error.code === 'PGRST116') {
          await this.initializeCanvasRow();
        } else {
          throw error;
        }
      }

      // Save credentials
      localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url);
      localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, anonKey);

      // Subscribe to real-time changes
      this.subscribeToChanges();

      this.isConnected.set(true);
      this.lastSyncTime.set(new Date());
      
      if (!silent) {
        this.toastService.show('Connected to shared canvas! 🌐', 'success');
      }

      // Load initial state
      if (data && this.onStateUpdate) {
        this.onStateUpdate(data as SharedCanvasState);
        this.contributorCount.set(data.contributor_count || 0);
      }

      return true;
    } catch (error: any) {
      console.error('Supabase connection error:', error);
      this.connectionError.set(error.message || 'Failed to connect');
      this.isConnected.set(false);
      
      if (!silent) {
        this.toastService.show('Failed to connect: ' + (error.message || 'Unknown error'), 'error');
      }
      
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  private async initializeCanvasRow() {
    if (!this.supabase) return;

    const initialState: Partial<SharedCanvasState> = {
      id: CANVAS_ROW_ID,
      html: this.getDefaultHTML(),
      css: this.getDefaultCSS(),
      js: '',
      version: 0,
      command_history: [],
      last_command: '',
      last_updated: new Date().toISOString(),
      contributor_count: 0
    };

    const { error } = await this.supabase
      .from('canvas_state')
      .insert(initialState);

    if (error) {
      console.error('Failed to initialize canvas:', error);
    }
  }

  private subscribeToChanges() {
    if (!this.supabase) return;

    // Clean up existing subscription
    if (this.channel) {
      this.channel.unsubscribe();
    }

    this.channel = this.supabase
      .channel('canvas-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'canvas_state',
          filter: `id=eq.${CANVAS_ROW_ID}`
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          this.lastSyncTime.set(new Date());
          
          if (payload.new && this.onStateUpdate) {
            const newState = payload.new as SharedCanvasState;
            this.onStateUpdate(newState);
            this.contributorCount.set(newState.contributor_count || 0);
            this.toastService.show(`Canvas evolved: "${newState.last_command?.substring(0, 30)}..."`, 'info');
          }
        }
      )
      .subscribe();
  }

  async fetchLatestState(): Promise<SharedCanvasState | null> {
    if (!this.supabase || !this.isConnected()) return null;

    try {
      const { data, error } = await this.supabase
        .from('canvas_state')
        .select('*')
        .eq('id', CANVAS_ROW_ID)
        .single();

      if (error) throw error;
      
      this.lastSyncTime.set(new Date());
      if (data) {
        this.contributorCount.set(data.contributor_count || 0);
      }
      return data as SharedCanvasState;
    } catch (error) {
      console.error('Failed to fetch state:', error);
      return null;
    }
  }

  async saveState(state: Partial<SharedCanvasState>, command: string): Promise<boolean> {
    if (!this.supabase || !this.isConnected()) {
      // Fall back to local storage only
      return false;
    }

    try {
      // First, get current state to update history
      const current = await this.fetchLatestState();
      const currentHistory = current?.command_history || [];
      const currentVersion = current?.version || 0;
      const currentContributors = current?.contributor_count || 0;

      const updateData = {
        html: state.html,
        css: state.css,
        js: state.js || '',
        version: currentVersion + 1,
        command_history: [...currentHistory, command].slice(-100),
        last_command: command,
        last_updated: new Date().toISOString(),
        contributor_count: currentContributors + 1
      };

      const { error } = await this.supabase
        .from('canvas_state')
        .update(updateData)
        .eq('id', CANVAS_ROW_ID);

      if (error) throw error;

      this.lastSyncTime.set(new Date());
      this.contributorCount.set(updateData.contributor_count);
      return true;
    } catch (error) {
      console.error('Failed to save state:', error);
      this.toastService.show('Failed to sync to cloud', 'error');
      return false;
    }
  }

  disconnect() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
    
    localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEY_SUPABASE_KEY);
    
    this.supabase = null;
    this.isConnected.set(false);
    this.toastService.show('Disconnected from shared canvas', 'info');
  }

  private getDefaultHTML(): string {
    return `<div class="shared-landing">
  <section class="hero">
    <div class="hero-badge">🌐 Shared Evolution</div>
    <h1>The Collective Canvas</h1>
    <p>This website is shared by everyone. Each command from any user evolves it.</p>
    <div class="stats">
      <div class="stat"><span class="value">0</span><span class="label">Contributors</span></div>
      <div class="stat"><span class="value">v0</span><span class="label">Version</span></div>
    </div>
  </section>
</div>`;
  }

  private getDefaultCSS(): string {
    return `.shared-landing {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero {
  text-align: center;
  max-width: 600px;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  color: white;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero h1 {
  font-size: 3rem;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat .value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-cyan);
}

.stat .label {
  font-size: 0.85rem;
  color: var(--text-muted);
}`;
  }
}

