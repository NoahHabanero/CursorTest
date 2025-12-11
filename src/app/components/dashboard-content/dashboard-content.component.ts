import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * DashboardContentComponent - Editable Dashboard Content
 * 
 * ✅ EDITABLE COMPONENT - CAN BE MODIFIED VIA AI COMMANDS
 * This component contains the main dashboard content that users
 * can modify through the command input.
 * 
 * AI agents can edit this component to:
 * - Add new widgets and cards
 * - Change layouts and styles
 * - Update content and data displays
 * - Customize the dashboard appearance
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
      <div class="welcome-section">
        <h1 class="title">
          <span class="greeting">Welcome to the</span>
          <span class="highlight">Self-Editing Dashboard</span>
        </h1>
        <p class="subtitle">
          This dashboard can edit itself! Type a command below to make changes.
        </p>
      </div>

      <div class="cards-grid">
        <div class="card feature-card">
          <div class="card-icon">🤖</div>
          <h3>AI-Powered</h3>
          <p>Use natural language to describe changes and watch the AI implement them.</p>
        </div>

        <div class="card feature-card">
          <div class="card-icon">🔄</div>
          <h3>Auto-Deploy</h3>
          <p>Changes are automatically committed and deployed to the live site.</p>
        </div>

        <div class="card feature-card">
          <div class="card-icon">📝</div>
          <h3>Version Control</h3>
          <p>Every edit is tracked in Git. Roll back anytime from the menu.</p>
        </div>

        <div class="card feature-card">
          <div class="card-icon">🛡️</div>
          <h3>Protected Core</h3>
          <p>The command input and menu are protected from AI modifications.</p>
        </div>
      </div>

      <div class="info-card">
        <h2>🚀 Getting Started</h2>
        <ol class="steps-list">
          <li>Type a command in the input box below</li>
          <li>The AI agent will process your request</li>
          <li>Changes will be committed to GitHub</li>
          <li>The site will automatically redeploy</li>
          <li>Refresh to see your changes!</li>
        </ol>
      </div>

      <div class="example-section">
        <h2>💡 Example Commands</h2>
        <div class="examples-grid">
          <div class="example-card">
            <code>"Add a clock widget that shows the current time"</code>
          </div>
          <div class="example-card">
            <code>"Change the background to a dark blue gradient"</code>
          </div>
          <div class="example-card">
            <code>"Add a weather card for New York City"</code>
          </div>
          <div class="example-card">
            <code>"Create a todo list component"</code>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- END EDITABLE ZONE -->
    <!-- ========================================== -->
  `,
  styles: [`
    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      animation: fade-in 0.5s ease;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 48px;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .greeting {
      display: block;
      font-size: 1.25rem;
      font-weight: 400;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .highlight {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 500px;
      margin: 0 auto;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 24px;
      transition: all 0.3s ease;
    }

    .card:hover {
      border-color: var(--accent-primary);
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg), var(--shadow-glow);
    }

    .feature-card {
      text-align: center;
    }

    .card-icon {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }

    .card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .card p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .info-card {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-lg);
      padding: 32px;
      margin-bottom: 48px;
    }

    .info-card h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .steps-list {
      list-style: none;
      counter-reset: steps;
    }

    .steps-list li {
      counter-increment: steps;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .steps-list li::before {
      content: counter(steps);
      width: 32px;
      height: 32px;
      background: var(--accent-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: white;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .example-section h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .example-card {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
    }

    .example-card code {
      font-family: var(--font-mono);
      font-size: 0.875rem;
      color: var(--accent-secondary);
    }

    @media (max-width: 768px) {
      .title {
        font-size: 1.75rem;
      }

      .greeting {
        font-size: 1rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }

      .info-card {
        padding: 24px;
      }
    }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardContentComponent {
  // This component's content can be modified by AI commands
  // Add any dynamic data or state here
}

