import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIEditorService } from '../../services/ai-editor.service';

@Component({
  selector: 'app-clear-canvas-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="clear-button-wrapper">
      <button 
        class="clear-btn" 
        (click)="clearCanvas()"
        title="Clear Canvas"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
        <span>Clear</span>
      </button>
      
      <button 
        class="reset-btn" 
        (click)="resetAll()"
        title="Reset Everything"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/>
        </svg>
        <span>Reset</span>
      </button>
    </div>
  `,
  styles: [`
    .clear-button-wrapper {
      display: flex;
      gap: 8px;
    }

    .clear-btn, .reset-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border-radius: var(--radius-lg);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--border-light);
    }

    .clear-btn {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }

    .clear-btn:hover {
      background: color-mix(in srgb, var(--warning) 15%, transparent);
      border-color: var(--warning);
      color: var(--warning);
    }

    .reset-btn {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }

    .reset-btn:hover {
      background: color-mix(in srgb, var(--error) 15%, transparent);
      border-color: var(--error);
      color: var(--error);
    }

    .clear-btn:active, .reset-btn:active {
      transform: scale(0.98);
    }
  `]
})
export class ClearCanvasButtonComponent {
  private aiEditor = inject(AIEditorService);

  clearCanvas() {
    this.aiEditor.clearCanvas();
  }

  resetAll() {
    this.aiEditor.resetToDefault();
  }
}

