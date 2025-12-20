import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-security',
  template: `
    <mat-toolbar color="warn" class="app-toolbar">
      <span>Security Console</span>
      <span class="spacer"></span>
      <span style="font-size: 14px; margin-right: 20px;">Guard: {{ getGuardName() }}</span>
      <button mat-button (click)="logout()">
        <mat-icon>exit_to_app</mat-icon> Logout
      </button>
    </mat-toolbar>

    <div class="container">
      <mat-card>
        <mat-tab-group animationDuration="0ms">
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">person_add</mat-icon> Check-In Visitor
            </ng-template>
            <div class="tab-content">
              <form [formGroup]="visitorForm" (ngSubmit)="submitVisitor()">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Resident ID</mat-label>
                    <input matInput type="number" formControlName="residentId" placeholder="e.g 101">
                    <mat-hint>Enter the Unit/Resident ID</mat-hint>
                  </mat-form-field>
                </div>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Visitor Name & Purpose</mat-label>
                    <textarea matInput formControlName="description" rows="3"></textarea>
                  </mat-form-field>
                </div>
                <button mat-raised-button color="primary" [disabled]="visitorForm.invalid" class="action-btn">
                  <mat-icon>send</mat-icon> Notify Resident
                </button>
              </form>
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">inventory</mat-icon> Check-In Parcel
            </ng-template>
            <div class="tab-content">
              <form [formGroup]="parcelForm" (ngSubmit)="submitParcel()">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Resident ID</mat-label>
                    <input matInput type="number" formControlName="residentId">
                  </mat-form-field>
                </div>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Parcel Details (Carrier/ID)</mat-label>
                    <input matInput formControlName="description">
                  </mat-form-field>
                </div>
                <button mat-raised-button color="accent" [disabled]="parcelForm.invalid" class="action-btn">
                  <mat-icon>save</mat-icon> Log Parcel
                </button>
              </form>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .tab-content { padding: 30px; }
    .form-row { display: flex; gap: 20px; margin-bottom: 10px; }
    .half-width { flex: 1; }
    .full-width { width: 100%; }
    .tab-icon { margin-right: 8px; }
    .action-btn { width: 100%; padding: 8px; font-size: 16px; }
  `]
})
export class SecurityComponent {
  visitorForm: FormGroup;
  parcelForm: FormGroup;
  private apiUrl = 'http://localhost:4000/items';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.visitorForm = this.fb.group({
      residentId: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.parcelForm = this.fb.group({
      residentId: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  getGuardName() {
    return this.auth.getUser()?.name;
  }

  submitVisitor() {
    this.http.post(this.apiUrl, { ...this.visitorForm.value, type: 'Visitor' })
      .subscribe({
        next: () => {
          this.snackBar.open('Visitor request sent to resident!', 'OK', { duration: 3000 });
          this.visitorForm.reset();
        },
        error: () => this.snackBar.open('Error submitting request', 'Close', { duration: 3000 })
      });
  }

  submitParcel() {
    this.http.post(this.apiUrl, { ...this.parcelForm.value, type: 'Parcel' })
      .subscribe({
        next: () => {
          this.snackBar.open('Parcel logged successfully', 'OK', { duration: 3000 });
          this.parcelForm.reset();
        },
        error: () => this.snackBar.open('Error logging parcel', 'Close', { duration: 3000 })
      });
  }

  logout() {
    this.auth.logout();
  }
}
