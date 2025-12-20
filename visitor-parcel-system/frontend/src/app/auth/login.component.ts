import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email">
            </mat-form-field>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">Login</button>
            <p *ngIf="error" class="error">{{ error }}</p>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; }
    mat-card { width: 400px; }
    .full-width { width: 100%; margin-bottom: 10px; }
    .error { color: red; margin-top: 10px; }
  `]
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
                    if (res.user.role === 'Security' || res.user.role === 'Admin') {
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
