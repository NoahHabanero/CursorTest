import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

/**
 * ToastContainerComponent - Toast Notification Display
 * 
 * Renders all active toast notifications with animations.
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type" @slideIn>
          <div class="toast-icon">
            {{ getIcon(toast.type) }}
          </div>
          <div class="toast-content">
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" (click)="dismiss(toast.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="toast-progress" [style.animation-duration.ms]="toast.duration"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* PROTECTED FLOATING TOAST CONTAINER */
    .toast-container {
      position: fixed;
      top: 92px;
      right: 24px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: rgba(10, 10, 18, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: var(--radius-lg);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset,
        0 0 40px rgba(99, 102, 241, 0.1);
      animation: toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .toast.success {
      border-left: 4px solid var(--success);
    }

    .toast.error {
      border-left: 4px solid var(--error);
    }

    .toast.warning {
      border-left: 4px solid var(--warning);
    }

    .toast.info {
      border-left: 4px solid var(--accent-cyan);
    }

    .toast-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
    }

    .toast-message {
      font-size: 0.9rem;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-fast);
      flex-shrink: 0;
    }

    .toast-close svg {
      width: 16px;
      height: 16px;
    }

    .toast-close:hover {
      color: var(--text-primary);
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      animation: progress linear forwards;
    }

    .toast.success .toast-progress {
      background: var(--success);
    }

    .toast.error .toast-progress {
      background: var(--error);
    }

    .toast.warning .toast-progress {
      background: var(--warning);
    }

    .toast.info .toast-progress {
      background: var(--accent-cyan);
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateX(100px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }

    @media (max-width: 768px) {
      .toast-container {
        left: 16px;
        right: 16px;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '•';
    }
  }

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }
}

