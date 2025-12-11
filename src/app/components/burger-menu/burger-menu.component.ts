import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

/**
 * BurgerMenuComponent - Protected Navigation Menu
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * Premium navigation with deployment tracking and system status.
 * Now designed to work inside a draggable container.
 */
@Component({
  selector: 'app-burger-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="burger-btn" (click)="toggleMenu()" [class.active]="isOpen()">
          <div class="burger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
              <line x1="12" y1="22" x2="12" y2="15.5"></line>
              <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
            </svg>
          </div>
          <span class="logo-text">
            <span class="logo-main">Self-Editing</span>
            <span class="logo-sub">Dashboard</span>
          </span>
        </div>
      </div>

      <div class="header-center">
        <div class="live-indicator" [class]="deploymentStatus()">
          <span class="pulse-dot"></span>
          <span class="status-text">{{ statusText() }}</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Theme Selector -->
        <div class="theme-selector" [class.open]="themeMenuOpen()">
          <button class="theme-btn" (click)="toggleThemeMenu()">
            <span class="theme-icon">{{ themeService.currentTheme().icon }}</span>
            <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <div class="theme-dropdown">
            <div class="dropdown-header">
              <span class="dropdown-title">🎨 Choose Theme</span>
            </div>
            <div class="theme-list">
              @for (theme of themeService.themes; track theme.id) {
                <button 
                  class="theme-option"
                  [class.active]="theme.id === themeService.currentThemeId()"
                  (click)="selectTheme(theme.id)"
                >
                  <span class="option-icon">{{ theme.icon }}</span>
                  <span class="option-name">{{ theme.name }}</span>
                  @if (theme.id === themeService.currentThemeId()) {
                    <span class="option-check">✓</span>
                  }
                </button>
              }
            </div>
          </div>
        </div>

        <div class="time-display">
          <span class="time">{{ currentTime() }}</span>
        </div>
        <button class="github-btn" (click)="openGitHub()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Slide-out Menu -->
    <div class="menu-overlay" [class.open]="isOpen()" (click)="closeMenu()"></div>
    
    <nav class="menu-panel glass-strong" [class.open]="isOpen()">
      <div class="menu-header">
        <div class="menu-title">
          <span class="menu-icon">⚙️</span>
          <span>Control Panel</span>
        </div>
        <button class="close-btn" (click)="closeMenu()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="menu-content">
        <!-- Status Card -->
        <div class="status-card">
          <div class="status-header">
            <span class="status-label">System Status</span>
            <span class="status-badge" [class]="deploymentStatus()">
              {{ deploymentStatus() === 'live' ? 'Operational' : 'Deploying' }}
            </span>
          </div>
          <div class="status-metrics">
            <div class="metric">
              <span class="metric-value">99.9%</span>
              <span class="metric-label">Uptime</span>
            </div>
            <div class="metric">
              <span class="metric-value">&lt;2s</span>
              <span class="metric-label">Response</span>
            </div>
            <div class="metric">
              <span class="metric-value">0</span>
              <span class="metric-label">Errors</span>
            </div>
          </div>
        </div>

        <!-- Menu Sections -->
        <div class="menu-section">
          <h3 class="section-title">
            <span class="section-icon">🚀</span>
            Deployment
          </h3>
          <ul class="menu-list">
            <li class="menu-item" (click)="viewDeploymentStatus()">
              <span class="item-icon">📊</span>
              <span class="item-text">View Status</span>
              <span class="item-arrow">→</span>
            </li>
            <li class="menu-item" (click)="triggerDeploy()">
              <span class="item-icon">▶️</span>
              <span class="item-text">Trigger Deploy</span>
              <span class="item-badge">Manual</span>
            </li>
            <li class="menu-item" (click)="viewLogs()">
              <span class="item-icon">📜</span>
              <span class="item-text">Build Logs</span>
              <span class="item-arrow">→</span>
            </li>
          </ul>
        </div>

        <div class="menu-section">
          <h3 class="section-title">
            <span class="section-icon">📝</span>
            History
          </h3>
          <ul class="menu-list">
            <li class="menu-item" (click)="viewEditHistory()">
              <span class="item-icon">🔄</span>
              <span class="item-text">Edit History</span>
              <span class="item-arrow">→</span>
            </li>
            <li class="menu-item" (click)="viewCommits()">
              <span class="item-icon">💾</span>
              <span class="item-text">Git Commits</span>
              <span class="item-arrow">→</span>
            </li>
          </ul>
        </div>

        <div class="menu-section">
          <h3 class="section-title">
            <span class="section-icon">🔗</span>
            Links
          </h3>
          <ul class="menu-list">
            <li class="menu-item" (click)="openGitHub()">
              <span class="item-icon">🐙</span>
              <span class="item-text">GitHub Repo</span>
              <span class="item-arrow">→</span>
            </li>
            <li class="menu-item" (click)="openDocs()">
              <span class="item-icon">📖</span>
              <span class="item-text">Documentation</span>
              <span class="item-arrow">→</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="menu-footer">
        <div class="footer-info">
          <span class="version">v1.0.0</span>
          <span class="separator">•</span>
          <span class="protected">🔒 Protected</span>
        </div>
        <div class="footer-links">
          <a href="https://github.com/NoahHabanero/CursorTest" target="_blank">Source</a>
          <span class="separator">•</span>
          <a href="https://github.com/NoahHabanero/CursorTest/issues" target="_blank">Issues</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    /* Header - Theme-aware */
    .header {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: var(--bg-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-glow);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-glow);
    }

    .header-left, .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Burger Button */
    .burger-btn {
      width: 40px;
      height: 40px;
      background: transparent;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-base);
    }

    .burger-btn:hover {
      border-color: var(--accent-cyan);
      background: color-mix(in srgb, var(--accent-cyan) 10%, transparent);
    }

    .burger-btn.active {
      border-color: var(--accent-purple);
      background: color-mix(in srgb, var(--accent-purple) 15%, transparent);
    }

    .burger-icon {
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: var(--transition-base);
    }

    .burger-icon span {
      display: block;
      width: 16px;
      height: 2px;
      background: var(--text-primary);
      border-radius: 1px;
      transition: var(--transition-base);
    }

    .burger-btn.active .burger-icon span:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }

    .burger-btn.active .burger-icon span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .burger-btn.active .burger-icon span:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon svg {
      width: 24px;
      height: 24px;
      color: var(--accent-cyan);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .logo-main {
      font-family: var(--font-display);
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .logo-sub {
      font-size: 0.65rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Live Indicator */
    .header-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 500;
      transition: var(--transition-base);
    }

    .live-indicator.live {
      background: color-mix(in srgb, var(--success) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--success) 35%, transparent);
      color: var(--success);
    }

    .live-indicator.deploying {
      background: color-mix(in srgb, var(--warning) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--warning) 35%, transparent);
      color: var(--warning);
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .live .pulse-dot {
      background: var(--success);
      box-shadow: 0 0 8px var(--success-glow);
    }

    .deploying .pulse-dot {
      background: var(--warning);
      box-shadow: 0 0 8px var(--warning-glow);
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }

    /* Theme Selector */
    .theme-selector {
      position: relative;
    }

    .theme-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition-base);
    }

    .theme-btn:hover {
      border-color: var(--accent-indigo);
      background: var(--bg-card-hover);
    }

    .theme-icon {
      font-size: 1rem;
    }

    .dropdown-arrow {
      width: 14px;
      height: 14px;
      color: var(--text-muted);
      transition: transform var(--transition-base);
    }

    .theme-selector.open .dropdown-arrow {
      transform: rotate(180deg);
    }

    .theme-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 200px;
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: var(--transition-base);
      z-index: 100;
      overflow: hidden;
    }

    .theme-selector.open .theme-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-header {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .dropdown-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .theme-list {
      max-height: 280px;
      overflow-y: auto;
      padding: 6px;
    }

    .theme-option {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition-fast);
      text-align: left;
    }

    .theme-option:hover {
      background: var(--bg-tertiary);
    }

    .theme-option.active {
      background: var(--bg-tertiary);
    }

    .option-icon {
      font-size: 1.1rem;
    }

    .option-name {
      flex: 1;
      font-size: 0.85rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .option-check {
      color: var(--success);
      font-weight: 600;
    }

    /* Time & GitHub */
    .time-display {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
      padding: 6px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
    }

    .github-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition: var(--transition-base);
    }

    .github-btn:hover {
      border-color: var(--accent-purple);
      color: var(--accent-purple);
      background: color-mix(in srgb, var(--accent-purple) 15%, transparent);
    }

    .github-btn svg {
      width: 18px;
      height: 18px;
    }

    /* Menu Overlay */
    .menu-overlay {
      position: fixed;
      inset: 0;
      background: color-mix(in srgb, var(--bg-primary) 85%, transparent);
      backdrop-filter: blur(8px);
      opacity: 0;
      visibility: hidden;
      transition: var(--transition-base);
      z-index: 2001;
    }

    .menu-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    /* Menu Panel - Theme-aware */
    .menu-panel {
      position: fixed;
      top: 12px;
      left: 12px;
      width: 320px;
      height: calc(100vh - 24px);
      transform: translateX(calc(-100% - 24px));
      transition: transform var(--transition-slow);
      z-index: 2002;
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-2xl);
      border: 1px solid var(--border-glow);
      background: var(--bg-glass);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: var(--shadow-glow);
    }

    .menu-panel.open {
      transform: translateX(0);
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .menu-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 600;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .close-btn:hover {
      background: color-mix(in srgb, var(--error) 15%, transparent);
      border-color: var(--error);
      color: var(--error);
    }

    .close-btn svg {
      width: 16px;
      height: 16px;
    }

    /* Menu Content */
    .menu-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    /* Status Card */
    .status-card {
      background: var(--gradient-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 16px;
      margin-bottom: 20px;
    }

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .status-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .status-badge {
      font-size: 0.7rem;
      padding: 3px 8px;
      border-radius: var(--radius-full);
      font-weight: 600;
    }

    .status-badge.live {
      background: color-mix(in srgb, var(--success) 20%, transparent);
      color: var(--success);
    }

    .status-badge.deploying {
      background: color-mix(in srgb, var(--warning) 20%, transparent);
      color: var(--warning);
    }

    .status-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .metric {
      text-align: center;
    }

    .metric-value {
      display: block;
      font-family: var(--font-mono);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .metric-label {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Menu Sections */
    .menu-section {
      margin-bottom: 20px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .menu-list {
      list-style: none;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      margin-bottom: 4px;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .menu-item:hover {
      background: color-mix(in srgb, var(--accent-indigo) 15%, transparent);
    }

    .item-icon {
      font-size: 0.9rem;
    }

    .item-text {
      flex: 1;
      font-size: 0.85rem;
    }

    .item-arrow {
      color: var(--text-muted);
      transition: var(--transition-fast);
    }

    .menu-item:hover .item-arrow {
      color: var(--accent-cyan);
      transform: translateX(4px);
    }

    .item-badge {
      font-size: 0.65rem;
      padding: 2px 6px;
      background: color-mix(in srgb, var(--accent-purple) 20%, transparent);
      color: var(--accent-purple);
      border-radius: var(--radius-sm);
    }

    /* Menu Footer */
    .menu-footer {
      padding: 14px 20px;
      border-top: 1px solid var(--border-subtle);
      text-align: center;
    }

    .footer-info {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .separator {
      color: var(--border-light);
    }

    .protected {
      color: var(--accent-cyan);
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 8px;
      font-size: 0.7rem;
    }

    .footer-links a {
      color: var(--text-muted);
      transition: var(--transition-fast);
    }

    .footer-links a:hover {
      color: var(--accent-purple);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .menu-panel {
        width: calc(100% - 24px);
      }

      .logo-text {
        display: none;
      }

      .header-center {
        display: none;
      }

      .time-display {
        display: none;
      }
    }
  `]
})
export class BurgerMenuComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  
  isOpen = signal(false);
  themeMenuOpen = signal(false);
  deploymentStatus = signal<'live' | 'deploying'>('live');
  statusText = signal('Live');
  currentTime = signal('');

  private timeInterval: any;

  ngOnInit() {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }));
  }

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
    this.deploymentStatus.set('deploying');
    this.statusText.set('Deploying...');
    
    setTimeout(() => {
      this.deploymentStatus.set('live');
      this.statusText.set('Live');
    }, 5000);
    
    this.closeMenu();
  }

  viewLogs() {
    window.open('https://github.com/NoahHabanero/CursorTest/actions', '_blank');
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

  openGitHub() {
    window.open('https://github.com/NoahHabanero/CursorTest', '_blank');
    this.closeMenu();
  }

  openDocs() {
    window.open('https://github.com/NoahHabanero/CursorTest#readme', '_blank');
    this.closeMenu();
  }

  toggleThemeMenu() {
    this.themeMenuOpen.update(v => !v);
  }

  selectTheme(themeId: string) {
    this.themeService.setTheme(themeId);
    this.themeMenuOpen.set(false);
  }
}
