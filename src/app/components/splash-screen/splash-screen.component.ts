import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SplashScreenComponent - Premium Loading Animation
 * 
 * A stunning loading screen with animated logo and progress indicator.
 */
@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="splash-screen" [class.hiding]="isHiding()" [class.hidden]="isHidden()">
      <div class="splash-content">
        <!-- Animated Logo -->
        <div class="logo-container">
          <div class="logo-hexagon">
            <svg viewBox="0 0 100 100" class="hexagon-svg">
              <polygon 
                class="hex-outline" 
                points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                fill="none" 
                stroke="url(#hexGradient)" 
                stroke-width="1.5"
              />
              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00f5ff" />
                  <stop offset="50%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div class="logo-inner">
              <span class="logo-icon">⚡</span>
            </div>
            <div class="logo-glow"></div>
          </div>
          
          <div class="logo-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
        </div>

        <!-- Text -->
        <div class="splash-text">
          <h1 class="splash-title">Self-Editing Dashboard</h1>
          <p class="splash-subtitle">Powered by AI</p>
        </div>

        <!-- Loading Bar -->
        <div class="loading-container">
          <div class="loading-bar">
            <div class="loading-progress" [style.width.%]="loadingProgress()"></div>
            <div class="loading-shimmer"></div>
          </div>
          <div class="loading-text">
            <span class="status">{{ loadingStatus() }}</span>
            <span class="percentage">{{ loadingProgress() }}%</span>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div class="particles">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="particle" [style.animationDelay.s]="i * 0.2"></div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .splash-screen {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: var(--bg-void);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.6s ease, visibility 0.6s ease;
    }

    .splash-screen::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
    }

    .splash-screen.hiding {
      opacity: 0;
    }

    .splash-screen.hidden {
      visibility: hidden;
      pointer-events: none;
    }

    .splash-content {
      text-align: center;
      position: relative;
      z-index: 1;
    }

    /* Logo */
    .logo-container {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 40px;
    }

    .logo-hexagon {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .hexagon-svg {
      width: 100%;
      height: 100%;
      animation: hex-rotate 10s linear infinite;
    }

    @keyframes hex-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .hex-outline {
      stroke-dasharray: 300;
      stroke-dashoffset: 300;
      animation: hex-draw 2s ease forwards;
    }

    @keyframes hex-draw {
      to { stroke-dashoffset: 0; }
    }

    .logo-inner {
      position: absolute;
      inset: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: logo-pulse 2s ease-in-out infinite;
    }

    @keyframes logo-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .logo-icon {
      font-size: 2.5rem;
      filter: drop-shadow(0 0 10px rgba(0, 245, 255, 0.5));
    }

    .logo-glow {
      position: absolute;
      inset: -20px;
      background: radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, transparent 70%);
      animation: glow-pulse 2s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    /* Rings */
    .logo-rings {
      position: absolute;
      inset: -30px;
      pointer-events: none;
    }

    .ring {
      position: absolute;
      inset: 0;
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 50%;
      animation: ring-expand 3s ease-out infinite;
    }

    .ring-1 { animation-delay: 0s; }
    .ring-2 { animation-delay: 1s; }
    .ring-3 { animation-delay: 2s; }

    @keyframes ring-expand {
      0% { transform: scale(0.5); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }

    /* Text */
    .splash-text {
      margin-bottom: 40px;
    }

    .splash-title {
      font-family: var(--font-display);
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 8px;
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: title-fade 0.8s ease forwards;
      animation-delay: 0.5s;
      opacity: 0;
    }

    @keyframes title-fade {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .splash-subtitle {
      font-size: 0.9rem;
      color: var(--text-muted);
      animation: title-fade 0.8s ease forwards;
      animation-delay: 0.7s;
      opacity: 0;
    }

    /* Loading Bar */
    .loading-container {
      width: 280px;
      margin: 0 auto;
      animation: title-fade 0.8s ease forwards;
      animation-delay: 0.9s;
      opacity: 0;
    }

    .loading-bar {
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }

    .loading-progress {
      height: 100%;
      background: var(--gradient-accent);
      border-radius: 2px;
      transition: width 0.3s ease;
      position: relative;
    }

    .loading-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .loading-text {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
      font-size: 0.75rem;
    }

    .status {
      color: var(--text-muted);
    }

    .percentage {
      color: var(--accent-cyan);
      font-family: var(--font-mono);
    }

    /* Particles */
    .particles {
      position: absolute;
      inset: -100px;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--accent-cyan);
      border-radius: 50%;
      opacity: 0;
      animation: float-particle 4s ease-in-out infinite;
    }

    .particle:nth-child(1) { left: 10%; top: 20%; }
    .particle:nth-child(2) { left: 90%; top: 30%; background: var(--accent-purple); }
    .particle:nth-child(3) { left: 20%; top: 80%; }
    .particle:nth-child(4) { left: 80%; top: 70%; background: var(--accent-pink); }
    .particle:nth-child(5) { left: 50%; top: 10%; }
    .particle:nth-child(6) { left: 30%; top: 50%; background: var(--accent-purple); }
    .particle:nth-child(7) { left: 70%; top: 90%; }
    .particle:nth-child(8) { left: 60%; top: 40%; background: var(--accent-pink); }

    @keyframes float-particle {
      0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
      20% { opacity: 1; transform: translateY(-20px) scale(1); }
      80% { opacity: 1; transform: translateY(-80px) scale(1); }
      100% { opacity: 0; transform: translateY(-100px) scale(0); }
    }
  `]
})
export class SplashScreenComponent implements OnInit {
  @Output() loadingComplete = new EventEmitter<void>();
  
  loadingProgress = signal(0);
  loadingStatus = signal('Initializing...');
  isHiding = signal(false);
  isHidden = signal(false);

  private statuses = [
    'Initializing...',
    'Loading components...',
    'Connecting to AI...',
    'Preparing dashboard...',
    'Almost ready...',
    'Welcome!'
  ];

  ngOnInit() {
    this.simulateLoading();
  }

  private simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      
      this.loadingProgress.set(Math.floor(progress));
      
      // Update status based on progress
      const statusIndex = Math.min(
        Math.floor(progress / 20),
        this.statuses.length - 1
      );
      this.loadingStatus.set(this.statuses[statusIndex]);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => this.hide(), 500);
      }
    }, 200);
  }

  private hide() {
    this.isHiding.set(true);
    setTimeout(() => {
      this.isHidden.set(true);
      this.loadingComplete.emit();
    }, 600);
  }
}

