import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIEditorService } from '../../services/ai-editor.service';

@Component({
  selector: 'app-api-key-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>🔑 API Configuration</h2>
          <button class="close-btn" (click)="close.emit()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="description">
            Enter your API key to enable AI-powered page editing. Your key is stored locally and never sent to our servers.
          </p>

          <div class="provider-selector">
            <button 
              class="provider-btn" 
              [class.active]="selectedProvider() === 'openai'"
              (click)="selectedProvider.set('openai')">
              <span class="provider-icon">🤖</span>
              <span>OpenAI</span>
            </button>
            <button 
              class="provider-btn" 
              [class.active]="selectedProvider() === 'anthropic'"
              (click)="selectedProvider.set('anthropic')">
              <span class="provider-icon">🧠</span>
              <span>Anthropic</span>
            </button>
          </div>

          <div class="input-group">
            <label>{{ selectedProvider() === 'openai' ? 'OpenAI' : 'Anthropic' }} API Key</label>
            <div class="input-wrapper">
              <input 
                [type]="showKey() ? 'text' : 'password'"
                [(ngModel)]="apiKey"
                [placeholder]="selectedProvider() === 'openai' ? 'sk-...' : 'sk-ant-...'"
              />
              <button class="toggle-visibility" (click)="showKey.set(!showKey())">
                @if (showKey()) {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                }
              </button>
            </div>
          </div>

          <div class="help-text">
            @if (selectedProvider() === 'openai') {
              <p>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Dashboard</a></p>
              <p class="model-info">Uses: GPT-4o</p>
            } @else {
              <p>Get your API key from <a href="https://console.anthropic.com/" target="_blank">Anthropic Console</a></p>
              <p class="model-info">Uses: Claude Sonnet 4</p>
            }
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" (click)="close.emit()">Cancel</button>
          <button class="save-btn" (click)="saveKey()" [disabled]="!apiKey">
            Save Key
          </button>
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
      max-width: 480px;
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
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

    .description {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    .provider-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .provider-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--bg-tertiary);
      border: 2px solid var(--border-light);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-secondary);
    }

    .provider-btn:hover {
      border-color: var(--accent-purple);
      background: color-mix(in srgb, var(--accent-purple) 5%, var(--bg-tertiary));
    }

    .provider-btn.active {
      border-color: var(--accent-purple);
      background: color-mix(in srgb, var(--accent-purple) 10%, var(--bg-tertiary));
      color: var(--text-primary);
    }

    .provider-icon {
      font-size: 1.5rem;
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

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper input {
      width: 100%;
      padding: 0.75rem 1rem;
      padding-right: 3rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.95rem;
      font-family: monospace;
      transition: all 0.2s ease;
    }

    .input-wrapper input:focus {
      outline: none;
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-purple) 15%, transparent);
    }

    .input-wrapper input::placeholder {
      color: var(--text-dim);
    }

    .toggle-visibility {
      position: absolute;
      right: 0.75rem;
      background: transparent;
      border: none;
      padding: 0.25rem;
      cursor: pointer;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .toggle-visibility:hover {
      color: var(--text-primary);
    }

    .help-text {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .help-text a {
      color: var(--accent-cyan);
      text-decoration: none;
    }

    .help-text a:hover {
      text-decoration: underline;
    }

    .model-info {
      margin-top: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-subtle);
    }

    .cancel-btn, .save-btn {
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

    .save-btn {
      background: var(--accent-purple);
      border: none;
      color: white;
    }

    .save-btn:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ApiKeyModalComponent {
  close = output<void>();
  
  private aiEditor = inject(AIEditorService);
  
  selectedProvider = signal<'openai' | 'anthropic'>(this.aiEditor.getProvider());
  showKey = signal(false);
  apiKey = '';

  saveKey() {
    if (this.apiKey) {
      this.aiEditor.setApiKey(this.apiKey, this.selectedProvider());
      this.close.emit();
    }
  }
}

