import { Component, signal, ElementRef, ViewChild, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { DeploymentTrackerService } from '../../services/deployment-tracker.service';
import { AIEditorService } from '../../services/ai-editor.service';

/**
 * CommandInputComponent - Protected Command Input
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * Premium command interface with advanced feedback and suggestions.
 * Now designed to work inside a draggable container.
 */
@Component({
  selector: 'app-command-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="command-panel">
      <!-- Header -->
      <div class="command-header">
        <div class="header-left">
          <div class="ai-indicator">
            <span class="ai-dot" [class.active]="aiEditor.isProcessing()" [class.no-key]="!aiEditor.hasApiKey()"></span>
            <span class="ai-text">{{ getStatusText() }}</span>
          </div>
        </div>
        <div class="header-right">
          <button class="api-key-btn" (click)="openApiKeyModal.emit()" [class.configured]="aiEditor.hasApiKey()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
            <span>{{ aiEditor.hasApiKey() ? 'API Key ✓' : 'Set API Key' }}</span>
          </button>
          <span class="keyboard-hint">
            <kbd>Enter</kbd> to send
          </span>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area" [class.focused]="isFocused()" [class.processing]="isProcessing()">
        <div class="input-icon">
          @if (isProcessing()) {
            <div class="spinner"></div>
          } @else {
            <span class="sparkle">✨</span>
          }
        </div>
        
        <textarea
          #inputField
          [(ngModel)]="command"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown)="onKeyDown($event)"
          (input)="onInput()"
          placeholder="Describe what you want to change..."
          [disabled]="isProcessing()"
          rows="1"
        ></textarea>
        
        <button 
          class="send-btn" 
          (click)="submitCommand()"
          [disabled]="!command.trim() || isProcessing()"
          [class.ready]="command.trim() && !isProcessing()"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>

      <!-- Status Message -->
      @if (statusMessage()) {
        <div class="status-bar" [class]="statusType()">
          <span class="status-icon">{{ getStatusIcon() }}</span>
          <span class="status-text">{{ statusMessage() }}</span>
          <button class="dismiss-btn" (click)="dismissStatus()">×</button>
        </div>
      }

      <!-- Quick Actions -->
      <div class="quick-actions" [class.hidden]="isFocused() || command">
        <span class="actions-label">Try:</span>
        <div class="action-chips">
          @for (suggestion of suggestions; track suggestion) {
            <button class="chip" (click)="useSuggestion(suggestion)">
              {{ suggestion }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Command Panel - Theme-aware */
    .command-panel {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-glass);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border-glow);
      border-radius: var(--radius-xl);
      padding: 14px 16px;
      box-shadow: var(--shadow-glow);
    }

    /* Header */
    .command-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .ai-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ai-dot {
      width: 6px;
      height: 6px;
      background: var(--success);
      border-radius: 50%;
      transition: var(--transition-base);
    }

    .ai-dot.active {
      background: var(--accent-cyan);
      animation: pulse-glow 1.5s ease-in-out infinite;
    }

    .ai-dot.no-key {
      background: var(--warning);
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 4px var(--accent-cyan); }
      50% { box-shadow: 0 0 12px var(--accent-cyan); }
    }

    .ai-text {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .api-key-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: color-mix(in srgb, var(--warning) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--warning) 30%, transparent);
      border-radius: var(--radius-md);
      color: var(--warning);
      font-size: 0.65rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .api-key-btn:hover {
      background: color-mix(in srgb, var(--warning) 25%, transparent);
    }

    .api-key-btn.configured {
      background: color-mix(in srgb, var(--success) 15%, transparent);
      border-color: color-mix(in srgb, var(--success) 30%, transparent);
      color: var(--success);
    }

    .api-key-btn.configured:hover {
      background: color-mix(in srgb, var(--success) 25%, transparent);
    }

    .keyboard-hint {
      font-size: 0.65rem;
      color: var(--text-dim);
    }

    .keyboard-hint kbd {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-subtle);
      border-radius: 3px;
      padding: 1px 5px;
      font-family: var(--font-mono);
      font-size: 0.6rem;
    }

    /* Input Area */
    .input-area {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 10px 14px;
      transition: var(--transition-base);
    }

    .input-area.focused {
      border-color: var(--accent-indigo);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent-indigo) 15%, transparent);
    }

    .input-area.processing {
      border-color: var(--accent-cyan);
    }

    .input-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .sparkle {
      font-size: 1rem;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--border-light);
      border-top-color: var(--accent-cyan);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    textarea {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 0.9rem;
      line-height: 1.4;
      resize: none;
      min-height: 20px;
      max-height: 80px;
    }

    textarea::placeholder {
      color: var(--text-dim);
    }

    textarea:disabled {
      opacity: 0.6;
    }

    /* Send Button */
    .send-btn {
      width: 36px;
      height: 36px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: var(--transition-base);
    }

    .send-btn svg {
      width: 16px;
      height: 16px;
      transition: var(--transition-base);
    }

    .send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .send-btn.ready {
      background: var(--gradient-primary);
      border-color: transparent;
      color: white;
      box-shadow: 0 0 20px color-mix(in srgb, var(--accent-purple) 40%, transparent);
    }

    .send-btn.ready:hover {
      transform: scale(1.05);
    }

    .send-btn.ready svg {
      transform: rotate(-45deg);
    }

    /* Status Bar */
    .status-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      padding: 8px 12px;
      border-radius: var(--radius-md);
      font-size: 0.75rem;
    }

    .status-bar.success {
      background: color-mix(in srgb, var(--success) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--success) 25%, transparent);
      color: var(--success);
    }

    .status-bar.error {
      background: color-mix(in srgb, var(--error) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--error) 25%, transparent);
      color: var(--error);
    }

    .status-bar.info {
      background: color-mix(in srgb, var(--accent-cyan) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent-cyan) 25%, transparent);
      color: var(--accent-cyan);
    }

    .status-text {
      flex: 1;
    }

    .dismiss-btn {
      background: transparent;
      border: none;
      color: inherit;
      opacity: 0.6;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      padding: 0;
      transition: var(--transition-fast);
    }

    .dismiss-btn:hover {
      opacity: 1;
    }

    /* Quick Actions */
    .quick-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      transition: var(--transition-base);
      overflow: hidden;
    }

    .quick-actions.hidden {
      opacity: 0;
      height: 0;
      margin-top: 0;
    }

    .actions-label {
      font-size: 0.65rem;
      color: var(--text-dim);
      white-space: nowrap;
    }

    .action-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .chip {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      padding: 4px 10px;
      font-size: 0.65rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: var(--transition-fast);
      font-family: var(--font-body);
    }

    .chip:hover {
      border-color: var(--accent-purple);
      background: color-mix(in srgb, var(--accent-purple) 15%, transparent);
      color: var(--accent-purple);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .command-panel {
        padding: 12px;
      }

      .keyboard-hint {
        display: none;
      }

      .quick-actions {
        flex-wrap: wrap;
      }

      .action-chips {
        overflow-x: auto;
        flex-wrap: nowrap;
      }

      .chip {
        flex-shrink: 0;
      }
    }
  `]
})
export class CommandInputComponent {
  @ViewChild('inputField') inputField!: ElementRef<HTMLTextAreaElement>;
  
  openApiKeyModal = output<void>();
  
  command = '';
  isFocused = signal(false);
  statusMessage = signal('');
  statusType = signal<'success' | 'error' | 'info'>('info');

  private toastService = inject(ToastService);
  private deploymentTracker = inject(DeploymentTrackerService);
  aiEditor = inject(AIEditorService);

  suggestions = [
    'Create a weather widget',
    'Add a colorful gradient',
    'Build a todo list'
  ];

  getStatusText(): string {
    if (this.aiEditor.isProcessing()) return 'Processing...';
    if (!this.aiEditor.hasApiKey()) return 'No API Key';
    return 'AI Ready';
  }

  isProcessing(): boolean {
    return this.aiEditor.isProcessing();
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
  }

  onInput() {
    const textarea = this.inputField?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitCommand();
    }
  }

  useSuggestion(suggestion: string) {
    this.command = suggestion;
    this.inputField?.nativeElement?.focus();
  }

  dismissStatus() {
    this.statusMessage.set('');
  }

  getStatusIcon(): string {
    switch (this.statusType()) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'info': return '→';
      default: return '•';
    }
  }

  async submitCommand() {
    if (!this.command.trim() || this.isProcessing()) return;

    if (!this.aiEditor.hasApiKey()) {
      this.toastService.show('Please set your API key first', 'error');
      this.openApiKeyModal.emit();
      return;
    }

    const userCommand = this.command.trim();
    this.command = '';
    this.statusMessage.set('AI is transforming the canvas...');
    this.statusType.set('info');

    if (this.inputField?.nativeElement) {
      this.inputField.nativeElement.style.height = 'auto';
    }

    try {
      const success = await this.aiEditor.processCommand(userCommand);
      
      if (success) {
        this.statusMessage.set('Canvas updated successfully!');
        this.statusType.set('success');
      } else {
        this.statusMessage.set('Failed to process command. Check your API key.');
        this.statusType.set('error');
      }
    } catch (error: any) {
      this.statusMessage.set(`Error: ${error.message || 'Failed to process command'}`);
      this.statusType.set('error');
    } finally {
      setTimeout(() => {
        this.statusMessage.set('');
      }, 5000);
    }
  }
}
