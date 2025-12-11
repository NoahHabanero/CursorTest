import { Injectable, signal } from '@angular/core';

export interface DeploymentEvent {
  id: string;
  type: 'command' | 'building' | 'deploying' | 'deployed' | 'error';
  message: string;
  timestamp: Date;
  command?: string;
}

/**
 * DeploymentTrackerService - Tracks commands and deployment status
 * 
 * Maintains a log of all user commands and their deployment lifecycle.
 */
@Injectable({
  providedIn: 'root'
})
export class DeploymentTrackerService {
  events = signal<DeploymentEvent[]>([]);
  currentStatus = signal<'idle' | 'building' | 'deploying' | 'deployed' | 'error'>('idle');
  lastCommand = signal<string>('');
  commandCount = signal(0);
  deployCount = signal(0);

  private eventIdCounter = 0;

  constructor() {
    // Initialize with a welcome event
    this.addEvent('deployed', 'Dashboard loaded successfully');
  }

  private generateId(): string {
    return `evt-${++this.eventIdCounter}-${Date.now()}`;
  }

  addEvent(type: DeploymentEvent['type'], message: string, command?: string) {
    const event: DeploymentEvent = {
      id: this.generateId(),
      type,
      message,
      timestamp: new Date(),
      command
    };

    this.events.update(events => {
      const newEvents = [event, ...events];
      // Keep only last 50 events
      return newEvents.slice(0, 50);
    });

    // Update current status
    if (type === 'command') {
      this.currentStatus.set('building');
      this.lastCommand.set(command || message);
      this.commandCount.update(c => c + 1);
    } else if (type === 'building') {
      this.currentStatus.set('building');
    } else if (type === 'deploying') {
      this.currentStatus.set('deploying');
    } else if (type === 'deployed') {
      this.currentStatus.set('deployed');
      this.deployCount.update(c => c + 1);
      // Reset to idle after a delay
      setTimeout(() => {
        if (this.currentStatus() === 'deployed') {
          this.currentStatus.set('idle');
        }
      }, 5000);
    } else if (type === 'error') {
      this.currentStatus.set('error');
      setTimeout(() => {
        if (this.currentStatus() === 'error') {
          this.currentStatus.set('idle');
        }
      }, 5000);
    }
  }

  trackCommand(command: string) {
    this.addEvent('command', `Command received: "${command.substring(0, 40)}${command.length > 40 ? '...' : ''}"`, command);
    
    // Simulate deployment lifecycle
    setTimeout(() => {
      this.addEvent('building', 'Building application...');
    }, 1000);

    setTimeout(() => {
      this.addEvent('deploying', 'Deploying to GitHub Pages...');
    }, 3000);

    setTimeout(() => {
      this.addEvent('deployed', 'Successfully deployed!');
    }, 6000);
  }

  clearHistory() {
    this.events.set([]);
  }

  getRecentEvents(count: number = 10): DeploymentEvent[] {
    return this.events().slice(0, count);
  }
}

