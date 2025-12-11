import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GitHubService } from '../../services/github.service';

/**
 * CommandInputComponent - Protected Command Input
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * This component provides:
 * - Text input for user commands
 * - Command submission to AI agent
 * - Status feedback for command execution
 * 
 * This component can ONLY be edited manually in the codebase.
 */
@Component({
  selector: 'app-command-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="command-container">
      <div class="command-wrapper">
        <div class="command-header">
          <span class="command-icon">✨</span>
          <span class="command-label">Edit Dashboard with AI</span>
          <span class="protected-badge">🔒 Protected</span>
        </div>
        
        <div class="input-wrapper" [class.focused]="isFocused()" [class.processing]="isProcessing()">
          <textarea
            #commandInput
            [(ngModel)]="command"
            (focus)="isFocused.set(true)"
            (blur)="isFocused.set(false)"
            (keydown.enter)="onEnterPress($event)"
            placeholder="Describe the changes you want to make to the dashboard..."
            [disabled]="isProcessing()"
            rows="1"
          ></textarea>
          
          <button 
            class="send-btn" 
            (click)="submitCommand()"
            [disabled]="!command.trim() || isProcessing()"
          >
            @if (isProcessing()) {
              <span class="spinner"></span>
            } @else {
              <span class="send-icon">→</span>
            }
          </button>
        </div>

        @if (statusMessage()) {
          <div class="status-message" [class]="statusType()">
            {{ statusMessage() }}
          </div>
        }

        <div class="command-hints">
          <span class="hint">💡 Try: "Add a welcome card with my name"</span>
          <span class="hint">💡 Try: "Change the color scheme to blue"</span>
          <span class="hint">💡 Try: "Add a statistics widget showing visitor count"</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .command-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(10, 10, 15, 0.98) 80%, transparent);
      padding: 16px 24px 24px;
      z-index: 999;
    }

    .command-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }

    .command-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding-left: 4px;
    }

    .command-icon {
      font-size: 1.125rem;
    }

    .command-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .protected-badge {
      margin-left: auto;
      font-size: 0.75rem;
      color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.1);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
    }

    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 12px 16px;
      transition: all 0.3s ease;
    }

    .input-wrapper.focused {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .input-wrapper.processing {
      border-color: var(--warning);
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    textarea {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-family: var(--font-primary);
      font-size: 1rem;
      resize: none;
      min-height: 24px;
      max-height: 120px;
      line-height: 1.5;
    }

    textarea::placeholder {
      color: var(--text-muted);
    }

    textarea:disabled {
      opacity: 0.6;
    }

    .send-btn {
      width: 44px;
      height: 44px;
      background: var(--accent-gradient);
      border: none;
      border-radius: var(--radius-md);
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .send-btn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: var(--shadow-glow);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .status-message {
      margin-top: 12px;
      padding: 10px 16px;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      animation: slide-up 0.3s ease;
    }

    .status-message.success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--success);
    }

    .status-message.error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--error);
    }

    .status-message.info {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: var(--info);
    }

    .command-hints {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      padding-left: 4px;
    }

    .hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      background: var(--bg-tertiary);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .hint:hover {
      color: var(--text-secondary);
      background: var(--bg-card);
    }

    @media (max-width: 768px) {
      .command-container {
        padding: 12px 16px 20px;
      }

      .command-hints {
        display: none;
      }

      .protected-badge {
        display: none;
      }
    }
  `]
})
export class CommandInputComponent {
  command = '';
  isFocused = signal(false);
  isProcessing = signal(false);
  statusMessage = signal('');
  statusType = signal<'success' | 'error' | 'info'>('info');

  constructor(private githubService: GitHubService) {}

  onEnterPress(event: Event) {
    const keyEvent = event as KeyboardEvent;
    if (!keyEvent.shiftKey) {
      keyEvent.preventDefault();
      this.submitCommand();
    }
  }

  async submitCommand() {
    if (!this.command.trim() || this.isProcessing()) return;

    const userCommand = this.command.trim();
    this.command = '';
    this.isProcessing.set(true);
    this.statusMessage.set('🚀 Sending command to AI agent...');
    this.statusType.set('info');

    try {
      const result = await this.githubService.createIssue(userCommand);
      
      if (result.success) {
        this.statusMessage.set('✅ Command sent! AI agent is processing your request. Check the deployment status for updates.');
        this.statusType.set('success');
      } else {
        throw new Error(result.error || 'Failed to create issue');
      }
    } catch (error: any) {
      this.statusMessage.set(`❌ Error: ${error.message || 'Failed to send command'}`);
      this.statusType.set('error');
    } finally {
      this.isProcessing.set(false);
      
      // Clear status after 10 seconds
      setTimeout(() => {
        this.statusMessage.set('');
      }, 10000);
    }
  }
}

