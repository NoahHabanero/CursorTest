import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { CommandInputComponent } from './components/command-input/command-input.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { KeyboardShortcutsComponent } from './components/keyboard-shortcuts/keyboard-shortcuts.component';
import { DraggableContainerComponent } from './components/draggable-container/draggable-container.component';
import { ToastService } from './services/toast.service';

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
    DashboardContentComponent,
    ToastContainerComponent,
    AnimatedBackgroundComponent,
    SplashScreenComponent,
    KeyboardShortcutsComponent,
    DraggableContainerComponent
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
            <span class="zone-icon">✏️</span>
            <span>Editable Zone - AI Can Modify This</span>
          </div>
          <main class="main-content">
            <app-dashboard-content></app-dashboard-content>
          </main>
        </div>
      </div>

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
        <app-burger-menu></app-burger-menu>
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
        <app-command-input></app-command-input>
      </app-draggable-container>

      <!-- Toast Notifications - Still floating but not draggable -->
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
      border: 2px dashed rgba(16, 185, 129, 0.25);
      border-radius: var(--radius-2xl);
      background: rgba(16, 185, 129, 0.02);
      transition: var(--transition-base);
    }

    .editable-zone:hover {
      border-color: rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.04);
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
      border: 1px solid rgba(16, 185, 129, 0.3);
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
      background: rgba(10, 10, 18, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 900;
      transition: var(--transition-base);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .floating-help:hover {
      border-color: rgba(99, 102, 241, 0.6);
      transform: scale(1.1);
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.2);
    }

    .help-icon {
      font-size: 1.2rem;
    }

    .help-tooltip {
      position: absolute;
      bottom: calc(100% + 12px);
      right: 0;
      background: rgba(10, 10, 18, 0.98);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: var(--radius-lg);
      padding: 12px 16px;
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: var(--transition-base);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      text-align: left;
      line-height: 1.5;
    }

    .help-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 18px;
      border: 6px solid transparent;
      border-top-color: rgba(99, 102, 241, 0.3);
    }

    .floating-help:hover .help-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .help-tooltip strong {
      color: var(--accent-cyan);
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
  private toastService = inject(ToastService);

  ngOnInit() {
    // App initialization
  }

  onLoadingComplete() {
    this.isLoaded.set(true);
    
    // Show welcome toast after splash screen
    setTimeout(() => {
      this.toastService.info('🪷 Drag the floating elements around! Minimize them by clicking the − button.');
    }, 800);
  }

  getCommandInitialX(): number {
    // Center the command input
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const commandWidth = Math.min(700, viewportWidth - 40);
    return Math.max(20, (viewportWidth - commandWidth) / 2);
  }

  getCommandInitialY(): number {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return viewportHeight - 180;
  }

  showHelp() {
    this.toastService.info('Press ? for keyboard shortcuts. Drag elements by their handle, minimize with −');
  }
}
