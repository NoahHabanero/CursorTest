import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { CommandInputComponent } from './components/command-input/command-input.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { KeyboardShortcutsComponent } from './components/keyboard-shortcuts/keyboard-shortcuts.component';
import { ToastService } from './services/toast.service';

/**
 * AppComponent - Main Application Shell
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * This component provides the main layout structure.
 * Only DashboardContentComponent can be edited via AI commands.
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
    KeyboardShortcutsComponent
  ],
  template: `
    <!-- Splash Screen -->
    <app-splash-screen (loadingComplete)="onLoadingComplete()"></app-splash-screen>

    <div class="app-container" [class.loaded]="isLoaded()">
      <!-- PROTECTED: Animated Background -->
      <app-animated-background></app-animated-background>

      <!-- PROTECTED: Floating Navigation Header -->
      <app-burger-menu></app-burger-menu>

      <!-- EDITABLE ZONE INDICATOR -->
      <div class="editable-zone-container">
        <div class="zone-label">
          <span class="zone-icon">✏️</span>
          <span>Editable Zone</span>
        </div>
        
        <!-- EDITABLE: Main Content Area -->
        <main class="main-content">
          <app-dashboard-content></app-dashboard-content>
        </main>
      </div>

      <!-- PROTECTED: Floating Command Interface -->
      <app-command-input></app-command-input>

      <!-- PROTECTED: Toast Notifications -->
      <app-toast-container></app-toast-container>

      <!-- PROTECTED: Keyboard Shortcuts Modal -->
      <app-keyboard-shortcuts></app-keyboard-shortcuts>
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

    /* Editable Zone Container */
    .editable-zone-container {
      position: relative;
      flex: 1;
      margin: 90px 12px 120px;
      border: 1px dashed rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-2xl);
      background: rgba(16, 185, 129, 0.02);
      transition: var(--transition-base);
    }

    .editable-zone-container:hover {
      border-color: rgba(16, 185, 129, 0.5);
      background: rgba(16, 185, 129, 0.03);
    }

    .zone-label {
      position: absolute;
      top: -12px;
      left: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-void);
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      font-size: 0.7rem;
      color: var(--success);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .zone-icon {
      font-size: 0.8rem;
    }

    .main-content {
      padding: 32px 24px 24px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }

    @media (max-width: 768px) {
      .editable-zone-container {
        margin: 85px 8px 140px;
      }

      .main-content {
        padding: 24px 16px 16px;
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
      this.toastService.success('Welcome to Self-Editing Dashboard! Press ? for shortcuts 🚀');
    }, 500);
  }
}
