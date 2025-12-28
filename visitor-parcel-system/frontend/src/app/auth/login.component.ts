import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card glass-panel">
        <mat-card-header class="login-header">
            <div class="icon-container elevation-z4">
                <mat-icon class="shield-icon">security</mat-icon>
            </div>
            <mat-card-title class="login-title">Welcome Back</mat-card-title>
            <mat-card-subtitle class="login-subtitle">Sign in to access the system</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width custom-field">
              <mat-label>Email Address</mat-label>
              <mat-icon matPrefix class="input-icon">email</mat-icon>
              <input matInput formControlName="email" placeholder="name@example.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width custom-field">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix class="input-icon">lock</mat-icon>
              <input matInput type="password" formControlName="password">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid" class="submit-btn">
                <span class="btn-label">Log In</span>
                <mat-icon>arrow_forward</mat-icon>
            </button>
            
            <div *ngIf="error" class="error-msg" @fadeIn>
                <mat-icon>error_outline</mat-icon> 
                <span>{{ error }}</span>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        min-height: 80vh; 
        padding: 1rem;
    }
    .login-card { 
        width: 100%; 
        max-width: 400px; 
        padding-bottom: 2rem;
        background: var(--bg-glass) !important;
        border: 1px solid var(--border-color) !important;
        backdrop-filter: blur(20px);
    }
    
    .login-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2.5rem 1rem 1rem;
        text-align: center;
    }
    
    .icon-container {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        transform: rotate(-5deg);
        transition: transform 0.3s ease;
    }
    
    .login-card:hover .icon-container {
        transform: rotate(0deg) scale(1.05);
    }

    .shield-icon {
        font-size: 40px;
        height: 40px;
        width: 40px;
        color: white;
    }

    .login-title {
        font-size: 1.75rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        background: linear-gradient(135deg, var(--text-primary), var(--primary-700));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .login-subtitle {
        font-size: 0.95rem;
        color: var(--text-secondary);
    }

    .login-form {
        display: flex; 
        flex-direction: column; 
        gap: 1.25rem;
        padding: 0 1rem;
    }

    .custom-field mat-icon {
        color: var(--text-light);
    }
    
    .submit-btn { 
        padding: 1.5rem !important; 
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .error-msg { 
        color: var(--error-700); 
        background-color: var(--error-50); 
        padding: 1rem; 
        border-radius: var(--radius-md); 
        display: flex; 
        align-items: center; 
        gap: 0.75rem;
        font-size: 0.9rem;
        border: 1px solid var(--border-color);
        margin-top: 0.5rem;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.user.role === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (res.user.role === 'Security') {
            this.router.navigate(['/security']);
          } else {
            this.router.navigate(['/resident']);
          }
        },
        error: (err) => this.error = err.error.message || 'Login failed'
      });
    }
  }
}
