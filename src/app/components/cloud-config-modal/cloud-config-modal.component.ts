import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedCanvasService } from '../../services/shared-canvas.service';

@Component({
  selector: 'app-cloud-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>🌐 Shared Canvas Setup</h2>
          <button class="close-btn" (click)="close.emit()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          @if (sharedCanvas.isConnected()) {
            <div class="connected-state">
              <div class="connected-icon">✅</div>
              <h3>Connected to Shared Canvas!</h3>
              <p>Your canvas is syncing with all users in real-time.</p>
              <div class="stats-row">
                <div class="stat">
                  <span class="stat-value">{{ sharedCanvas.contributorCount() }}</span>
                  <span class="stat-label">Contributors</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ getLastSyncText() }}</span>
                  <span class="stat-label">Last Sync</span>
                </div>
              </div>
              <button class="disconnect-btn" (click)="disconnect()">
                Disconnect
              </button>
            </div>
          } @else {
            <div class="setup-guide">
              <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                  <h4>Create Free Supabase Project</h4>
                  <p>Go to <a href="https://supabase.com" target="_blank">supabase.com</a> and create a free account (no credit card needed).</p>
                </div>
              </div>
              
              <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                  <h4>Create Database Table</h4>
                  <p>In your project, go to SQL Editor and run this:</p>
                  <div class="code-block">
                    <button class="copy-btn" (click)="copySQL()">{{ copied() ? '✓ Copied' : 'Copy' }}</button>
                    <pre>{{ sqlScript }}</pre>
                  </div>
                </div>
              </div>

              <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                  <h4>Get Your Credentials</h4>
                  <p>Go to Settings → API and copy your Project URL and anon key.</p>
                </div>
              </div>
            </div>

            <div class="input-section">
              <div class="input-group">
                <label>Supabase Project URL</label>
                <input 
                  type="text"
                  [(ngModel)]="projectUrl"
                  placeholder="https://xxxxx.supabase.co"
                />
              </div>
              
              <div class="input-group">
                <label>Anon (Public) Key</label>
                <input 
                  type="password"
                  [(ngModel)]="anonKey"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
              </div>

              @if (sharedCanvas.connectionError()) {
                <div class="error-message">
                  {{ sharedCanvas.connectionError() }}
                </div>
              }
            </div>
          }
        </div>

        <div class="modal-footer">
          @if (!sharedCanvas.isConnected()) {
            <button class="cancel-btn" (click)="close.emit()">Cancel</button>
            <button 
              class="connect-btn" 
              (click)="connect()"
              [disabled]="!projectUrl || !anonKey || sharedCanvas.isLoading()"
            >
              @if (sharedCanvas.isLoading()) {
                <span class="spinner"></span>
                Connecting...
              } @else {
                Connect
              }
            </button>
          } @else {
            <button class="done-btn" (click)="close.emit()">Done</button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      width: 90%;
      max-width: 560px;
      max-height: 90vh;
      overflow-y: auto;
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .close-btn {
      background: transparent;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--text-muted);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .modal-body {
      padding: 1.5rem;
    }

    /* Connected State */
    .connected-state {
      text-align: center;
      padding: 1rem;
    }

    .connected-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .connected-state h3 {
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
    }

    .connected-state p {
      margin: 0 0 1.5rem 0;
      color: var(--text-secondary);
    }

    .stats-row {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 1.5rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-cyan);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .disconnect-btn {
      padding: 0.5rem 1rem;
      background: color-mix(in srgb, var(--error) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--error) 30%, transparent);
      border-radius: var(--radius-md);
      color: var(--error);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .disconnect-btn:hover {
      background: color-mix(in srgb, var(--error) 25%, transparent);
    }

    /* Setup Guide */
    .setup-guide {
      margin-bottom: 1.5rem;
    }

    .step {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .step-number {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    .step-content {
      flex: 1;
    }

    .step-content h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
      color: var(--text-primary);
    }

    .step-content p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .step-content a {
      color: var(--accent-cyan);
      text-decoration: none;
    }

    .step-content a:hover {
      text-decoration: underline;
    }

    .code-block {
      position: relative;
      margin-top: 0.75rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .code-block pre {
      margin: 0;
      padding: 1rem;
      font-size: 0.75rem;
      line-height: 1.5;
      color: var(--text-secondary);
      overflow-x: auto;
      font-family: 'Monaco', 'Menlo', monospace;
    }

    .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-sm);
      font-size: 0.7rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .copy-btn:hover {
      border-color: var(--accent-purple);
      color: var(--accent-purple);
    }

    /* Input Section */
    .input-section {
      border-top: 1px solid var(--border-subtle);
      padding-top: 1.5rem;
    }

    .input-group {
      margin-bottom: 1rem;
    }

    .input-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .input-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .input-group input:focus {
      outline: none;
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-purple) 15%, transparent);
    }

    .input-group input::placeholder {
      color: var(--text-dim);
    }

    .error-message {
      padding: 0.75rem;
      background: color-mix(in srgb, var(--error) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--error) 30%, transparent);
      border-radius: var(--radius-md);
      color: var(--error);
      font-size: 0.85rem;
    }

    /* Footer */
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-subtle);
    }

    .cancel-btn, .connect-btn, .done-btn {
      padding: 0.625rem 1.25rem;
      border-radius: var(--radius-lg);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cancel-btn {
      background: transparent;
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
    }

    .cancel-btn:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .connect-btn, .done-btn {
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      border: none;
      color: white;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .connect-btn:hover:not(:disabled), .done-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .connect-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class CloudConfigModalComponent {
  close = output<void>();
  
  sharedCanvas = inject(SharedCanvasService);
  
  projectUrl = '';
  anonKey = '';
  copied = signal(false);

  sqlScript = `-- Create the shared canvas table
CREATE TABLE canvas_state (
  id INTEGER PRIMARY KEY,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  js TEXT DEFAULT '',
  version INTEGER DEFAULT 0,
  command_history JSONB DEFAULT '[]',
  last_command TEXT DEFAULT '',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contributor_count INTEGER DEFAULT 0
);

-- Enable real-time for this table
ALTER PUBLICATION supabase_realtime ADD TABLE canvas_state;

-- Allow public read/write (for demo purposes)
ALTER TABLE canvas_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access" ON canvas_state
  FOR ALL USING (true) WITH CHECK (true);`;

  async connect() {
    if (this.projectUrl && this.anonKey) {
      const success = await this.sharedCanvas.connect(this.projectUrl, this.anonKey);
      if (success) {
        // Don't close - show connected state
      }
    }
  }

  disconnect() {
    this.sharedCanvas.disconnect();
  }

  copySQL() {
    navigator.clipboard.writeText(this.sqlScript);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  getLastSyncText(): string {
    const lastSync = this.sharedCanvas.lastSyncTime();
    if (!lastSync) return 'Never';
    
    const seconds = Math.floor((Date.now() - lastSync.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }
}

