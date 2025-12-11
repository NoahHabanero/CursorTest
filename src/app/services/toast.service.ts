import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * ToastService - Global Toast Notification System
 * 
 * Provides beautiful, animated toast notifications throughout the app.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  show(message: string, type: Toast['type'] = 'info', duration = 4000) {
    const id = this.generateId();
    const toast: Toast = { id, message, type, duration };
    
    this.toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  success(message: string, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration = 6000) {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  warning(message: string, duration = 5000) {
    return this.show(message, 'warning', duration);
  }

  dismiss(id: string) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  dismissAll() {
    this.toasts.set([]);
  }
}

