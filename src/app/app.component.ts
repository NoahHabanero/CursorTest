import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { CommandInputComponent } from './components/command-input/command-input.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
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
    AnimatedBackgroundComponent
  ],
  template: `
    <div class="app-container">
      <!-- PROTECTED: Animated Background -->
      <app-animated-background></app-animated-background>

      <!-- PROTECTED: Navigation Header -->
      <app-burger-menu></app-burger-menu>

      <!-- EDITABLE: Main Content Area -->
      <main class="main-content">
        <app-dashboard-content></app-dashboard-content>
      </main>

      <!-- PROTECTED: Command Interface -->
      <app-command-input></app-command-input>

      <!-- PROTECTED: Toast Notifications -->
      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
    }

    .main-content {
      flex: 1;
      padding: 88px 24px 180px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 80px 16px 200px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Self-Editing Dashboard';
  private toastService = inject(ToastService);

  ngOnInit() {
    // Show welcome toast after a brief delay
    setTimeout(() => {
      this.toastService.success('Welcome to Self-Editing Dashboard! 🚀');
    }, 1500);
  }
}
