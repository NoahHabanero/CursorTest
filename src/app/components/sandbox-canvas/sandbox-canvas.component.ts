import { Component, inject, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
          <span class="sandbox-icon">🌐</span>
          <span>Living Website</span>
          <span class="version-badge">v{{ aiEditor.canvasVersion() }}</span>
        </div>
        <div class="sandbox-status">
          <span class="evolution-count">{{ aiEditor.commandHistory().length }} evolutions</span>
          <span class="sandbox-badge" [class.processing]="aiEditor.isProcessing()">
            {{ aiEditor.isProcessing() ? 'Evolving...' : 'Ready' }}
          </span>
        </div>
      </div>
      
      <div class="sandbox-container" #sandboxContainer>
        <style [innerHTML]="sanitizedCSS"></style>
        <div class="sandbox-content" #sandboxContent [innerHTML]="sanitizedHTML"></div>
      </div>

      @if (aiEditor.isProcessing()) {
        <div class="processing-overlay">
          <div class="processing-visual">
            <div class="dna-strand">
              <div class="dna-dot"></div>
              <div class="dna-dot"></div>
              <div class="dna-dot"></div>
              <div class="dna-dot"></div>
            </div>
          </div>
          <span class="processing-text">AI is evolving the website...</span>
          <span class="processing-subtext">This may take a few seconds</span>
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
      min-height: 500px;
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
      flex-shrink: 0;
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

    .version-badge {
      padding: 0.2rem 0.5rem;
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      color: white;
      border-radius: var(--radius-full);
      font-size: 0.65rem;
      font-weight: 600;
    }

    .sandbox-status {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .evolution-count {
      font-size: 0.75rem;
      color: var(--text-muted);
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
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      color: white;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @keyframes shimmer {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .sandbox-container {
      flex: 1;
      overflow: auto;
      position: relative;
      background: var(--bg-primary);
    }

    .sandbox-content {
      min-height: 100%;
      padding: 0;
    }

    /* Processing Overlay */
    .processing-overlay {
      position: absolute;
      inset: 0;
      background: color-mix(in srgb, var(--bg-primary) 90%, transparent);
      backdrop-filter: blur(8px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      z-index: 10;
    }

    .processing-visual {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dna-strand {
      display: flex;
      gap: 8px;
    }

    .dna-dot {
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      border-radius: 50%;
      animation: dna-bounce 1.4s ease-in-out infinite;
    }

    .dna-dot:nth-child(1) { animation-delay: 0s; }
    .dna-dot:nth-child(2) { animation-delay: 0.2s; }
    .dna-dot:nth-child(3) { animation-delay: 0.4s; }
    .dna-dot:nth-child(4) { animation-delay: 0.6s; }

    @keyframes dna-bounce {
      0%, 80%, 100% { 
        transform: scale(0.6) translateY(0);
        opacity: 0.5;
      }
      40% { 
        transform: scale(1) translateY(-20px);
        opacity: 1;
      }
    }

    .processing-text {
      color: var(--text-primary);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .processing-subtext {
      color: var(--text-muted);
      font-size: 0.85rem;
    }
  `]
})
export class SandboxCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sandboxContainer') sandboxContainer!: ElementRef;
  @ViewChild('sandboxContent') sandboxContent!: ElementRef;
  
  aiEditor = inject(AIEditorService);
  private sanitizer = inject(DomSanitizer);
  private currentScriptElements: HTMLScriptElement[] = [];
  
  sanitizedHTML: SafeHtml = '';
  sanitizedCSS: SafeHtml = '';

  constructor() {
    // Update content when AI changes it
    effect(() => {
      const html = this.aiEditor.currentHTML();
      const css = this.aiEditor.currentCSS();
      const js = this.aiEditor.currentJS();
      
      this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(html);
      this.sanitizedCSS = this.sanitizer.bypassSecurityTrustHtml(css);
      
      // Execute JavaScript after a small delay to ensure DOM is updated
      setTimeout(() => this.executeJavaScript(js), 100);
    });
  }

  ngAfterViewInit() {
    // Initial render
    this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(this.aiEditor.currentHTML());
    this.sanitizedCSS = this.sanitizer.bypassSecurityTrustHtml(this.aiEditor.currentCSS());
    
    setTimeout(() => {
      this.executeJavaScript(this.aiEditor.currentJS());
    }, 100);
  }

  ngOnDestroy() {
    this.cleanupScripts();
  }

  private executeJavaScript(js: string) {
    if (!js || !js.trim()) return;
    
    // Clean up previous scripts
    this.cleanupScripts();
    
    try {
      // Create a new script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      
      // Wrap the JS in an IIFE to avoid global scope pollution
      // and provide access to the sandbox container
      const wrappedJS = `
        (function() {
          try {
            const sandbox = document.querySelector('.sandbox-content');
            ${js}
          } catch (e) {
            console.error('Sandbox JS Error:', e);
          }
        })();
      `;
      
      script.textContent = wrappedJS;
      
      // Append to the sandbox container
      if (this.sandboxContent?.nativeElement) {
        this.sandboxContent.nativeElement.appendChild(script);
        this.currentScriptElements.push(script);
      }
    } catch (e) {
      console.error('Failed to execute sandbox JS:', e);
    }
  }

  private cleanupScripts() {
    this.currentScriptElements.forEach(script => {
      try {
        script.remove();
      } catch (e) {
        // Ignore cleanup errors
      }
    });
    this.currentScriptElements = [];
  }
}
