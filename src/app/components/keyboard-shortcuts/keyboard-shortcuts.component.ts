import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

/**
 * KeyboardShortcutsComponent - Keyboard Shortcuts Modal
 * 
 * Shows available keyboard shortcuts in a beautiful modal.
 */
@Component({
  selector: 'app-keyboard-shortcuts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" [class.open]="isOpen()" (click)="close()">
      <div class="modal-content glass-strong" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <span class="title-icon">⌨️</span>
            <h2>Keyboard Shortcuts</h2>
          </div>
          <button class="close-btn" (click)="close()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          @for (category of categories; track category) {
            <div class="shortcut-category">
              <h3 class="category-title">{{ category }}</h3>
              <div class="shortcuts-list">
                @for (shortcut of getShortcutsByCategory(category); track shortcut.description) {
                  <div class="shortcut-item">
                    <div class="shortcut-keys">
                      @for (key of shortcut.keys; track key; let last = $last) {
                        <kbd>{{ key }}</kbd>
                        @if (!last) {
                          <span class="key-separator">+</span>
                        }
                      }
                    </div>
                    <span class="shortcut-description">{{ shortcut.description }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="modal-footer">
          <span class="footer-hint">Press <kbd>?</kbd> anytime to show this menu</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 3000;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: var(--transition-base);
      padding: 24px;
    }

    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      width: 100%;
      max-width: 560px;
      max-height: 80vh;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      transform: scale(0.95) translateY(20px);
      transition: var(--transition-base);
      display: flex;
      flex-direction: column;
    }

    .modal-overlay.open .modal-content {
      transform: scale(1) translateY(0);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .modal-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-icon {
      font-size: 1.5rem;
    }

    .modal-title h2 {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-muted);
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: var(--error);
      color: var(--error);
    }

    .close-btn svg {
      width: 18px;
      height: 18px;
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .shortcut-category {
      margin-bottom: 24px;
    }

    .shortcut-category:last-child {
      margin-bottom: 0;
    }

    .category-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 12px;
      font-weight: 600;
    }

    .shortcuts-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .shortcut-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      transition: var(--transition-fast);
    }

    .shortcut-item:hover {
      border-color: var(--border-light);
      background: var(--bg-card-hover);
    }

    .shortcut-keys {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 28px;
      padding: 0 8px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-primary);
      box-shadow: 0 2px 0 var(--border-light);
    }

    .key-separator {
      color: var(--text-dim);
      font-size: 0.8rem;
    }

    .shortcut-description {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border-subtle);
      text-align: center;
    }

    .footer-hint {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .footer-hint kbd {
      min-width: 24px;
      height: 24px;
      padding: 0 6px;
    }

    @media (max-width: 640px) {
      .modal-content {
        max-height: 90vh;
      }

      .shortcut-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class KeyboardShortcutsComponent {
  isOpen = signal(false);

  shortcuts: Shortcut[] = [
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'General' },
    { keys: ['Esc'], description: 'Close modals / Cancel', category: 'General' },
    { keys: ['/', 'Ctrl', 'K'], description: 'Focus command input', category: 'Navigation' },
    { keys: ['G', 'H'], description: 'Go to GitHub repository', category: 'Navigation' },
    { keys: ['G', 'A'], description: 'Go to GitHub Actions', category: 'Navigation' },
    { keys: ['Enter'], description: 'Submit command', category: 'Commands' },
    { keys: ['Shift', 'Enter'], description: 'New line in command', category: 'Commands' },
    { keys: ['↑'], description: 'Previous command', category: 'Commands' },
    { keys: ['↓'], description: 'Next command', category: 'Commands' },
  ];

  categories = ['General', 'Navigation', 'Commands'];

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === '?' && !this.isInputFocused()) {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  private isInputFocused(): boolean {
    const active = document.activeElement;
    return active?.tagName === 'INPUT' || 
           active?.tagName === 'TEXTAREA' || 
           (active as HTMLElement)?.isContentEditable;
  }

  toggle() {
    this.isOpen.update(v => !v);
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  getShortcutsByCategory(category: string): Shortcut[] {
    return this.shortcuts.filter(s => s.category === category);
  }
}

