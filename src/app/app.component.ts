import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { CommandInputComponent } from './components/command-input/command-input.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';

/**
 * AppComponent - Main Application Shell
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * This component provides the main layout structure including:
 * - Protected burger menu (top-left)
 * - Protected command input (bottom)
 * - Editable dashboard content area (center)
 * 
 * Only the DashboardContentComponent can be edited via AI commands.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BurgerMenuComponent,
    CommandInputComponent,
    DashboardContentComponent
  ],
  template: `
    <div class="app-container">
      <!-- PROTECTED: Burger Menu -->
      <app-burger-menu></app-burger-menu>

      <!-- EDITABLE: Dashboard Content Area -->
      <main class="main-content">
        <app-dashboard-content></app-dashboard-content>
      </main>

      <!-- PROTECTED: Command Input -->
      <app-command-input></app-command-input>
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
      padding: 80px 24px 120px;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 70px 16px 140px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Self-Editing Dashboard';
}

