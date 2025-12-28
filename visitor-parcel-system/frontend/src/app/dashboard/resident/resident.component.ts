import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../shared/api.service';
import { SocketService } from '../../shared/socket.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resident',
  template: `
    <div class="dashboard-container">
      <div class="welcome-header">
        <h1>Resident Portal</h1>
        <p>Welcome back, <strong>{{ user?.name }}</strong></p>
      </div>

      <div class="action-grid">
        <mat-card class="action-card approval-card ripple-effect" (click)="navigate('/visitor/approval')">
          <div class="card-bg-icon">
            <mat-icon>how_to_reg</mat-icon>
          </div>
          <mat-card-header>
            <div class="icon-circle approval-icon-bg">
                <mat-icon>how_to_reg</mat-icon>
            </div>
            <div>
                <mat-card-title>Visitor Approvals</mat-card-title>
                <mat-card-subtitle>Manage entry requests</mat-card-subtitle>
            </div>
          </mat-card-header>
          <mat-card-content>
            <p>Review and approve pending visitor requests for your unit.</p>
            <div class="status-indicator" *ngIf="pendingVisitors > 0">
                <span class="pulse-dot"></span>
                {{ pendingVisitors }} Pending Request{{ pendingVisitors > 1 ? 's' : '' }}
            </div>
            <div class="status-indicator neutral" *ngIf="pendingVisitors === 0">
                <mat-icon inline style="font-size: 16px; width: 16px; height: 16px;">check_circle</mat-icon>
                All caught up
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card parcel-card ripple-effect" (click)="navigate('/parcel/tracking')">
          <div class="card-bg-icon">
            <mat-icon>local_shipping</mat-icon>
          </div>
          <mat-card-header>
            <div class="icon-circle parcel-icon-bg">
                <mat-icon>mark_email_unread</mat-icon>
            </div>
            <div>
                <mat-card-title>My Parcels</mat-card-title>
                <mat-card-subtitle>Track deliveries</mat-card-subtitle>
            </div>
          </mat-card-header>
          <mat-card-content>
            <p>View your parcel history and pickup codes.</p>
            <div class="status-indicator info" *ngIf="pendingParcels > 0">
                <mat-icon inline style="font-size: 16px; width: 16px; height: 16px;">inventory_2</mat-icon>
                {{ pendingParcels }} Parcel{{ pendingParcels > 1 ? 's' : '' }} to collect
            </div>
            <div class="status-indicator neutral" *ngIf="pendingParcels === 0">
                <mat-icon inline style="font-size: 16px; width: 16px; height: 16px;">check_circle</mat-icon>
                No pending parcels
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="recent-section">
        <h3><mat-icon class="section-icon">history</mat-icon> Recent Activity</h3>
        
        <div class="activity-list" *ngIf="recentItems.length > 0; else noData">
          <div *ngFor="let item of recentItems.slice(0, 5); let i = index" 
               class="activity-item-wrapper" 
               [style.animation-delay]="i * 0.1 + 's'">
            <mat-card class="activity-item">
                <div class="activity-icon" [ngClass]="item.type === 'Visitor' ? 'icon-visitor' : 'icon-parcel'">
                <mat-icon>{{ item.type === 'Visitor' ? 'person' : 'inventory_2' }}</mat-icon>
                </div>
                <div class="activity-details">
                <span class="activity-title">{{ item.name || item.description }}</span>
                <span class="activity-meta">
                    {{ item.type }} &bull; {{ item.created_at | date:'short' }}
                </span>
                </div>
                <div class="activity-status">
                <span class="status-chip" [ngClass]="'status-' + item.status.toLowerCase()">
                    {{ item.status }}
                </span>
                </div>
            </mat-card>
          </div>
        </div>
        
        <ng-template #noData>
          <div class="empty-state">
            <mat-icon>notifications_off</mat-icon>
            <h3>All Quiet</h3>
            <p>No recent activity or requests to show.</p>
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
      border: 1px solid rgba(255,255,255,0.6);
      background: linear-gradient(145deg, #ffffff, #f8fafc);
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

    .approval-icon-bg { background: var(--warning-50); color: var(--warning-700); }
    .parcel-icon-bg { background: var(--info-50); color: var(--info-700); }

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

    .status-indicator {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 20px;
        background: var(--warning-50);
        color: var(--warning-700);
        font-weight: 700;
        font-size: 0.85rem;
        margin-top: 1rem;
        border: 1px solid rgba(0,0,0,0.05);
    }
    
    .status-indicator.info {
        background: var(--info-50);
        color: var(--info-700);
    }

    .status-indicator.neutral {
        background: var(--bg-body);
        color: var(--text-secondary);
        font-weight: 500;
        border: 1px solid transparent;
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background-color: currentColor;
        border-radius: 50%;
        animation: pulse 2s infinite;
        box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
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
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .activity-item:hover {
      border-color: var(--primary-100);
      background: white;
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
  `]
})
export class ResidentComponent implements OnInit, OnDestroy {
  user: any;
  recentItems: any[] = [];
  pendingVisitors = 0;
  pendingParcels = 0;

  private socketSub!: Subscription;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private socket: SocketService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.user = this.auth.getUser();
    this.loadData();

    // Listen for real-time updates
    this.socket.connect();
    this.socketSub = this.socket.onNotification().subscribe(data => {
      this.loadData(); // Refresh on new notification
      this.snackBar.open(`${data.type}: ${data.message}`, 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
  }

  ngOnDestroy() {
    if (this.socketSub) this.socketSub.unsubscribe();
    this.socket.disconnect();
  }

  loadData() {
    if (!this.user) return;

    this.api.getItems(this.user.id).subscribe({
      next: (items) => {
        this.recentItems = items;
        this.pendingVisitors = items.filter(i => i.type === 'Visitor' && (i.status === 'New' || i.status === 'Waiting')).length;
        this.pendingParcels = items.filter(i => i.type === 'Parcel' && (i.status === 'Received' || i.status === 'Waiting')).length;
      },
      error: (err) => console.error(err)
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
