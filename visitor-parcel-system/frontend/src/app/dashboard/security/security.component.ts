import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../shared/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  template: `
    <div class="dashboard-container">
      <div class="welcome-header">
        <h1>Security Console</h1>
        <p>Welcome, <strong>{{ getGuardName() }}</strong></p>
      </div>

      <div class="action-grid">
        <mat-card class="action-card visitor-card ripple-effect" (click)="navigate('/visitor/log')">
          <div class="card-bg-icon">
            <mat-icon>person_add</mat-icon>
          </div>
          <mat-card-header>
            <div class="icon-circle visitor-icon-bg">
                <mat-icon>person_add</mat-icon>
            </div>
            <div>
                <mat-card-title>Log Visitor</mat-card-title>
                <mat-card-subtitle>Record new entry</mat-card-subtitle>
            </div>
          </mat-card-header>
          <mat-card-content>
            <p>Register guests, deliveries, and service personnel coming in.</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button color="primary">START LOGGING <mat-icon iconPositionEnd>arrow_forward</mat-icon></button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="action-card parcel-card ripple-effect" (click)="navigate('/parcel/log')">
          <div class="card-bg-icon">
            <mat-icon>inventory_2</mat-icon>
          </div>
          <mat-card-header>
            <div class="icon-circle parcel-icon-bg">
                <mat-icon>inventory_2</mat-icon>
            </div>
            <div>
                <mat-card-title>Log Parcel</mat-card-title>
                <mat-card-subtitle>Record deliveries</mat-card-subtitle>
            </div>
          </mat-card-header>
          <mat-card-content>
            <p>Scan and record incoming packages for community residents.</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button color="accent">START LOGGING <mat-icon iconPositionEnd>arrow_forward</mat-icon></button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="recent-section">
        <h3><mat-icon class="section-icon">history</mat-icon> Recent Activity</h3>
        
        <div class="activity-list" *ngIf="recentItems.length > 0; else noData">
          <div *ngFor="let item of recentItems; let i = index" 
               class="activity-item-wrapper" 
               [style.animation-delay]="i * 0.1 + 's'">
            <mat-card class="activity-item">
                <div class="activity-icon" [ngClass]="item.type === 'Visitor' ? 'icon-visitor' : 'icon-parcel'">
                <mat-icon>{{ item.type === 'Visitor' ? 'person' : 'local_shipping' }}</mat-icon>
                </div>
                <div class="activity-details">
                <span class="activity-title">{{ item.name }}</span>
                <span class="activity-meta">
                    {{ item.type }} &bull; For: <strong>{{ item.resident?.name }}</strong>
                </span>
                </div>
                <div class="activity-status">
                <span class="status-chip" [ngClass]="'status-' + item.status.toLowerCase()">
                    <mat-icon class="chip-icon" *ngIf="item.status === 'Waiting'">hourglass_empty</mat-icon>
                    <mat-icon class="chip-icon" *ngIf="item.status === 'Approved'">check_circle</mat-icon>
                    <mat-icon class="chip-icon" *ngIf="item.status === 'Rejected'">cancel</mat-icon>
                    <mat-icon class="chip-icon" *ngIf="item.status === 'Collected'">inventory</mat-icon>
                    {{ item.status }}
                </span>
                </div>
            </mat-card>
          </div>
        </div>
        
        <ng-template #noData>
          <div class="empty-state">
            <mat-icon>inbox</mat-icon>
            <h3>No recent activity</h3>
            <p>Entries and parcels will appear here once logged.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 1rem;
    }

    .welcome-header {
      margin-bottom: 2rem;
      animation: slideIn 0.5s ease-out;
    }
    
    .welcome-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Action Cards */
    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .action-card {
      cursor: pointer;
      position: relative;
      overflow: hidden;
      height: 100%;
      border: 1px solid var(--border-color) !important;
      background: var(--bg-surface) !important;
    }

    .card-bg-icon {
      position: absolute;
      top: -20px;
      right: -20px;
      opacity: 0.05;
      transform: rotate(-10deg);
      transition: all 0.5s ease;
    }

    .card-bg-icon mat-icon {
      font-size: 180px;
      width: 180px;
      height: 180px;
    }

    .action-card:hover .card-bg-icon {
      transform: rotate(0deg) scale(1.1);
      opacity: 0.1;
    }

    .icon-circle {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        margin-bottom: 0;
    }

    .visitor-icon-bg { background: var(--primary-50); color: var(--primary-600); }
    .parcel-icon-bg { background: var(--primary-50); opacity: 0.9; color: var(--accent-600); }

    .action-card mat-card-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }

    .action-card mat-card-title { 
        font-size: 1.5rem; 
        margin-bottom: 0.25rem; 
        font-weight: 800 !important;
    }

    /* Recent Activity */
    .recent-section h3 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    .section-icon { color: var(--primary-600); }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item-wrapper {
        opacity: 0;
        animation: fadeIn 0.5s forwards;
    }

    .activity-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 1rem 1.5rem !important;
      gap: 1.5rem;
      border-radius: 16px;
      border: 1px solid var(--border-color) !important;
      background: var(--bg-surface) !important;
      transition: all 0.2s;
    }

    .activity-item:hover {
      border-color: var(--primary-500) !important;
      transform: translateX(5px);
    }

    .activity-icon {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }

    .icon-visitor { background: var(--primary-50); color: var(--primary-600); }
    .icon-parcel { background: #fce7f3; color: var(--accent-600); }

    .activity-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .activity-title {
      font-weight: 700;
      color: var(--text-primary);
      font-size: 1.05rem;
    }

    .activity-meta {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .chip-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
    }
  `]
})
export class SecurityComponent implements OnInit {
  recentItems: any[] = [];

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadRecentActivity();
  }

  getGuardName() {
    return this.auth.getUser()?.name || 'Guard';
  }

  loadRecentActivity() {
    this.api.getItems().subscribe({
      next: (items) => {
        // Show last 5
        this.recentItems = items.slice(0, 5);
      },
      error: (err) => console.error(err)
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
