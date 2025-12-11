import { Injectable, signal, effect } from '@angular/core';

export interface Theme {
  id: string;
  name: string;
  icon: string;
  colors: ThemeColors;
}

export interface ThemeColors {
  bgVoid: string;
  bgDeep: string;
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgCard: string;
  bgCardHover: string;
  bgGlass: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDim: string;
  accentCyan: string;
  accentPurple: string;
  accentPink: string;
  accentBlue: string;
  accentIndigo: string;
  borderSubtle: string;
  borderLight: string;
  borderGlow: string;
  shadowGlow: string;
  shadowSm: string;
  shadowLg: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

/**
 * ThemeService - Manages application themes
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themes: Theme[] = [
    {
      id: 'light',
      name: 'Light',
      icon: '☀️',
      colors: {
        bgVoid: '#f8f9fc',
        bgDeep: '#f1f3f8',
        bgPrimary: '#ffffff',
        bgSecondary: '#f5f7fa',
        bgTertiary: '#eef1f6',
        bgCard: 'rgba(255, 255, 255, 0.95)',
        bgCardHover: 'rgba(255, 255, 255, 0.98)',
        bgGlass: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#1a1d26',
        textSecondary: '#4a5568',
        textMuted: '#718096',
        textDim: '#a0aec0',
        accentCyan: '#0891b2',
        accentPurple: '#7c3aed',
        accentPink: '#db2777',
        accentBlue: '#2563eb',
        accentIndigo: '#4f46e5',
        borderSubtle: 'rgba(0, 0, 0, 0.06)',
        borderLight: 'rgba(0, 0, 0, 0.1)',
        borderGlow: 'rgba(79, 70, 229, 0.2)',
        shadowGlow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 60px rgba(79, 70, 229, 0.08)',
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.06)',
        shadowLg: '0 8px 48px rgba(0, 0, 0, 0.1)',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#2563eb'
      }
    },
    {
      id: 'dark',
      name: 'Midnight',
      icon: '🌙',
      colors: {
        bgVoid: '#030308',
        bgDeep: '#0a0a12',
        bgPrimary: '#0d0d18',
        bgSecondary: '#12121f',
        bgTertiary: '#181828',
        bgCard: 'rgba(20, 20, 35, 0.9)',
        bgCardHover: 'rgba(30, 30, 50, 0.95)',
        bgGlass: 'rgba(15, 15, 25, 0.95)',
        textPrimary: '#ffffff',
        textSecondary: '#b4b4c8',
        textMuted: '#6b6b85',
        textDim: '#4a4a60',
        accentCyan: '#00f5ff',
        accentPurple: '#a855f7',
        accentPink: '#ec4899',
        accentBlue: '#3b82f6',
        accentIndigo: '#6366f1',
        borderSubtle: 'rgba(255, 255, 255, 0.05)',
        borderLight: 'rgba(255, 255, 255, 0.1)',
        borderGlow: 'rgba(99, 102, 241, 0.4)',
        shadowGlow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(99, 102, 241, 0.15)',
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.3)',
        shadowLg: '0 8px 48px rgba(0, 0, 0, 0.5)',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      }
    },
    {
      id: 'ocean',
      name: 'Ocean',
      icon: '🌊',
      colors: {
        bgVoid: '#0c1929',
        bgDeep: '#0f2137',
        bgPrimary: '#132a45',
        bgSecondary: '#1a3654',
        bgTertiary: '#214263',
        bgCard: 'rgba(19, 42, 69, 0.9)',
        bgCardHover: 'rgba(26, 54, 84, 0.95)',
        bgGlass: 'rgba(15, 33, 55, 0.95)',
        textPrimary: '#e0f2fe',
        textSecondary: '#7dd3fc',
        textMuted: '#38bdf8',
        textDim: '#0ea5e9',
        accentCyan: '#22d3ee',
        accentPurple: '#818cf8',
        accentPink: '#f472b6',
        accentBlue: '#60a5fa',
        accentIndigo: '#6366f1',
        borderSubtle: 'rgba(56, 189, 248, 0.1)',
        borderLight: 'rgba(56, 189, 248, 0.2)',
        borderGlow: 'rgba(34, 211, 238, 0.4)',
        shadowGlow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(34, 211, 238, 0.15)',
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.25)',
        shadowLg: '0 8px 48px rgba(0, 0, 0, 0.4)',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        info: '#22d3ee'
      }
    },
    {
      id: 'sunset',
      name: 'Sunset',
      icon: '🌅',
      colors: {
        bgVoid: '#1a0a14',
        bgDeep: '#2d1320',
        bgPrimary: '#3d1a2c',
        bgSecondary: '#4d2238',
        bgTertiary: '#5d2a44',
        bgCard: 'rgba(61, 26, 44, 0.9)',
        bgCardHover: 'rgba(77, 34, 56, 0.95)',
        bgGlass: 'rgba(45, 19, 32, 0.95)',
        textPrimary: '#fdf2f8',
        textSecondary: '#fbcfe8',
        textMuted: '#f9a8d4',
        textDim: '#f472b6',
        accentCyan: '#fbbf24',
        accentPurple: '#e879f9',
        accentPink: '#fb7185',
        accentBlue: '#f97316',
        accentIndigo: '#ec4899',
        borderSubtle: 'rgba(251, 113, 133, 0.1)',
        borderLight: 'rgba(251, 113, 133, 0.2)',
        borderGlow: 'rgba(236, 72, 153, 0.4)',
        shadowGlow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(236, 72, 153, 0.15)',
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.25)',
        shadowLg: '0 8px 48px rgba(0, 0, 0, 0.4)',
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#f87171',
        info: '#f472b6'
      }
    },
    {
      id: 'forest',
      name: 'Forest',
      icon: '🌲',
      colors: {
        bgVoid: '#0a1410',
        bgDeep: '#0f1f18',
        bgPrimary: '#142a20',
        bgSecondary: '#1a3528',
        bgTertiary: '#204030',
        bgCard: 'rgba(20, 42, 32, 0.9)',
        bgCardHover: 'rgba(26, 53, 40, 0.95)',
        bgGlass: 'rgba(15, 31, 24, 0.95)',
        textPrimary: '#ecfdf5',
        textSecondary: '#a7f3d0',
        textMuted: '#6ee7b7',
        textDim: '#34d399',
        accentCyan: '#2dd4bf',
        accentPurple: '#a78bfa',
        accentPink: '#f472b6',
        accentBlue: '#22d3ee',
        accentIndigo: '#34d399',
        borderSubtle: 'rgba(110, 231, 183, 0.1)',
        borderLight: 'rgba(110, 231, 183, 0.2)',
        borderGlow: 'rgba(52, 211, 153, 0.4)',
        shadowGlow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(52, 211, 153, 0.15)',
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.25)',
        shadowLg: '0 8px 48px rgba(0, 0, 0, 0.4)',
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#f87171',
        info: '#2dd4bf'
      }
    },
    {
      id: 'lavender',
      name: 'Lavender',
      icon: '💜',
      colors: {
        bgVoid: '#faf5ff',
        bgDeep: '#f3e8ff',
        bgPrimary: '#ffffff',
        bgSecondary: '#faf5ff',
        bgTertiary: '#f3e8ff',
        bgCard: 'rgba(255, 255, 255, 0.95)',
        bgCardHover: 'rgba(255, 255, 255, 0.98)',
        bgGlass: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#3b0764',
        textSecondary: '#6b21a8',
        textMuted: '#9333ea',
        textDim: '#a855f7',
        accentCyan: '#06b6d4',
        accentPurple: '#9333ea',
        accentPink: '#ec4899',
        accentBlue: '#8b5cf6',
        accentIndigo: '#7c3aed',
        borderSubtle: 'rgba(147, 51, 234, 0.1)',
        borderLight: 'rgba(147, 51, 234, 0.15)',
        borderGlow: 'rgba(147, 51, 234, 0.3)',
        shadowGlow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 60px rgba(147, 51, 234, 0.1)',
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.06)',
        shadowLg: '0 8px 48px rgba(0, 0, 0, 0.1)',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#8b5cf6'
      }
    },
    {
      id: 'rose',
      name: 'Rose Gold',
      icon: '🌸',
      colors: {
        bgVoid: '#fff1f2',
        bgDeep: '#ffe4e6',
        bgPrimary: '#ffffff',
        bgSecondary: '#fff1f2',
        bgTertiary: '#ffe4e6',
        bgCard: 'rgba(255, 255, 255, 0.95)',
        bgCardHover: 'rgba(255, 255, 255, 0.98)',
        bgGlass: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#4c0519',
        textSecondary: '#881337',
        textMuted: '#be123c',
        textDim: '#e11d48',
        accentCyan: '#14b8a6',
        accentPurple: '#be185d',
        accentPink: '#e11d48',
        accentBlue: '#f43f5e',
        accentIndigo: '#db2777',
        borderSubtle: 'rgba(225, 29, 72, 0.1)',
        borderLight: 'rgba(225, 29, 72, 0.15)',
        borderGlow: 'rgba(219, 39, 119, 0.3)',
        shadowGlow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 60px rgba(219, 39, 119, 0.1)',
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.06)',
        shadowLg: '0 8px 48px rgba(0, 0, 0, 0.1)',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#f43f5e'
      }
    },
    {
      id: 'cyber',
      name: 'Cyberpunk',
      icon: '🤖',
      colors: {
        bgVoid: '#0a0a0a',
        bgDeep: '#121212',
        bgPrimary: '#1a1a1a',
        bgSecondary: '#222222',
        bgTertiary: '#2a2a2a',
        bgCard: 'rgba(26, 26, 26, 0.95)',
        bgCardHover: 'rgba(34, 34, 34, 0.98)',
        bgGlass: 'rgba(18, 18, 18, 0.95)',
        textPrimary: '#00ff00',
        textSecondary: '#00cc00',
        textMuted: '#009900',
        textDim: '#006600',
        accentCyan: '#00ffff',
        accentPurple: '#ff00ff',
        accentPink: '#ff0080',
        accentBlue: '#0080ff',
        accentIndigo: '#00ff00',
        borderSubtle: 'rgba(0, 255, 0, 0.1)',
        borderLight: 'rgba(0, 255, 0, 0.2)',
        borderGlow: 'rgba(0, 255, 0, 0.5)',
        shadowGlow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 255, 0, 0.2)',
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.4)',
        shadowLg: '0 8px 48px rgba(0, 0, 0, 0.6)',
        success: '#00ff00',
        warning: '#ffff00',
        error: '#ff0000',
        info: '#00ffff'
      }
    }
  ];

  currentTheme = signal<Theme>(this.themes[0]);
  currentThemeId = signal<string>('light');

  constructor() {
    // Load saved theme from localStorage
    const savedThemeId = localStorage.getItem('dashboard-theme');
    if (savedThemeId) {
      const theme = this.themes.find(t => t.id === savedThemeId);
      if (theme) {
        this.currentTheme.set(theme);
        this.currentThemeId.set(savedThemeId);
      }
    }

    // Apply theme when it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  setTheme(themeId: string) {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
      this.currentThemeId.set(themeId);
      localStorage.setItem('dashboard-theme', themeId);
    }
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    const colors = theme.colors;

    root.style.setProperty('--bg-void', colors.bgVoid);
    root.style.setProperty('--bg-deep', colors.bgDeep);
    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-secondary', colors.bgSecondary);
    root.style.setProperty('--bg-tertiary', colors.bgTertiary);
    root.style.setProperty('--bg-card', colors.bgCard);
    root.style.setProperty('--bg-card-hover', colors.bgCardHover);
    root.style.setProperty('--bg-glass', colors.bgGlass);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--text-dim', colors.textDim);
    root.style.setProperty('--accent-cyan', colors.accentCyan);
    root.style.setProperty('--accent-purple', colors.accentPurple);
    root.style.setProperty('--accent-pink', colors.accentPink);
    root.style.setProperty('--accent-blue', colors.accentBlue);
    root.style.setProperty('--accent-indigo', colors.accentIndigo);
    root.style.setProperty('--border-subtle', colors.borderSubtle);
    root.style.setProperty('--border-light', colors.borderLight);
    root.style.setProperty('--border-glow', colors.borderGlow);
    root.style.setProperty('--shadow-glow', colors.shadowGlow);
    root.style.setProperty('--shadow-sm', colors.shadowSm);
    root.style.setProperty('--shadow-lg', colors.shadowLg);
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--error', colors.error);
    root.style.setProperty('--info', colors.info);
  }
}

