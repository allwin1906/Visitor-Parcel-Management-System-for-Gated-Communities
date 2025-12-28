import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Community Gate';
  user$ = this.authService.user$;
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
