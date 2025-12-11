import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { CommandInputComponent } from './components/command-input/command-input.component';
import { SandboxCanvasComponent } from './components/sandbox-canvas/sandbox-canvas.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { KeyboardShortcutsComponent } from './components/keyboard-shortcuts/keyboard-shortcuts.component';
import { DraggableContainerComponent } from './components/draggable-container/draggable-container.component';
import { DeploymentTrackerComponent } from './components/deployment-tracker/deployment-tracker.component';
import { ApiKeyModalComponent } from './components/api-key-modal/api-key-modal.component';
import { ClearCanvasButtonComponent } from './components/clear-canvas-button/clear-canvas-button.component';
import { CloudConfigModalComponent } from './components/cloud-config-modal/cloud-config-modal.component';
import { ToastService } from './services/toast.service';
import { AIEditorService } from './services/ai-editor.service';
import { SharedCanvasService } from './services/shared-canvas.service';

/**
 * AppComponent - Main Application Shell
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * Protected elements float like lillies on a pond - draggable and minimizable.
 * The editable dashboard content lives beneath them.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BurgerMenuComponent,
    CommandInputComponent,
    SandboxCanvasComponent,
    ToastContainerComponent,
    AnimatedBackgroundComponent,
    SplashScreenComponent,
    KeyboardShortcutsComponent,
    DraggableContainerComponent,
    DeploymentTrackerComponent,
    ApiKeyModalComponent,
    ClearCanvasButtonComponent,
    CloudConfigModalComponent
  ],
  template: `
    <!-- Splash Screen -->
    <app-splash-screen (loadingComplete)="onLoadingComplete()"></app-splash-screen>

    <div class="app-container" [class.loaded]="isLoaded()">
      <!-- Background Layer (The Pond) -->
      <app-animated-background></app-animated-background>

      <!-- Editable Content Layer (Lives in the pond) -->
      <div class="pond-content">
        <div class="editable-zone">
          <div class="zone-label">
            <span class="zone-icon">🎨</span>
            <span>AI Canvas - Type a command to transform this</span>
          </div>
          <main class="main-content">
            <app-sandbox-canvas></app-sandbox-canvas>
          </main>
        </div>
      </div>

      <!-- API Key Modal -->
      @if (showApiKeyModal()) {
        <app-api-key-modal (close)="showApiKeyModal.set(false)"></app-api-key-modal>
      }

      <!-- Cloud Config Modal -->
      @if (showCloudConfigModal()) {
        <app-cloud-config-modal (close)="showCloudConfigModal.set(false)"></app-cloud-config-modal>
      }

      <!-- Floating Lillies Layer (Protected Elements) -->
      
      <!-- Navigation Header - Floating Lilly -->
      <app-draggable-container
        id="header"
        name="Navigation"
        icon="🧭"
        width="calc(100vw - 100px)"
        height="60px"
        [initialX]="50"
        [initialY]="12"
        [minimizedInitialX]="20"
        [minimizedInitialY]="20"
      >
        <app-burger-menu (openCloudConfig)="showCloudConfigModal.set(true)"></app-burger-menu>
      </app-draggable-container>

      <!-- Command Input - Floating Lilly -->
      <app-draggable-container
        id="command"
        name="Command Input"
        icon="💬"
        width="min(700px, calc(100vw - 40px))"
        height="auto"
        [initialX]="getCommandInitialX()"
        [initialY]="getCommandInitialY()"
        [minimizedInitialX]="20"
        [minimizedInitialY]="100"
      >
        <app-command-input (openApiKeyModal)="showApiKeyModal.set(true)"></app-command-input>
      </app-draggable-container>

      <!-- Clear Canvas Button - Floating Lilly -->
      <app-draggable-container
        id="clear"
        name="Canvas Controls"
        icon="🧹"
        width="auto"
        height="auto"
        [initialX]="20"
        [initialY]="getClearButtonInitialY()"
        [minimizedInitialX]="20"
        [minimizedInitialY]="260"
      >
        <app-clear-canvas-button></app-clear-canvas-button>
      </app-draggable-container>

      <!-- Deployment Tracker - Floating Lilly -->
      <app-draggable-container
        id="tracker"
        name="Activity Tracker"
        icon="📡"
        width="320px"
        height="400px"
        [initialX]="getTrackerInitialX()"
        [initialY]="90"
        [minimizedInitialX]="20"
        [minimizedInitialY]="180"
      >
        <app-deployment-tracker></app-deployment-tracker>
      </app-draggable-container>

      <!-- Toast Notifications -->
      <app-toast-container></app-toast-container>

      <!-- Keyboard Shortcuts Modal -->
      <app-keyboard-shortcuts></app-keyboard-shortcuts>

      <!-- Floating Help Button -->
      <div class="floating-help" (click)="showHelp()">
        <span class="help-icon">❓</span>
        <div class="help-tooltip">
          <strong>Drag & Drop!</strong><br>
          Protected elements can be<br>
          dragged around and minimized
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .app-container.loaded {
      opacity: 1;
    }

    /* Pond Content - The base layer */
    .pond-content {
      position: relative;
      min-height: 100vh;
      z-index: 1;
    }

    /* Editable Zone */
    .editable-zone {
      position: relative;
      margin: 90px 20px 200px;
      min-height: calc(100vh - 290px);
      border: 2px dashed rgba(5, 150, 105, 0.25);
      border-radius: var(--radius-2xl);
      background: rgba(5, 150, 105, 0.02);
      transition: var(--transition-base);
    }

    .editable-zone:hover {
      border-color: rgba(5, 150, 105, 0.4);
      background: rgba(5, 150, 105, 0.04);
    }

    .zone-label {
      position: absolute;
      top: -14px;
      left: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-void);
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.7rem;
      color: var(--success);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      border: 1px solid rgba(5, 150, 105, 0.25);
      z-index: 2;
    }

    .zone-icon {
      font-size: 0.85rem;
    }

    .main-content {
      padding: 40px 24px 24px;
      overflow-y: visible;
    }

    /* Floating Help Button */
    .floating-help {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(79, 70, 229, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 900;
      transition: var(--transition-base);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .floating-help:hover {
      border-color: rgba(79, 70, 229, 0.4);
      transform: scale(1.1);
      box-shadow: 0 8px 30px rgba(79, 70, 229, 0.15);
    }

    .help-icon {
      font-size: 1.2rem;
    }

    .help-tooltip {
      position: absolute;
      bottom: calc(100% + 12px);
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      border: 1px solid rgba(79, 70, 229, 0.2);
      border-radius: var(--radius-lg);
      padding: 12px 16px;
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: var(--transition-base);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      text-align: left;
      line-height: 1.5;
    }

    .help-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 18px;
      border: 6px solid transparent;
      border-top-color: rgba(79, 70, 229, 0.2);
    }

    .floating-help:hover .help-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .help-tooltip strong {
      color: var(--accent-indigo);
      display: block;
      margin-bottom: 4px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .editable-zone {
        margin: 85px 12px 220px;
      }

      .main-content {
        padding: 32px 16px 16px;
      }

      .zone-label {
        font-size: 0.6rem;
        padding: 4px 10px;
      }

      .floating-help {
        width: 40px;
        height: 40px;
        bottom: 12px;
        right: 12px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Self-Editing Dashboard';
  isLoaded = signal(false);
  showApiKeyModal = signal(false);
  showCloudConfigModal = signal(false);
  
  private toastService = inject(ToastService);
  private aiEditor = inject(AIEditorService);
  sharedCanvas = inject(SharedCanvasService);

  ngOnInit() {
    // Check if API key is configured
    if (!this.aiEditor.hasApiKey()) {
      setTimeout(() => {
        this.toastService.info('👋 Set your API key to start creating with AI!');
      }, 1500);
    }
  }

  onLoadingComplete() {
    this.isLoaded.set(true);
    
    // Show welcome toast after splash screen
    setTimeout(() => {
      this.toastService.info('🎨 Type a command to transform the canvas! Drag floating elements around.');
    }, 800);
  }

  getCommandInitialX(): number {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const commandWidth = Math.min(700, viewportWidth - 40);
    return Math.max(20, (viewportWidth - commandWidth) / 2);
  }

  getCommandInitialY(): number {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return viewportHeight - 180;
  }

  getTrackerInitialX(): number {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return viewportWidth - 340; // 320px width + 20px margin
  }

  getClearButtonInitialY(): number {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return viewportHeight - 100;
  }

  showHelp() {
    this.toastService.info('Press ? for keyboard shortcuts. Drag elements by their handle, minimize with −');
  }
}
