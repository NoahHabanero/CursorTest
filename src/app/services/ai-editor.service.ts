import { Injectable, signal } from '@angular/core';
import { ToastService } from './toast.service';
import { DeploymentTrackerService } from './deployment-tracker.service';

export interface AIResponse {
  html: string;
  css: string;
  description: string;
}

export interface EditHistoryItem {
  id: string;
  command: string;
  timestamp: Date;
  html: string;
  css: string;
}

/**
 * AI Editor Service - Connects to AI API to generate page edits
 */
@Injectable({
  providedIn: 'root'
})
export class AIEditorService {
  private apiKey = signal<string | null>(null);
  private apiProvider = signal<'openai' | 'anthropic'>('openai');
  
  isProcessing = signal<boolean>(false);
  currentHTML = signal<string>(this.getDefaultHTML());
  currentCSS = signal<string>(this.getDefaultCSS());
  editHistory = signal<EditHistoryItem[]>([]);
  
  constructor(
    private toastService: ToastService,
    private deploymentTracker: DeploymentTrackerService
  ) {
    // Load API key from localStorage
    const savedKey = localStorage.getItem('ai-editor-api-key');
    const savedProvider = localStorage.getItem('ai-editor-provider') as 'openai' | 'anthropic';
    if (savedKey) this.apiKey.set(savedKey);
    if (savedProvider) this.apiProvider.set(savedProvider);
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
        
        // Add to history
        const historyItem: EditHistoryItem = {
          id: crypto.randomUUID(),
          command,
          timestamp: new Date(),
          html: response.html,
          css: response.css
        };
        this.editHistory.update(history => [historyItem, ...history].slice(0, 50));
        
        this.deploymentTracker.addEvent('deployed', 'Canvas updated successfully!');
        this.toastService.show(response.description || 'Changes applied!', 'success');
        return true;
      }
    } catch (error) {
      console.error('AI processing error:', error);
      this.deploymentTracker.addEvent('error', 'Failed to process AI command');
      this.toastService.show('Failed to process command', 'error');
    } finally {
      this.isProcessing.set(false);
    }

    return false;
  }

  private async callAI(command: string): Promise<AIResponse | null> {
    const provider = this.apiProvider();
    const currentHTML = this.currentHTML();
    const currentCSS = this.currentCSS();

    const systemPrompt = `You are an AI that generates HTML and CSS for a web dashboard sandbox.
The user will describe what they want, and you must generate the HTML and inline styles.

CURRENT STATE:
HTML:
${currentHTML}

CSS:
${currentCSS}

RULES:
1. Generate valid HTML that will be injected into a sandbox container
2. Use inline styles or generate CSS that will be scoped to the sandbox
3. Make it visually appealing with modern design
4. Use CSS variables for theming: --text-primary, --text-secondary, --accent-cyan, --accent-purple, --accent-pink, --bg-card, --bg-tertiary, --border-light, --success, --warning, --error
5. Be creative and make impressive visual designs
6. You can use emojis, gradients, animations, flexbox, grid
7. Keep it self-contained - no external dependencies

Respond ONLY with a JSON object in this exact format (no markdown, no code blocks):
{"html": "<your html here>", "css": "<your css here>", "description": "Brief description of changes"}`;

    const userMessage = `User command: ${command}`;

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
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        // Try to parse as JSON, handling potential markdown code blocks
        let jsonStr = content.trim();
        if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
        }
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error('Failed to parse AI response:', content);
        throw new Error('Invalid AI response format');
      }
    }

    return null;
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
        max_tokens: 4000,
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
    
    if (content) {
      try {
        let jsonStr = content.trim();
        if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
        }
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error('Failed to parse AI response:', content);
        throw new Error('Invalid AI response format');
      }
    }

    return null;
  }

  clearCanvas() {
    this.currentHTML.set(this.getDefaultHTML());
    this.currentCSS.set(this.getDefaultCSS());
    this.toastService.show('Canvas cleared!', 'info');
  }

  resetToDefault() {
    this.clearCanvas();
    this.editHistory.set([]);
    this.toastService.show('Reset to default!', 'info');
  }

  private getDefaultHTML(): string {
    return `<div class="welcome-container">
  <div class="welcome-icon">🎨</div>
  <h1 class="welcome-title">AI-Powered Canvas</h1>
  <p class="welcome-subtitle">Type a command to transform this space</p>
  <div class="welcome-examples">
    <div class="example-chip">Try: "Create a weather widget"</div>
    <div class="example-chip">Try: "Add a colorful gradient background"</div>
    <div class="example-chip">Try: "Build a todo list"</div>
  </div>
</div>`;
  }

  private getDefaultCSS(): string {
    return `.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 2rem;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
}

.welcome-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.example-chip {
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.example-chip:hover {
  border-color: var(--accent-purple);
  color: var(--text-primary);
  transform: translateY(-2px);
}`;
  }
}

