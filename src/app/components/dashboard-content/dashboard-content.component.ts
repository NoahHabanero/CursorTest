import { Component, OnInit, OnDestroy, signal } from '@angular/core';
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
      <!-- Floating Particles Background -->
      <div class="particles">
        @for (i of particles; track i) {
          <div class="particle" [style.left.%]="getRandomPosition()" [style.animationDelay.s]="i * 0.5"></div>
        }
      </div>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>AI-Powered • Self-Editing • Auto-Deploy</span>
        </div>
        
        <h1 class="hero-title">
          <span class="title-line">The Future of</span>
          <span class="title-gradient">Web Development</span>
        </h1>
        
        <p class="hero-subtitle">
          Welcome to a dashboard that rewrites itself. Type a command below and watch the magic happen.
        </p>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value" [class.counting]="isCountingUp()">{{ commitCount() }}</span>
            <span class="stat-label">Commits</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ deployCount() }}</span>
            <span class="stat-label">Deploys</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value live">{{ liveTime() }}</span>
            <span class="stat-label">Uptime</span>
          </div>
        </div>
      </section>

      <!-- Feature Cards -->
      <section class="features-section">
        <div class="section-header">
          <span class="section-tag">✨ Capabilities</span>
          <h2>What Can This Dashboard Do?</h2>
        </div>

        <div class="features-grid">
          @for (feature of features; track feature.title; let i = $index) {
            <div class="feature-card" [style.animationDelay.ms]="i * 100">
              <div class="feature-icon-wrapper">
                <span class="feature-icon">{{ feature.icon }}</span>
                <div class="icon-glow"></div>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              <div class="feature-tag">{{ feature.tag }}</div>
            </div>
          }
        </div>
      </section>

      <!-- Live Terminal -->
      <section class="terminal-section">
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-buttons">
              <span class="btn-close"></span>
              <span class="btn-minimize"></span>
              <span class="btn-maximize"></span>
            </div>
            <span class="terminal-title">command-history.sh</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-line">
              <span class="prompt">→</span>
              <span class="command">npx create-self-editing-dashboard</span>
            </div>
            <div class="terminal-line success">
              <span class="prompt">✓</span>
              <span class="output">Dashboard initialized successfully</span>
            </div>
            <div class="terminal-line">
              <span class="prompt">→</span>
              <span class="command">ai --modify "Add stunning animations"</span>
            </div>
            <div class="terminal-line success">
              <span class="prompt">✓</span>
              <span class="output">Component updated • Auto-deploying...</span>
            </div>
            <div class="terminal-line current">
              <span class="prompt">→</span>
              <span class="cursor-blink">|</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="tech-section">
        <div class="section-header centered">
          <span class="section-tag">🛠️ Built With</span>
          <h2>Modern Tech Stack</h2>
        </div>
        
        <div class="tech-grid">
          @for (tech of techStack; track tech.name) {
            <div class="tech-item">
              <span class="tech-icon">{{ tech.icon }}</span>
              <span class="tech-name">{{ tech.name }}</span>
            </div>
          }
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <div class="cta-glow"></div>
          <h2>Ready to Try?</h2>
          <p>Use the command input below to make your first edit!</p>
          <div class="cta-arrow">↓</div>
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

    /* Particles */
    .particles {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }

    .particle {
      position: absolute;
      bottom: -10px;
      width: 4px;
      height: 4px;
      background: var(--accent-cyan);
      border-radius: 50%;
      animation: particle-float 15s linear infinite;
      opacity: 0;
      box-shadow: 0 0 10px var(--accent-cyan);
    }

    .particle:nth-child(odd) {
      background: var(--accent-purple);
      box-shadow: 0 0 10px var(--accent-purple);
    }

    /* Hero Section */
    .hero-section {
      text-align: center;
      padding: 60px 20px 80px;
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
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 8vw, 5rem);
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
      font-size: 0.5em;
      margin-bottom: 8px;
    }

    .title-gradient {
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto 48px;
      animation: slide-up 0.6s ease forwards;
      animation-delay: 0.2s;
      opacity: 0;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 40px;
      animation: slide-up 0.6s ease forwards;
      animation-delay: 0.3s;
      opacity: 0;
    }

    .stat-item {
      text-align: center;
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

    .stat-value.counting {
      animation: count-up 0.3s ease;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--border-light);
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

    /* Features Section */
    .features-section {
      padding: 60px 20px;
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
      padding: 32px;
      transition: var(--transition-base);
      animation: slide-up 0.5s ease forwards;
      opacity: 0;
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-glow);
      opacity: 0;
      transition: var(--transition-base);
    }

    .feature-card:hover {
      border-color: var(--border-glow);
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg), var(--shadow-glow-purple);
    }

    .feature-card:hover::before {
      opacity: 1;
    }

    .feature-icon-wrapper {
      position: relative;
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
    }

    .feature-icon {
      font-size: 2.5rem;
      position: relative;
      z-index: 1;
    }

    .icon-glow {
      position: absolute;
      inset: -10px;
      background: var(--gradient-primary);
      border-radius: 50%;
      opacity: 0.2;
      filter: blur(15px);
    }

    .feature-card h3 {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 12px;
      position: relative;
    }

    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 16px;
      position: relative;
    }

    .feature-tag {
      display: inline-block;
      font-size: 0.75rem;
      color: var(--accent-purple);
      background: rgba(139, 92, 246, 0.1);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      position: relative;
    }

    /* Terminal Section */
    .terminal-section {
      padding: 40px 20px 80px;
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
      box-shadow: var(--shadow-lg);
    }

    .terminal-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-subtle);
    }

    .terminal-buttons {
      display: flex;
      gap: 8px;
    }

    .terminal-buttons span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .btn-close { background: #ff5f57; }
    .btn-minimize { background: #ffbd2e; }
    .btn-maximize { background: #28ca42; }

    .terminal-title {
      margin-left: 16px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .terminal-body {
      padding: 20px;
      font-family: var(--font-mono);
      font-size: 0.9rem;
    }

    .terminal-line {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      animation: slide-in-right 0.3s ease forwards;
    }

    .terminal-line .prompt {
      color: var(--accent-purple);
      font-weight: 600;
    }

    .terminal-line .command {
      color: var(--text-primary);
    }

    .terminal-line.success .prompt {
      color: var(--success);
    }

    .terminal-line.success .output {
      color: var(--text-secondary);
    }

    .terminal-line.current .prompt {
      color: var(--accent-cyan);
    }

    .cursor-blink {
      color: var(--accent-cyan);
      animation: blink 1s infinite;
    }

    /* Tech Section */
    .tech-section {
      padding: 60px 20px;
      position: relative;
      z-index: 1;
    }

    .tech-grid {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .tech-item {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 12px 20px;
      transition: var(--transition-base);
    }

    .tech-item:hover {
      border-color: var(--border-glow);
      background: var(--bg-card-hover);
    }

    .tech-icon {
      font-size: 1.5rem;
    }

    .tech-name {
      font-weight: 500;
      font-size: 0.9rem;
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
      padding: 60px 40px;
      background: var(--gradient-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      overflow: hidden;
    }

    .cta-glow {
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(0, 245, 255, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .cta-content h2 {
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 12px;
      position: relative;
    }

    .cta-content p {
      color: var(--text-secondary);
      margin-bottom: 24px;
      position: relative;
    }

    .cta-arrow {
      font-size: 2rem;
      color: var(--accent-cyan);
      animation: float 2s ease-in-out infinite;
      position: relative;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-stats {
        flex-direction: column;
        gap: 24px;
      }

      .stat-divider {
        width: 60px;
        height: 1px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .hero-title {
        font-size: 2.5rem;
      }
    }
  `]
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  particles = Array(20).fill(0).map((_, i) => i);
  
  commitCount = signal(42);
  deployCount = signal(28);
  liveTime = signal('00:00:00');
  isCountingUp = signal(false);

  private timeInterval: any;
  private startTime = Date.now();

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
    { icon: '🅰️', name: 'Angular 17' },
    { icon: '📘', name: 'TypeScript' },
    { icon: '🎨', name: 'SCSS' },
    { icon: '🐙', name: 'GitHub Actions' },
    { icon: '🤖', name: 'AI Integration' },
    { icon: '🚀', name: 'GitHub Pages' }
  ];

  ngOnInit() {
    this.startUptimeCounter();
    this.animateStats();
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
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

  animateStats() {
    // Simulate counting up animation
    this.isCountingUp.set(true);
    let count = 0;
    const target = 42;
    const interval = setInterval(() => {
      count++;
      this.commitCount.set(count);
      if (count >= target) {
        clearInterval(interval);
        this.isCountingUp.set(false);
      }
    }, 30);
  }

  getRandomPosition(): number {
    return Math.random() * 100;
  }
}
