import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const darkMode = savedTheme === 'dark';
    this.setDarkMode(darkMode);
  }

  toggleTheme() {
    this.setDarkMode(!this.isDarkMode.value);
  }

  private setDarkMode(isDark: boolean) {
    this.isDarkMode.next(isDark);
    const themeClass = 'dark-theme';

    if (isDark) {
      this.renderer.addClass(document.body, themeClass);
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, themeClass);
      localStorage.setItem('theme', 'light');
    }
  }

  get currentThemeStatus(): boolean {
    return this.isDarkMode.value;
  }
}
