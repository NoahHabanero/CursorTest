import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * BurgerMenuComponent - Protected Navigation Menu
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * This component provides:
 * - Deployment status tracking
 * - Historical edit viewing
 * - System settings and info
 * 
 * This component can ONLY be edited manually in the codebase.
 */
@Component({
  selector: 'app-burger-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <button class="burger-btn" (click)="toggleMenu()" [class.active]="isOpen()">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </button>
      
      <h1 class="logo">
        <span class="logo-icon">◇</span>
        Self-Editing Dashboard
      </h1>

      <div class="status-indicator" [class.deploying]="isDeploying()">
        <span class="status-dot"></span>
        <span class="status-text">{{ isDeploying() ? 'Deploying...' : 'Live' }}</span>
      </div>
    </header>

    <!-- Slide-out Menu -->
    <div class="menu-overlay" [class.open]="isOpen()" (click)="closeMenu()"></div>
    <nav class="menu-panel" [class.open]="isOpen()">
      <div class="menu-header">
        <h2>Dashboard Menu</h2>
        <button class="close-btn" (click)="closeMenu()">×</button>
      </div>

      <div class="menu-section">
        <h3>🚀 Deployment</h3>
        <ul class="menu-list">
          <li (click)="viewDeploymentStatus()">
            <span class="menu-icon">📊</span>
            Deployment Status
          </li>
          <li (click)="triggerDeploy()">
            <span class="menu-icon">▶️</span>
            Trigger Deploy
          </li>
        </ul>
      </div>

      <div class="menu-section">
        <h3>📜 History</h3>
        <ul class="menu-list">
          <li (click)="viewEditHistory()">
            <span class="menu-icon">📝</span>
            Edit History
          </li>
          <li (click)="viewCommits()">
            <span class="menu-icon">💾</span>
            Recent Commits
          </li>
        </ul>
      </div>

      <div class="menu-section">
        <h3>⚙️ Settings</h3>
        <ul class="menu-list">
          <li (click)="openSettings()">
            <span class="menu-icon">🔧</span>
            Configuration
          </li>
          <li (click)="openDocs()">
            <span class="menu-icon">📖</span>
            Documentation
          </li>
        </ul>
      </div>

      <div class="menu-footer">
        <p class="version">v1.0.0</p>
        <p class="protected-notice">🔒 Protected Component</p>
      </div>
    </nav>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(10, 10, 15, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      padding: 0 24px;
      z-index: 1000;
      gap: 16px;
    }

    .burger-btn {
      width: 40px;
      height: 40px;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      transition: all 0.3s ease;
    }

    .burger-btn:hover {
      border-color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.1);
    }

    .burger-btn.active {
      border-color: var(--accent-primary);
    }

    .burger-line {
      width: 18px;
      height: 2px;
      background: var(--text-primary);
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .burger-btn.active .burger-line:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .burger-btn.active .burger-line:nth-child(2) {
      opacity: 0;
    }

    .burger-btn.active .burger-line:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }

    .logo-icon {
      color: var(--accent-primary);
      font-size: 1.5rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
    }

    .status-indicator.deploying {
      background: rgba(245, 158, 11, 0.1);
      border-color: rgba(245, 158, 11, 0.3);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .status-indicator.deploying .status-dot {
      background: var(--warning);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Menu Overlay */
    .menu-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1001;
    }

    .menu-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    /* Menu Panel */
    .menu-panel {
      position: fixed;
      top: 0;
      left: 0;
      width: 320px;
      height: 100vh;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-color);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      z-index: 1002;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .menu-panel.open {
      transform: translateX(0);
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .menu-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-btn {
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: var(--error);
      color: var(--error);
    }

    .menu-section {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .menu-section h3 {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .menu-list {
      list-style: none;
    }

    .menu-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      margin: 4px 0;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .menu-list li:hover {
      background: rgba(99, 102, 241, 0.1);
    }

    .menu-icon {
      font-size: 1.125rem;
    }

    .menu-footer {
      margin-top: auto;
      padding: 20px 24px;
      border-top: 1px solid var(--border-color);
      text-align: center;
    }

    .version {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .protected-notice {
      font-size: 0.75rem;
      color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.1);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      display: inline-block;
    }

    @media (max-width: 768px) {
      .menu-panel {
        width: 100%;
      }

      .logo {
        font-size: 1rem;
      }

      .status-indicator {
        padding: 6px 12px;
        font-size: 0.75rem;
      }
    }
  `]
})
export class BurgerMenuComponent {
  isOpen = signal(false);
  isDeploying = signal(false);

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  closeMenu() {
    this.isOpen.set(false);
  }

  viewDeploymentStatus() {
    window.open('https://github.com/NoahHabanero/CursorTest/actions', '_blank');
    this.closeMenu();
  }

  triggerDeploy() {
    this.isDeploying.set(true);
    // Trigger deploy via GitHub API (to be implemented)
    setTimeout(() => this.isDeploying.set(false), 3000);
    this.closeMenu();
  }

  viewEditHistory() {
    window.open('https://github.com/NoahHabanero/CursorTest/commits/main', '_blank');
    this.closeMenu();
  }

  viewCommits() {
    window.open('https://github.com/NoahHabanero/CursorTest/commits/main', '_blank');
    this.closeMenu();
  }

  openSettings() {
    // To be implemented
    this.closeMenu();
  }

  openDocs() {
    window.open('https://github.com/NoahHabanero/CursorTest', '_blank');
    this.closeMenu();
  }
}

