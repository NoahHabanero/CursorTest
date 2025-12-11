import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * DashboardContentComponent - Editable Dashboard Content
 * 
 * ✅ EDITABLE COMPONENT - CAN BE MODIFIED VIA AI COMMANDS
 * This is the main content area that users can customize through AI commands.
 */
@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- ========================================== -->
    <!-- EDITABLE ZONE - AI CAN MODIFY THIS CONTENT -->
    <!-- ========================================== -->
    
    <div class="dashboard-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>AI-Powered • Self-Editing • Auto-Deploy</span>
        </div>
        
        <h1 class="hero-title">
          <span class="title-line">The Future of</span>
          <span class="title-gradient typewriter-container">
            <span class="typewriter" #typewriter>{{ currentWord() }}</span>
            <span class="cursor">|</span>
          </span>
        </h1>
        
        <p class="hero-subtitle">
          Welcome to a dashboard that rewrites itself. Type a command below and watch the magic happen.
        </p>

        <div class="hero-stats">
          <div class="stat-item" (mouseenter)="animateStat('commits')" @statPop>
            <span class="stat-value">{{ animatedCommits() }}</span>
            <span class="stat-label">Commits</span>
            <div class="stat-trend up">
              <span>↑</span> 23%
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" (mouseenter)="animateStat('deploys')" @statPop>
            <span class="stat-value">{{ animatedDeploys() }}</span>
            <span class="stat-label">Deploys</span>
            <div class="stat-trend up">
              <span>↑</span> 15%
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value live">{{ liveTime() }}</span>
            <span class="stat-label">Uptime</span>
            <div class="stat-trend neutral">
              <span class="live-dot"></span> Live
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive 3D Cards -->
      <section class="features-section">
        <div class="section-header">
          <span class="section-tag">✨ Capabilities</span>
          <h2>What Can This Dashboard Do?</h2>
        </div>

        <div class="features-grid">
          @for (feature of features; track feature.title; let i = $index) {
            <div 
              class="feature-card" 
              [style.animationDelay.ms]="i * 100"
              #card
              (mousemove)="onCardMouseMove($event, card)"
              (mouseleave)="onCardMouseLeave(card)"
            >
              <div class="card-shine"></div>
              <div class="feature-icon-wrapper">
                <span class="feature-icon">{{ feature.icon }}</span>
                <div class="icon-glow"></div>
                <div class="icon-ring"></div>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              <div class="feature-footer">
                <div class="feature-tag">{{ feature.tag }}</div>
                <span class="feature-arrow">→</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Interactive Demo Terminal -->
      <section class="terminal-section">
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-buttons">
              <span class="btn-close"></span>
              <span class="btn-minimize"></span>
              <span class="btn-maximize"></span>
            </div>
            <span class="terminal-title">
              <span class="terminal-icon">⌘</span>
              live-demo.sh
            </span>
            <div class="terminal-actions">
              <button class="action-btn" (click)="runDemoCommand()">
                ▶ Run Demo
              </button>
            </div>
          </div>
          <div class="terminal-body" #terminalBody>
            @for (line of terminalLines(); track $index) {
              <div class="terminal-line" [class]="line.type" @slideInLine>
                <span class="prompt">{{ line.prompt }}</span>
                <span [class]="line.type === 'input' ? 'command' : 'output'">{{ line.text }}</span>
              </div>
            }
            <div class="terminal-line current">
              <span class="prompt">→</span>
              <span class="cursor-blink">|</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Floating Action Widget -->
      <section class="widget-section">
        <div class="floating-widget" (mouseenter)="expandWidget()" (mouseleave)="collapseWidget()">
          <div class="widget-icon">
            <span>💡</span>
          </div>
          <div class="widget-content" [class.expanded]="widgetExpanded()">
            <h4>Pro Tip</h4>
            <p>Try commands like "Add a weather widget" or "Change theme to dark mode"</p>
          </div>
        </div>
      </section>

      <!-- Tech Stack with Hover Effects -->
      <section class="tech-section">
        <div class="section-header centered">
          <span class="section-tag">🛠️ Built With</span>
          <h2>Modern Tech Stack</h2>
        </div>
        
        <div class="tech-grid">
          @for (tech of techStack; track tech.name; let i = $index) {
            <div class="tech-item" [style.animationDelay.ms]="i * 50" (click)="showTechInfo(tech)">
              <div class="tech-icon-container">
                <span class="tech-icon">{{ tech.icon }}</span>
                <div class="tech-pulse"></div>
              </div>
              <span class="tech-name">{{ tech.name }}</span>
              <span class="tech-version">{{ tech.version }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Animated CTA -->
      <section class="cta-section">
        <div class="cta-content">
          <div class="cta-particles">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="cta-particle" [style.animationDelay.s]="i * 0.5"></div>
            }
          </div>
          <div class="cta-glow"></div>
          <span class="cta-badge">Get Started</span>
          <h2>Ready to Transform Your Dashboard?</h2>
          <p>Use the command input below to make your first AI-powered edit!</p>
          <div class="cta-arrow-container">
            <div class="arrow-path"></div>
            <div class="cta-arrow">↓</div>
          </div>
        </div>
      </section>

      <!-- Mini Activity Feed -->
      <section class="activity-section">
        <div class="activity-header">
          <span class="activity-icon">📊</span>
          <span>Recent Activity</span>
          <span class="activity-live">Live</span>
        </div>
        <div class="activity-feed">
          @for (activity of recentActivity; track activity.id) {
            <div class="activity-item" [class]="activity.type">
              <span class="activity-dot"></span>
              <span class="activity-text">{{ activity.text }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          }
        </div>
      </section>
    </div>

    <!-- ========================================== -->
    <!-- END EDITABLE ZONE -->
    <!-- ========================================== -->
  `,
  styles: [`
    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
    }

    /* Hero Section */
    .hero-section {
      text-align: center;
      padding: 40px 20px 60px;
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--gradient-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      padding: 8px 20px;
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 32px;
      animation: slide-up 0.6s ease forwards;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      50% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 7vw, 4.5rem);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 24px;
      animation: slide-up 0.6s ease forwards;
      animation-delay: 0.1s;
      opacity: 0;
    }

    .title-line {
      display: block;
      color: var(--text-secondary);
      font-weight: 400;
      font-size: 0.45em;
      margin-bottom: 8px;
    }

    .title-gradient {
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
    }

    .typewriter-container {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .cursor {
      color: var(--accent-cyan);
      animation: blink 1s infinite;
      font-weight: 300;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      max-width: 550px;
      margin: 0 auto 40px;
      animation: slide-up 0.6s ease forwards;
      animation-delay: 0.2s;
      opacity: 0;
      line-height: 1.6;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 32px;
      animation: slide-up 0.6s ease forwards;
      animation-delay: 0.3s;
      opacity: 0;
    }

    .stat-item {
      text-align: center;
      padding: 16px 24px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: var(--transition-base);
      min-width: 120px;
    }

    .stat-item:hover {
      border-color: var(--accent-indigo);
      transform: translateY(-4px);
      box-shadow: 0 10px 40px rgba(99, 102, 241, 0.15);
    }

    .stat-value {
      display: block;
      font-family: var(--font-mono);
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      transition: var(--transition-base);
    }

    .stat-value.live {
      color: var(--accent-cyan);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.7rem;
      margin-top: 8px;
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }

    .stat-trend.up {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .stat-trend.neutral {
      background: rgba(0, 245, 255, 0.1);
      color: var(--accent-cyan);
    }

    .live-dot {
      width: 6px;
      height: 6px;
      background: var(--accent-cyan);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .stat-divider {
      width: 1px;
      background: var(--border-light);
      align-self: stretch;
    }

    /* Section Styles */
    .section-header {
      margin-bottom: 40px;
    }

    .section-header.centered {
      text-align: center;
    }

    .section-tag {
      display: inline-block;
      font-size: 0.85rem;
      color: var(--accent-cyan);
      margin-bottom: 12px;
      font-weight: 500;
    }

    .section-header h2 {
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 700;
    }

    /* Features Section - 3D Cards */
    .features-section {
      padding: 40px 20px;
      position: relative;
      z-index: 1;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: 28px;
      transition: transform 0.1s ease, box-shadow var(--transition-base);
      animation: slide-up 0.5s ease forwards;
      opacity: 0;
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      perspective: 1000px;
    }

    .card-shine {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        600px circle at var(--mouse-x, 0) var(--mouse-y, 0),
        rgba(99, 102, 241, 0.1),
        transparent 40%
      );
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .feature-card:hover .card-shine {
      opacity: 1;
    }

    .feature-card:hover {
      border-color: var(--border-glow);
      box-shadow: 
        var(--shadow-lg), 
        0 0 50px rgba(99, 102, 241, 0.1),
        inset 0 0 30px rgba(99, 102, 241, 0.02);
    }

    .feature-icon-wrapper {
      position: relative;
      width: 60px;
      height: 60px;
      margin-bottom: 20px;
    }

    .feature-icon {
      font-size: 2.2rem;
      position: relative;
      z-index: 1;
    }

    .icon-glow {
      position: absolute;
      inset: -8px;
      background: var(--gradient-primary);
      border-radius: 50%;
      opacity: 0.15;
      filter: blur(12px);
    }

    .icon-ring {
      position: absolute;
      inset: -4px;
      border: 2px solid transparent;
      border-radius: 50%;
      background: linear-gradient(var(--bg-card), var(--bg-card)) padding-box,
                  var(--gradient-primary) border-box;
      opacity: 0;
      transition: var(--transition-base);
    }

    .feature-card:hover .icon-ring {
      opacity: 1;
    }

    .feature-card h3 {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 10px;
      position: relative;
    }

    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 16px;
      position: relative;
    }

    .feature-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .feature-tag {
      display: inline-block;
      font-size: 0.7rem;
      color: var(--accent-purple);
      background: rgba(139, 92, 246, 0.1);
      padding: 4px 10px;
      border-radius: var(--radius-full);
      position: relative;
    }

    .feature-arrow {
      color: var(--text-muted);
      opacity: 0;
      transform: translateX(-10px);
      transition: var(--transition-base);
    }

    .feature-card:hover .feature-arrow {
      opacity: 1;
      transform: translateX(0);
      color: var(--accent-cyan);
    }

    /* Terminal Section */
    .terminal-section {
      padding: 40px 20px 60px;
      position: relative;
      z-index: 1;
    }

    .terminal-window {
      max-width: 700px;
      margin: 0 auto;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: 
        var(--shadow-lg),
        0 0 60px rgba(0, 0, 0, 0.3);
    }

    .terminal-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-subtle);
      gap: 12px;
    }

    .terminal-buttons {
      display: flex;
      gap: 8px;
    }

    .terminal-buttons span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .terminal-buttons span:hover {
      transform: scale(1.1);
    }

    .btn-close { background: #ff5f57; }
    .btn-minimize { background: #ffbd2e; }
    .btn-maximize { background: #28ca42; }

    .terminal-title {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .terminal-icon {
      font-size: 0.9rem;
    }

    .terminal-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      background: var(--gradient-primary);
      border: none;
      border-radius: var(--radius-sm);
      padding: 6px 12px;
      font-size: 0.7rem;
      color: white;
      cursor: pointer;
      font-family: var(--font-mono);
      transition: var(--transition-base);
    }

    .action-btn:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-glow-purple);
    }

    .terminal-body {
      padding: 16px 20px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      min-height: 180px;
      max-height: 300px;
      overflow-y: auto;
    }

    .terminal-line {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 4px 0;
      animation: slide-in-right 0.3s ease forwards;
    }

    .terminal-line .prompt {
      color: var(--accent-purple);
      font-weight: 600;
      flex-shrink: 0;
    }

    .terminal-line .command {
      color: var(--text-primary);
    }

    .terminal-line .output {
      color: var(--text-secondary);
    }

    .terminal-line.success .prompt {
      color: var(--success);
    }

    .terminal-line.error .prompt {
      color: var(--error);
    }

    .terminal-line.current .prompt {
      color: var(--accent-cyan);
    }

    .cursor-blink {
      color: var(--accent-cyan);
      animation: blink 1s infinite;
    }

    /* Widget Section */
    .widget-section {
      padding: 20px;
      display: flex;
      justify-content: center;
    }

    .floating-widget {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      padding: 12px 20px;
      cursor: pointer;
      transition: var(--transition-base);
      max-width: 400px;
    }

    .floating-widget:hover {
      border-color: var(--accent-cyan);
      box-shadow: var(--shadow-glow-cyan);
    }

    .widget-icon {
      font-size: 1.5rem;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    .widget-content {
      overflow: hidden;
      max-width: 0;
      opacity: 0;
      transition: all var(--transition-slow);
    }

    .widget-content.expanded {
      max-width: 300px;
      opacity: 1;
      padding-left: 8px;
    }

    .widget-content h4 {
      font-size: 0.85rem;
      color: var(--accent-cyan);
      margin-bottom: 4px;
    }

    .widget-content p {
      font-size: 0.8rem;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    /* Tech Section */
    .tech-section {
      padding: 40px 20px;
      position: relative;
      z-index: 1;
    }

    .tech-grid {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .tech-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 16px 24px;
      cursor: pointer;
      transition: var(--transition-base);
      animation: slide-up 0.4s ease forwards;
      opacity: 0;
    }

    .tech-item:hover {
      border-color: var(--accent-purple);
      transform: translateY(-4px) scale(1.02);
      box-shadow: var(--shadow-glow-purple);
    }

    .tech-icon-container {
      position: relative;
    }

    .tech-icon {
      font-size: 1.8rem;
      display: block;
    }

    .tech-pulse {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 1px solid var(--accent-purple);
      opacity: 0;
      transform: scale(0.8);
      transition: var(--transition-base);
    }

    .tech-item:hover .tech-pulse {
      opacity: 1;
      transform: scale(1);
      animation: pulse-ring 1.5s ease-out infinite;
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    .tech-name {
      font-weight: 500;
      font-size: 0.85rem;
    }

    .tech-version {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    /* CTA Section */
    .cta-section {
      padding: 60px 20px 40px;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .cta-content {
      position: relative;
      padding: 50px 40px;
      background: var(--gradient-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      overflow: hidden;
    }

    .cta-particles {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .cta-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--accent-cyan);
      border-radius: 50%;
      animation: cta-float 8s ease-in-out infinite;
    }

    .cta-particle:nth-child(1) { left: 10%; top: 20%; }
    .cta-particle:nth-child(2) { left: 85%; top: 15%; background: var(--accent-purple); }
    .cta-particle:nth-child(3) { left: 20%; top: 70%; }
    .cta-particle:nth-child(4) { left: 90%; top: 60%; background: var(--accent-pink); }
    .cta-particle:nth-child(5) { left: 50%; top: 10%; }
    .cta-particle:nth-child(6) { left: 60%; top: 80%; background: var(--accent-purple); }

    @keyframes cta-float {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
      25% { transform: translate(10px, -15px) scale(1.2); opacity: 1; }
      50% { transform: translate(-5px, -25px) scale(0.8); opacity: 0.8; }
      75% { transform: translate(15px, -10px) scale(1.1); opacity: 1; }
    }

    .cta-glow {
      position: absolute;
      top: -30%;
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(0, 245, 255, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .cta-badge {
      display: inline-block;
      font-size: 0.75rem;
      color: var(--accent-cyan);
      background: rgba(0, 245, 255, 0.1);
      border: 1px solid rgba(0, 245, 255, 0.2);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      margin-bottom: 16px;
      position: relative;
    }

    .cta-content h2 {
      font-family: var(--font-display);
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 12px;
      position: relative;
    }

    .cta-content p {
      color: var(--text-secondary);
      margin-bottom: 24px;
      position: relative;
    }

    .cta-arrow-container {
      position: relative;
      display: inline-block;
    }

    .arrow-path {
      position: absolute;
      left: 50%;
      top: 0;
      width: 2px;
      height: 30px;
      background: linear-gradient(to bottom, var(--accent-cyan), transparent);
      transform: translateX(-50%);
    }

    .cta-arrow {
      font-size: 2rem;
      color: var(--accent-cyan);
      animation: bounce 2s ease-in-out infinite;
      position: relative;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(10px); }
    }

    /* Activity Section */
    .activity-section {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }

    .activity-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .activity-live {
      margin-left: auto;
      font-size: 0.7rem;
      color: var(--success);
      background: rgba(16, 185, 129, 0.1);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }

    .activity-feed {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      transition: var(--transition-fast);
    }

    .activity-item:hover {
      border-color: var(--border-light);
    }

    .activity-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .activity-item.commit .activity-dot { background: var(--accent-purple); }
    .activity-item.deploy .activity-dot { background: var(--success); }
    .activity-item.edit .activity-dot { background: var(--accent-cyan); }

    .activity-text {
      flex: 1;
      color: var(--text-secondary);
    }

    .activity-time {
      color: var(--text-dim);
      font-family: var(--font-mono);
      font-size: 0.7rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-stats {
        flex-direction: column;
        gap: 16px;
      }

      .stat-divider {
        width: 60px;
        height: 1px;
        align-self: center;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .hero-title {
        font-size: 2.2rem;
      }

      .stat-item {
        min-width: auto;
        width: 100%;
        max-width: 200px;
      }
    }

    /* Animations */
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in-right {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class DashboardContentComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('typewriter') typewriterEl!: ElementRef;
  @ViewChild('terminalBody') terminalBody!: ElementRef;

  // Typewriter effect
  words = ['Web Development', 'Dashboard Design', 'AI Integration', 'Automation'];
  currentWordIndex = 0;
  currentWord = signal('');
  
  // Stats animation
  animatedCommits = signal(0);
  animatedDeploys = signal(0);
  targetCommits = 47;
  targetDeploys = 32;
  
  // Live time
  liveTime = signal('00:00:00');
  private startTime = Date.now();
  private timeInterval: any;
  private typewriterInterval: any;

  // Terminal simulation
  terminalLines = signal<{type: string; prompt: string; text: string}[]>([
    { type: 'input', prompt: '→', text: 'npx create-self-editing-dashboard' },
    { type: 'success', prompt: '✓', text: 'Dashboard initialized successfully' },
    { type: 'input', prompt: '→', text: 'git push origin main' },
    { type: 'success', prompt: '✓', text: 'Changes deployed to GitHub Pages' },
  ]);

  // Widget state
  widgetExpanded = signal(false);

  // Features
  features = [
    {
      icon: '🤖',
      title: 'AI-Powered Editing',
      description: 'Describe changes in natural language. Our AI understands and implements them instantly.',
      tag: 'GPT-4 Ready'
    },
    {
      icon: '⚡',
      title: 'Instant Deploy',
      description: 'Every change triggers automatic deployment. See updates live in under 2 minutes.',
      tag: 'GitHub Actions'
    },
    {
      icon: '🔒',
      title: 'Protected Core',
      description: 'Critical components are locked from AI edits. Your dashboard stays stable and secure.',
      tag: 'Safe Mode'
    },
    {
      icon: '📜',
      title: 'Full History',
      description: 'Every edit is tracked in Git. Roll back to any version with a single click.',
      tag: 'Version Control'
    },
    {
      icon: '🎨',
      title: 'Beautiful UI',
      description: 'Stunning animations, glass effects, and a cyberpunk aesthetic that looks amazing.',
      tag: 'Angular 17'
    },
    {
      icon: '🌐',
      title: 'Always Live',
      description: 'Hosted on GitHub Pages with automatic HTTPS. Share your dashboard with the world.',
      tag: 'Free Hosting'
    }
  ];

  techStack = [
    { icon: '🅰️', name: 'Angular', version: 'v17.3' },
    { icon: '📘', name: 'TypeScript', version: 'v5.3' },
    { icon: '🎨', name: 'SCSS', version: 'v1.69' },
    { icon: '🐙', name: 'GitHub', version: 'Actions' },
    { icon: '🤖', name: 'AI Agent', version: 'GPT-4' },
    { icon: '🚀', name: 'Pages', version: 'v4' }
  ];

  recentActivity = [
    { id: 1, type: 'deploy', text: 'Production deployment successful', time: '2m ago' },
    { id: 2, type: 'commit', text: 'Added toast notification system', time: '5m ago' },
    { id: 3, type: 'edit', text: 'Updated hero section styling', time: '8m ago' },
    { id: 4, type: 'commit', text: 'Enhanced particle background', time: '12m ago' },
  ];

  ngOnInit() {
    this.startUptimeCounter();
    this.animateInitialStats();
    this.startTypewriter();
  }

  ngAfterViewInit() {
    // Additional setup after view init
  }

  ngOnDestroy() {
    if (this.timeInterval) clearInterval(this.timeInterval);
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
  }

  startUptimeCounter() {
    this.timeInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      this.liveTime.set(`${hours}:${minutes}:${seconds}`);
    }, 1000);
  }

  animateInitialStats() {
    this.animateNumber(0, this.targetCommits, 1500, (val) => this.animatedCommits.set(val));
    this.animateNumber(0, this.targetDeploys, 1500, (val) => this.animatedDeploys.set(val));
  }

  animateNumber(start: number, end: number, duration: number, setter: (val: number) => void) {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = Math.floor(start + (end - start) * eased);
      setter(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  animateStat(stat: string) {
    if (stat === 'commits') {
      this.animateNumber(this.animatedCommits(), this.targetCommits + Math.floor(Math.random() * 5), 300, (val) => this.animatedCommits.set(val));
    } else if (stat === 'deploys') {
      this.animateNumber(this.animatedDeploys(), this.targetDeploys + Math.floor(Math.random() * 3), 300, (val) => this.animatedDeploys.set(val));
    }
  }

  startTypewriter() {
    let charIndex = 0;
    let deleting = false;
    
    const type = () => {
      const word = this.words[this.currentWordIndex];
      
      if (!deleting) {
        this.currentWord.set(word.substring(0, charIndex + 1));
        charIndex++;
        
        if (charIndex === word.length) {
          setTimeout(() => { deleting = true; type(); }, 2000);
          return;
        }
      } else {
        this.currentWord.set(word.substring(0, charIndex - 1));
        charIndex--;
        
        if (charIndex === 0) {
          deleting = false;
          this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        }
      }
      
      setTimeout(type, deleting ? 50 : 100);
    };
    
    setTimeout(type, 1000);
  }

  onCardMouseMove(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }

  onCardMouseLeave(card: HTMLElement) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }

  runDemoCommand() {
    const commands = [
      { type: 'input', prompt: '→', text: 'ai --modify "Add a weather widget"' },
      { type: 'success', prompt: '✓', text: 'Processing command...' },
      { type: 'success', prompt: '✓', text: 'Component updated • Building...' },
      { type: 'success', prompt: '✓', text: 'Deployed! Changes live in 90s' },
    ];

    let index = 0;
    const addLine = () => {
      if (index < commands.length) {
        this.terminalLines.update(lines => [...lines, commands[index]]);
        index++;
        setTimeout(addLine, 800);
        
        // Scroll terminal
        if (this.terminalBody?.nativeElement) {
          setTimeout(() => {
            this.terminalBody.nativeElement.scrollTop = this.terminalBody.nativeElement.scrollHeight;
          }, 50);
        }
      }
    };
    addLine();
  }

  expandWidget() {
    this.widgetExpanded.set(true);
  }

  collapseWidget() {
    this.widgetExpanded.set(false);
  }

  showTechInfo(tech: any) {
    // Could trigger a toast or modal here
    console.log(`Showing info for ${tech.name}`);
  }
}
