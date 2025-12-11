import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentTrackerService, DeploymentEvent } from '../../services/deployment-tracker.service';

/**
 * DeploymentTrackerComponent - Tracks commands and deployments
 * 
 * ⚠️ PROTECTED COMPONENT - DO NOT EDIT VIA AI COMMANDS
 * Shows a live feed of user commands and deployment status.
 */
@Component({
  selector: 'app-deployment-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracker-panel">
      <!-- Header -->
      <div class="tracker-header">
        <div class="header-title">
          <span class="title-icon">📡</span>
          <span>Activity Tracker</span>
        </div>
        <div class="status-indicator" [class]="trackerService.currentStatus()">
          <span class="status-dot"></span>
          <span class="status-text">{{ getStatusText() }}</span>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">{{ trackerService.commandCount() }}</span>
          <span class="stat-label">Commands</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-value">{{ trackerService.deployCount() }}</span>
          <span class="stat-label">Deploys</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-value live">{{ uptime() }}</span>
          <span class="stat-label">Uptime</span>
        </div>
      </div>

      <!-- Current Status -->
      @if (trackerService.currentStatus() !== 'idle') {
        <div class="current-activity" [class]="trackerService.currentStatus()">
          <div class="activity-icon">
            @switch (trackerService.currentStatus()) {
              @case ('building') {
                <div class="spinner"></div>
              }
              @case ('deploying') {
                <div class="rocket">🚀</div>
              }
              @case ('deployed') {
                <span class="checkmark">✓</span>
              }
              @case ('error') {
                <span class="error-icon">✗</span>
              }
            }
          </div>
          <div class="activity-text">
            <span class="activity-status">{{ getStatusText() }}</span>
            @if (trackerService.lastCommand()) {
              <span class="activity-command">"{{ trackerService.lastCommand().substring(0, 30) }}{{ trackerService.lastCommand().length > 30 ? '...' : '' }}"</span>
            }
          </div>
        </div>
      }

      <!-- Event Timeline -->
      <div class="timeline">
        <div class="timeline-header">
          <span>Recent Activity</span>
          <button class="clear-btn" (click)="clearHistory()" title="Clear history">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        <div class="timeline-content">
          @for (event of trackerService.getRecentEvents(8); track event.id) {
            <div class="timeline-item" [class]="event.type">
              <div class="item-dot"></div>
              <div class="item-content">
                <span class="item-message">{{ event.message }}</span>
                <span class="item-time">{{ formatTime(event.timestamp) }}</span>
              </div>
            </div>
          }
          @empty {
            <div class="empty-state">
              <span class="empty-icon">📭</span>
              <span>No activity yet</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracker-panel {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-glow);
      border-radius: var(--radius-xl);
      padding: 14px;
      box-shadow: var(--shadow-glow);
      overflow: hidden;
    }

    /* Header */
    .tracker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .title-icon {
      font-size: 1rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 600;
      transition: var(--transition-base);
    }

    .status-indicator.idle {
      background: color-mix(in srgb, var(--text-muted) 15%, transparent);
      color: var(--text-muted);
    }

    .status-indicator.building {
      background: color-mix(in srgb, var(--warning) 15%, transparent);
      color: var(--warning);
    }

    .status-indicator.deploying {
      background: color-mix(in srgb, var(--info) 15%, transparent);
      color: var(--info);
    }

    .status-indicator.deployed {
      background: color-mix(in srgb, var(--success) 15%, transparent);
      color: var(--success);
    }

    .status-indicator.error {
      background: color-mix(in srgb, var(--error) 15%, transparent);
      color: var(--error);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      animation: pulse 2s ease-in-out infinite;
    }

    /* Stats Row */
    .stats-row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 10px 0;
      margin-bottom: 12px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
    }

    .stat {
      text-align: center;
      padding: 0 12px;
    }

    .stat-value {
      display: block;
      font-family: var(--font-mono);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-value.live {
      color: var(--accent-cyan);
      font-size: 0.9rem;
    }

    .stat-label {
      font-size: 0.6rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-divider {
      width: 1px;
      height: 24px;
      background: var(--border-light);
    }

    /* Current Activity */
    .current-activity {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      margin-bottom: 12px;
      border-radius: var(--radius-md);
      animation: slide-up 0.3s ease;
    }

    .current-activity.building {
      background: color-mix(in srgb, var(--warning) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--warning) 25%, transparent);
    }

    .current-activity.deploying {
      background: color-mix(in srgb, var(--info) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--info) 25%, transparent);
    }

    .current-activity.deployed {
      background: color-mix(in srgb, var(--success) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--success) 25%, transparent);
    }

    .current-activity.error {
      background: color-mix(in srgb, var(--error) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--error) 25%, transparent);
    }

    .activity-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid color-mix(in srgb, var(--warning) 25%, transparent);
      border-top-color: var(--warning);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .rocket {
      font-size: 1rem;
      animation: float 1s ease-in-out infinite;
    }

    .checkmark {
      color: var(--success);
      font-weight: bold;
      font-size: 1rem;
    }

    .error-icon {
      color: var(--error);
      font-weight: bold;
      font-size: 1rem;
    }

    .activity-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .activity-status {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .activity-command {
      font-size: 0.65rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Timeline */
    .timeline {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .clear-btn {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: var(--transition-fast);
    }

    .clear-btn:hover {
      background: color-mix(in srgb, var(--error) 15%, transparent);
      color: var(--error);
    }

    .clear-btn svg {
      width: 14px;
      height: 14px;
    }

    .timeline-content {
      flex: 1;
      overflow-y: auto;
      padding-right: 4px;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-subtle);
      animation: slide-in-right 0.3s ease;
    }

    .timeline-item:last-child {
      border-bottom: none;
    }

    .item-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-top: 4px;
      flex-shrink: 0;
    }

    .timeline-item.command .item-dot {
      background: var(--accent-purple);
    }

    .timeline-item.building .item-dot {
      background: var(--warning);
    }

    .timeline-item.deploying .item-dot {
      background: var(--info);
    }

    .timeline-item.deployed .item-dot {
      background: var(--success);
    }

    .timeline-item.error .item-dot {
      background: var(--error);
    }

    .item-content {
      flex: 1;
      min-width: 0;
    }

    .item-message {
      display: block;
      font-size: 0.75rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .item-time {
      font-size: 0.6rem;
      color: var(--text-dim);
      font-family: var(--font-mono);
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: var(--text-dim);
      font-size: 0.8rem;
    }

    .empty-icon {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }

    /* Animations */
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in-right {
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class DeploymentTrackerComponent implements OnInit, OnDestroy {
  trackerService = inject(DeploymentTrackerService);
  
  uptime = signal('00:00');
  private startTime = Date.now();
  private uptimeInterval: any;

  ngOnInit() {
    this.updateUptime();
    this.uptimeInterval = setInterval(() => this.updateUptime(), 1000);
  }

  ngOnDestroy() {
    if (this.uptimeInterval) {
      clearInterval(this.uptimeInterval);
    }
  }

  private updateUptime() {
    const elapsed = Date.now() - this.startTime;
    const minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
    this.uptime.set(`${minutes}:${seconds}`);
  }

  getStatusText(): string {
    switch (this.trackerService.currentStatus()) {
      case 'idle': return 'Idle';
      case 'building': return 'Building...';
      case 'deploying': return 'Deploying...';
      case 'deployed': return 'Deployed!';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  clearHistory() {
    this.trackerService.clearHistory();
  }
}

