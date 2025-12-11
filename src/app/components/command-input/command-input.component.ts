import { Component, signal, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GitHubService } from '../../services/github.service';
import { ToastService } from '../../services/toast.service';

/**
 * CommandInputComponent - Protected Command Input
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * Premium command interface with advanced feedback and suggestions.
 */
@Component({
  selector: 'app-command-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="command-container">
      <!-- Background Glow -->
      <div class="command-glow"></div>
      
      <div class="command-wrapper">
        <!-- Header -->
        <div class="command-header">
          <div class="header-left">
            <div class="ai-indicator">
              <span class="ai-dot" [class.active]="isProcessing()"></span>
              <span class="ai-text">{{ isProcessing() ? 'AI Processing' : 'AI Ready' }}</span>
            </div>
          </div>
          <div class="header-right">
            <span class="keyboard-hint">
              <kbd>Enter</kbd> to send
              <span class="separator">•</span>
              <kbd>Shift+Enter</kbd> for new line
            </span>
            <span class="protected-badge">🔒</span>
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
          <div class="status-bar" [class]="statusType()" @slideUp>
            <span class="status-icon">{{ getStatusIcon() }}</span>
            <span class="status-text">{{ statusMessage() }}</span>
            <button class="dismiss-btn" (click)="dismissStatus()">×</button>
          </div>
        }

        <!-- Quick Actions -->
        <div class="quick-actions" [class.hidden]="isFocused() || command">
          <span class="actions-label">Quick suggestions:</span>
          <div class="action-chips">
            @for (suggestion of suggestions; track suggestion) {
              <button class="chip" (click)="useSuggestion(suggestion)">
                {{ suggestion }}
              </button>
            }
          </div>
        </div>

        <!-- Character Count -->
        @if (command) {
          <div class="char-count" [class.warning]="command.length > 400">
            {{ command.length }} / 500
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* PROTECTED FLOATING COMMAND INTERFACE */
    .command-container {
      position: fixed;
      bottom: 12px;
      left: 12px;
      right: 12px;
      padding: 0;
      z-index: 999;
      animation: float-up 0.5s ease forwards;
      animation-delay: 0.2s;
      opacity: 0;
    }

    @keyframes float-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .command-glow {
      display: none;
    }

    .command-wrapper {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      background: rgba(10, 10, 18, 0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: var(--radius-2xl);
      border: 1px solid rgba(99, 102, 241, 0.2);
      padding: 16px;
      box-shadow: 
        0 -8px 40px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset,
        0 0 80px rgba(99, 102, 241, 0.12),
        0 0 120px rgba(139, 92, 246, 0.08);
    }

    .command-wrapper::before {
      content: '🔒 Protected';
      position: absolute;
      top: -10px;
      left: 20px;
      font-size: 0.65rem;
      background: var(--bg-tertiary);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      color: var(--accent-purple);
    }

    /* Header */
    .command-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 0 4px;
    }

    .ai-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ai-dot {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      transition: var(--transition-base);
    }

    .ai-dot.active {
      background: var(--accent-cyan);
      animation: pulse-glow 1.5s ease-in-out infinite;
    }

    .ai-text {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .keyboard-hint {
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    .keyboard-hint kbd {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xs);
      padding: 2px 6px;
      font-family: var(--font-mono);
      font-size: 0.7rem;
    }

    .separator {
      margin: 0 6px;
      color: var(--border-light);
    }

    .protected-badge {
      font-size: 0.85rem;
    }

    /* Input Area */
    .input-area {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      background: rgba(18, 18, 31, 0.8);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 14px 18px;
      transition: var(--transition-base);
      position: relative;
      overflow: hidden;
    }

    .input-area::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-glow);
      opacity: 0;
      transition: var(--transition-base);
    }

    .input-area.focused {
      border-color: var(--accent-indigo);
      box-shadow: 
        0 0 0 3px rgba(99, 102, 241, 0.1),
        var(--shadow-glow-purple);
    }

    .input-area.focused::before {
      opacity: 1;
    }

    .input-area.processing {
      border-color: var(--accent-cyan);
      box-shadow: 
        0 0 0 3px rgba(0, 245, 255, 0.1),
        var(--shadow-glow-cyan);
    }

    .input-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .sparkle {
      font-size: 1.25rem;
      animation: float 3s ease-in-out infinite;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-light);
      border-top-color: var(--accent-cyan);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    textarea {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 1rem;
      line-height: 1.5;
      resize: none;
      min-height: 24px;
      max-height: 150px;
      position: relative;
    }

    textarea::placeholder {
      color: var(--text-dim);
    }

    textarea:disabled {
      opacity: 0.6;
    }

    /* Send Button */
    .send-btn {
      width: 48px;
      height: 48px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: var(--transition-base);
      position: relative;
    }

    .send-btn svg {
      width: 20px;
      height: 20px;
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
      box-shadow: var(--shadow-glow-purple);
    }

    .send-btn.ready:hover {
      transform: scale(1.05);
      box-shadow: 
        var(--shadow-glow-purple),
        0 0 30px rgba(139, 92, 246, 0.3);
    }

    .send-btn.ready svg {
      transform: rotate(-45deg);
    }

    /* Status Bar */
    .status-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      animation: slide-up 0.3s ease;
    }

    .status-bar.success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: var(--success);
    }

    .status-bar.error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: var(--error);
    }

    .status-bar.info {
      background: rgba(0, 245, 255, 0.1);
      border: 1px solid rgba(0, 245, 255, 0.2);
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
      font-size: 1.25rem;
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
      gap: 12px;
      margin-top: 12px;
      padding: 0 4px;
      transition: var(--transition-base);
    }

    .quick-actions.hidden {
      opacity: 0;
      transform: translateY(10px);
      pointer-events: none;
    }

    .actions-label {
      font-size: 0.75rem;
      color: var(--text-dim);
      white-space: nowrap;
    }

    .action-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      padding: 6px 14px;
      font-size: 0.75rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: var(--transition-fast);
      font-family: var(--font-body);
    }

    .chip:hover {
      border-color: var(--accent-purple);
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
    }

    /* Character Count */
    .char-count {
      position: absolute;
      bottom: -24px;
      right: 4px;
      font-size: 0.7rem;
      color: var(--text-dim);
      font-family: var(--font-mono);
    }

    .char-count.warning {
      color: var(--warning);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .command-container {
        left: 8px;
        right: 8px;
        bottom: 8px;
      }

      .command-wrapper {
        padding: 12px;
      }

      .keyboard-hint {
        display: none;
      }

      .quick-actions {
        flex-direction: column;
        align-items: flex-start;
      }

      .action-chips {
        width: 100%;
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 4px;
      }

      .chip {
        flex-shrink: 0;
      }
    }

    @keyframes slide-up {
      from { 
        opacity: 0; 
        transform: translateY(10px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `]
})
export class CommandInputComponent {
  @ViewChild('inputField') inputField!: ElementRef<HTMLTextAreaElement>;
  
  command = '';
  isFocused = signal(false);
  isProcessing = signal(false);
  statusMessage = signal('');
  statusType = signal<'success' | 'error' | 'info'>('info');

  suggestions = [
    'Add a welcome card',
    'Change the color scheme',
    'Add a statistics widget',
    'Create a todo list'
  ];

  private toastService = inject(ToastService);

  constructor(private githubService: GitHubService) {}

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
  }

  onInput() {
    // Auto-resize textarea
    const textarea = this.inputField?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
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

    const userCommand = this.command.trim();
    this.command = '';
    this.isProcessing.set(true);
    this.statusMessage.set('Sending command to AI agent...');
    this.statusType.set('info');

    // Reset textarea height
    if (this.inputField?.nativeElement) {
      this.inputField.nativeElement.style.height = 'auto';
    }

    try {
      const result = await this.githubService.createIssue(userCommand);
      
      if (result.success) {
        this.statusMessage.set('Command sent! AI agent is processing. Changes will deploy automatically.');
        this.statusType.set('success');
        this.toastService.success('Command sent! AI agent is processing your request.');
      } else {
        throw new Error(result.error || 'Failed to send command');
      }
    } catch (error: any) {
      this.statusMessage.set(`Error: ${error.message || 'Failed to send command'}`);
      this.statusType.set('error');
      this.toastService.error(`Failed to send command: ${error.message || 'Unknown error'}`);
    } finally {
      this.isProcessing.set(false);
      
      // Auto-dismiss after 8 seconds
      setTimeout(() => {
        this.statusMessage.set('');
      }, 8000);
    }
  }
}
