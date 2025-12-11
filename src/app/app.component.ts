import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { CommandInputComponent } from './components/command-input/command-input.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';

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
    DashboardContentComponent
  ],
  template: `
    <div class="app-container">
      <!-- PROTECTED: Navigation Header -->
      <app-burger-menu></app-burger-menu>

      <!-- EDITABLE: Main Content Area -->
      <main class="main-content">
        <app-dashboard-content></app-dashboard-content>
      </main>

      <!-- PROTECTED: Command Interface -->
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
      padding: 88px 24px 180px;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 80px 16px 200px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Self-Editing Dashboard';
}
