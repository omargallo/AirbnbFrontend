import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor() {
    const theme = localStorage.getItem('theme') || 'light';
    this.setTheme(theme as 'dark' | 'light');
  }

  setTheme(theme: 'dark' | 'light') {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const current = localStorage.getItem('theme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  get currentTheme() {
    return localStorage.getItem('theme') || 'light';
  }
}
