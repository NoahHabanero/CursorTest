import { Injectable, signal, effect, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { DeploymentTrackerService } from './deployment-tracker.service';
import { SharedCanvasService, SharedCanvasState } from './shared-canvas.service';

export interface AIResponse {
  html: string;
  css: string;
  js?: string;
  description: string;
}

export interface EditHistoryItem {
  id: string;
  command: string;
  timestamp: Date;
  html: string;
  css: string;
  js?: string;
}

export interface CanvasState {
  html: string;
  css: string;
  js: string;
  lastUpdated: string;
  version: number;
  commandHistory: string[];
}

const STORAGE_KEY = 'ai-canvas-state';
const CANVAS_VERSION = 1;

/**
 * AI Editor Service - Connects to AI API to generate complex websites
 * Supports persistence so the canvas evolves over time
 */
@Injectable({
  providedIn: 'root'
})
export class AIEditorService {
  private apiKey = signal<string | null>(null);
  private apiProvider = signal<'openai' | 'anthropic'>('openai');
  
  isProcessing = signal<boolean>(false);
  currentHTML = signal<string>('');
  currentCSS = signal<string>('');
  currentJS = signal<string>('');
  editHistory = signal<EditHistoryItem[]>([]);
  commandHistory = signal<string[]>([]);
  canvasVersion = signal<number>(0);
  
  private sharedCanvas = inject(SharedCanvasService);

  constructor(
    private toastService: ToastService,
    private deploymentTracker: DeploymentTrackerService
  ) {
    // Load API key from localStorage
    const savedKey = localStorage.getItem('ai-editor-api-key');
    const savedProvider = localStorage.getItem('ai-editor-provider') as 'openai' | 'anthropic';
    if (savedKey) this.apiKey.set(savedKey);
    if (savedProvider) this.apiProvider.set(savedProvider);

    // Set up cloud state sync callback
    this.sharedCanvas.onStateUpdate = (state: SharedCanvasState) => {
      this.currentHTML.set(state.html);
      this.currentCSS.set(state.css);
      this.currentJS.set(state.js || '');
      this.commandHistory.set(state.command_history || []);
      this.canvasVersion.set(state.version);
    };

    // Load persisted canvas state (local or cloud)
    this.loadCanvasState();

    // Auto-save when content changes (local storage backup)
    effect(() => {
      const html = this.currentHTML();
      const css = this.currentCSS();
      const js = this.currentJS();
      if (html || css || js) {
        this.saveCanvasState();
      }
    });
  }

  private async loadCanvasState() {
    // First try to load from cloud if connected
    if (this.sharedCanvas.isConnected()) {
      const cloudState = await this.sharedCanvas.fetchLatestState();
      if (cloudState) {
        this.currentHTML.set(cloudState.html);
        this.currentCSS.set(cloudState.css);
        this.currentJS.set(cloudState.js || '');
        this.commandHistory.set(cloudState.command_history || []);
        this.canvasVersion.set(cloudState.version);
        console.log('Canvas state loaded from cloud');
        return;
      }
    }

    // Fall back to local storage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: CanvasState = JSON.parse(saved);
        if (state.version === CANVAS_VERSION) {
          this.currentHTML.set(state.html);
          this.currentCSS.set(state.css);
          this.currentJS.set(state.js || '');
          this.commandHistory.set(state.commandHistory || []);
          this.canvasVersion.set(state.commandHistory?.length || 0);
          console.log('Canvas state loaded from local storage');
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load canvas state:', e);
    }
    
    // Use default if no saved state
    this.currentHTML.set(this.getDefaultHTML());
    this.currentCSS.set(this.getDefaultCSS());
    this.currentJS.set('');
  }

  private saveCanvasState() {
    try {
      const state: CanvasState = {
        html: this.currentHTML(),
        css: this.currentCSS(),
        js: this.currentJS(),
        lastUpdated: new Date().toISOString(),
        version: CANVAS_VERSION,
        commandHistory: this.commandHistory()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save canvas state:', e);
    }
  }

  setApiKey(key: string, provider: 'openai' | 'anthropic' = 'openai') {
    this.apiKey.set(key);
    this.apiProvider.set(provider);
    localStorage.setItem('ai-editor-api-key', key);
    localStorage.setItem('ai-editor-provider', provider);
    this.toastService.show('API key saved!', 'success');
  }

  hasApiKey(): boolean {
    return !!this.apiKey();
  }

  getProvider(): 'openai' | 'anthropic' {
    return this.apiProvider();
  }

  async processCommand(command: string): Promise<boolean> {
    if (!this.apiKey()) {
      this.toastService.show('Please set your API key first', 'error');
      return false;
    }

    this.isProcessing.set(true);
    this.deploymentTracker.addEvent('command', `AI Command: "${command.substring(0, 40)}${command.length > 40 ? '...' : ''}"`, command);

    try {
      const response = await this.callAI(command);
      
      if (response) {
        // Update current content
        this.currentHTML.set(response.html);
        this.currentCSS.set(response.css);
        this.currentJS.set(response.js || '');
        
        // Add to command history
        this.commandHistory.update(history => [...history, command].slice(-100));
        this.canvasVersion.update(v => v + 1);
        
        // Add to edit history
        const historyItem: EditHistoryItem = {
          id: crypto.randomUUID(),
          command,
          timestamp: new Date(),
          html: response.html,
          css: response.css,
          js: response.js
        };
        this.editHistory.update(history => [historyItem, ...history].slice(0, 50));
        
        // Sync to cloud if connected
        if (this.sharedCanvas.isConnected()) {
          await this.sharedCanvas.saveState({
            html: response.html,
            css: response.css,
            js: response.js || ''
          }, command);
          this.deploymentTracker.addEvent('deployed', 'Canvas synced to cloud!');
        } else {
          this.deploymentTracker.addEvent('deployed', 'Canvas evolved locally');
        }
        
        this.toastService.show(response.description || 'Website evolved!', 'success');
        return true;
      }
    } catch (error: any) {
      console.error('AI processing error:', error);
      this.deploymentTracker.addEvent('error', 'Failed to process AI command');
      this.toastService.show(error.message || 'Failed to process command', 'error');
    } finally {
      this.isProcessing.set(false);
    }

    return false;
  }

  private async callAI(command: string): Promise<AIResponse | null> {
    const provider = this.apiProvider();
    const currentHTML = this.currentHTML();
    const currentCSS = this.currentCSS();
    const currentJS = this.currentJS();
    const history = this.commandHistory().slice(-10);

    const systemPrompt = `You are an expert web developer AI that builds and evolves complex, beautiful websites.
You're working on a LIVING website that evolves with each user command.

═══════════════════════════════════════════════════════════════
CURRENT WEBSITE STATE (Version ${this.canvasVersion()})
═══════════════════════════════════════════════════════════════

HTML:
${currentHTML}

CSS:
${currentCSS}

JavaScript:
${currentJS || '(none yet)'}

Recent Evolution History:
${history.length > 0 ? history.map((c, i) => `${i + 1}. "${c}"`).join('\n') : '(Fresh canvas)'}

═══════════════════════════════════════════════════════════════
YOUR MISSION
═══════════════════════════════════════════════════════════════

BUILD upon the existing website. Don't start from scratch unless asked.
The website should EVOLVE and become more sophisticated over time.

CAPABILITIES:
✅ Complex multi-section layouts (headers, heroes, features, footers)
✅ Interactive elements (buttons, forms, accordions, tabs, modals)
✅ Animations and transitions (CSS animations, hover effects)
✅ Data displays (cards, tables, charts with CSS, dashboards)
✅ Navigation systems (navbars, sidebars, breadcrumbs)
✅ Media elements (image placeholders, video embeds via placeholder)
✅ Modern UI patterns (glassmorphism, gradients, shadows)
✅ Responsive design principles
✅ JavaScript for interactivity (event handlers, state changes)

DESIGN RULES:
1. Use CSS variables for theming: --text-primary, --text-secondary, --text-muted
   --accent-cyan, --accent-purple, --accent-pink, --accent-indigo
   --bg-primary, --bg-secondary, --bg-tertiary, --bg-card
   --border-light, --border-subtle, --success, --warning, --error
2. Make it visually STUNNING - use gradients, shadows, animations
3. Build FUNCTIONAL elements that work (buttons click, forms respond)
4. Use semantic HTML and modern CSS (flexbox, grid)
5. Add subtle animations for polish
6. Use placeholder images: https://picsum.photos/WIDTH/HEIGHT

JAVASCRIPT RULES:
- Write vanilla JavaScript (no frameworks)
- Use event delegation when possible
- Keep state in data attributes or simple variables
- Make interactive elements actually work!

═══════════════════════════════════════════════════════════════

Respond ONLY with a valid JSON object (no markdown, no code blocks):
{"html": "...", "css": "...", "js": "...", "description": "Brief description"}

The description should be short (under 50 chars) and describe what evolved.`;

    const userMessage = `Command: ${command}`;

    if (provider === 'openai') {
      return await this.callOpenAI(systemPrompt, userMessage);
    } else {
      return await this.callAnthropic(systemPrompt, userMessage);
    }
  }

  private async callOpenAI(systemPrompt: string, userMessage: string): Promise<AIResponse | null> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey()}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 16000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    return this.parseAIResponse(content);
  }

  private async callAnthropic(systemPrompt: string, userMessage: string): Promise<AIResponse | null> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey()!,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    const content = data.content[0]?.text;
    
    return this.parseAIResponse(content);
  }

  private parseAIResponse(content: string | undefined): AIResponse | null {
    if (!content) return null;
    
    try {
      let jsonStr = content.trim();
      
      // Handle markdown code blocks
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```\s*$/g, '').trim();
      }
      
      // Try to find JSON object in the response
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonStr);
      
      // Validate required fields
      if (!parsed.html || !parsed.css) {
        throw new Error('Missing required fields');
      }
      
      return {
        html: parsed.html,
        css: parsed.css,
        js: parsed.js || '',
        description: parsed.description || 'Website updated'
      };
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('AI returned invalid format. Try again.');
    }
  }

  clearCanvas() {
    this.currentHTML.set(this.getDefaultHTML());
    this.currentCSS.set(this.getDefaultCSS());
    this.currentJS.set('');
    this.saveCanvasState();
    this.toastService.show('Canvas cleared!', 'info');
  }

  resetToDefault() {
    this.currentHTML.set(this.getDefaultHTML());
    this.currentCSS.set(this.getDefaultCSS());
    this.currentJS.set('');
    this.editHistory.set([]);
    this.commandHistory.set([]);
    this.canvasVersion.set(0);
    localStorage.removeItem(STORAGE_KEY);
    this.toastService.show('Reset to default!', 'info');
  }

  getCanvasStats() {
    return {
      version: this.canvasVersion(),
      totalCommands: this.commandHistory().length,
      lastCommands: this.commandHistory().slice(-5)
    };
  }

  private getDefaultHTML(): string {
    return `<div class="landing-page">
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <span class="hero-badge">✨ AI-Powered Evolution</span>
      <h1 class="hero-title">The Living Website</h1>
      <p class="hero-subtitle">
        This website evolves with every command. Each visitor shapes its destiny.
        Type a command below and watch it transform.
      </p>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-value">v0</span>
          <span class="stat-label">Version</span>
        </div>
        <div class="stat">
          <span class="stat-value">0</span>
          <span class="stat-label">Evolutions</span>
        </div>
        <div class="stat">
          <span class="stat-value">∞</span>
          <span class="stat-label">Possibilities</span>
        </div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
  </section>

  <!-- Examples Section -->
  <section class="examples">
    <h2>Try These Commands</h2>
    <div class="example-grid">
      <div class="example-card">
        <span class="example-icon">🎨</span>
        <p>"Add a colorful pricing section"</p>
      </div>
      <div class="example-card">
        <span class="example-icon">📊</span>
        <p>"Create a dashboard with stats"</p>
      </div>
      <div class="example-card">
        <span class="example-icon">🛒</span>
        <p>"Build a product showcase"</p>
      </div>
      <div class="example-card">
        <span class="example-icon">📝</span>
        <p>"Add a contact form"</p>
      </div>
    </div>
  </section>
</div>`;
  }

  private getDefaultCSS(): string {
    return `.landing-page {
  min-height: 100%;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem 2rem;
  min-height: 60vh;
  align-items: center;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  color: white;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 2rem 0;
  max-width: 500px;
}

.hero-stats {
  display: flex;
  gap: 2rem;
}

@media (max-width: 768px) {
  .hero-stats {
    justify-content: center;
  }
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-cyan);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Hero Visual */
.hero-visual {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  top: 40%;
  right: 20%;
  animation-delay: -2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-cyan));
  bottom: 20%;
  left: 40%;
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
  50% { 
    transform: translateY(-20px) rotate(10deg);
    border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
  }
}

/* Examples Section */
.examples {
  padding: 4rem 2rem;
  text-align: center;
}

.examples h2 {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin: 0 0 2rem 0;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.example-card {
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.example-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-purple);
  box-shadow: 0 12px 40px -12px rgba(124, 58, 237, 0.25);
}

.example-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.example-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}`;
  }
}
