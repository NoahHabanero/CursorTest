import { Component, inject, effect, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AIEditorService } from '../../services/ai-editor.service';

@Component({
  selector: 'app-sandbox-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sandbox-wrapper">
      <div class="sandbox-header">
        <div class="sandbox-label">
          <span class="sandbox-icon">🎨</span>
          <span>AI Canvas</span>
          <span class="sandbox-badge" [class.processing]="aiEditor.isProcessing()">
            {{ aiEditor.isProcessing() ? 'Processing...' : 'Ready' }}
          </span>
        </div>
      </div>
      
      <div class="sandbox-container" #sandboxContainer>
        <style [innerHTML]="sanitizedCSS"></style>
        <div class="sandbox-content" [innerHTML]="sanitizedHTML"></div>
      </div>

      @if (aiEditor.isProcessing()) {
        <div class="processing-overlay">
          <div class="processing-spinner"></div>
          <span>AI is creating...</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .sandbox-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-light);
      overflow: hidden;
      position: relative;
    }

    .sandbox-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-light);
    }

    .sandbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .sandbox-icon {
      font-size: 1rem;
    }

    .sandbox-badge {
      padding: 0.25rem 0.5rem;
      background: color-mix(in srgb, var(--success) 15%, transparent);
      color: var(--success);
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sandbox-badge.processing {
      background: color-mix(in srgb, var(--warning) 15%, transparent);
      color: var(--warning);
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .sandbox-container {
      flex: 1;
      overflow: auto;
      padding: 1.5rem;
      position: relative;
    }

    .sandbox-content {
      min-height: 100%;
    }

    .processing-overlay {
      position: absolute;
      inset: 0;
      background: color-mix(in srgb, var(--bg-primary) 80%, transparent);
      backdrop-filter: blur(4px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      z-index: 10;
    }

    .processing-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border-light);
      border-top-color: var(--accent-purple);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .processing-overlay span {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
  `]
})
export class SandboxCanvasComponent implements AfterViewInit {
  @ViewChild('sandboxContainer') sandboxContainer!: ElementRef;
  
  aiEditor = inject(AIEditorService);
  private sanitizer = inject(DomSanitizer);
  
  sanitizedHTML: SafeHtml = '';
  sanitizedCSS: SafeHtml = '';

  constructor() {
    // Update content when AI changes it
    effect(() => {
      const html = this.aiEditor.currentHTML();
      const css = this.aiEditor.currentCSS();
      this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(html);
      this.sanitizedCSS = this.sanitizer.bypassSecurityTrustHtml(css);
    });
  }

  ngAfterViewInit() {
    // Initial render
    this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(this.aiEditor.currentHTML());
    this.sanitizedCSS = this.sanitizer.bypassSecurityTrustHtml(this.aiEditor.currentCSS());
  }
}

