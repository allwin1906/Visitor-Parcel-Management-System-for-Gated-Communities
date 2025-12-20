import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
import { SocketService } from '../../shared/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resident',
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span>Resident Dashboard</span>
      <span class="spacer"></span>
      <button mat-icon-button>
        <mat-icon [matBadge]="items.length" matBadgeColor="accent">notifications</mat-icon>
      </button>
      <button mat-button (click)="logout()">
        <mat-icon>exit_to_app</mat-icon> Logout
      </button>
    </mat-toolbar>

    <div class="container">
      <div class="dashboard-header">
        <h1>Welcome, {{ user?.name }}</h1>
      </div>

      <div class="grid-container">
        <!-- Visitor Section -->
        <div class="section">
          <h2><mat-icon>person</mat-icon> Active Visitors</h2>
          <div *ngIf="getVisitors().length === 0" class="empty-state">No active visitors</div>
          <mat-card *ngFor="let item of getVisitors()" class="item-card">
            <mat-card-header>
              <div mat-card-avatar class="avatar-icon visitor-icon">
                <mat-icon>person</mat-icon>
              </div>
              <mat-card-title>{{ item.description }}</mat-card-title>
              <mat-card-subtitle>
                {{ item.created_at | date:'medium' }}
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="status-chip" [ngClass]="'status-' + item.status.toLowerCase().replace(' ', '')">
                {{ item.status }}
              </div>
            </mat-card-content>
            <mat-card-actions *ngIf="item.status === 'WaitingForApproval'" align="end">
              <button mat-button color="warn" (click)="updateStatus(item.id, 'Rejected')">REJECT</button>
              <button mat-raised-button color="primary" (click)="updateStatus(item.id, 'Approved')">APPROVE</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Parcel Section -->
        <div class="section">
          <h2><mat-icon>local_shipping</mat-icon> Parcels</h2>
          <div *ngIf="getParcels().length === 0" class="empty-state">No pending parcels</div>
          <mat-card *ngFor="let item of getParcels()" class="item-card">
            <mat-card-header>
              <div mat-card-avatar class="avatar-icon parcel-icon">
                <mat-icon>inventory_2</mat-icon>
              </div>
              <mat-card-title>{{ item.description }}</mat-card-title>
              <mat-card-subtitle>{{ item.created_at | date:'short' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="status-chip" [ngClass]="'status-' + item.status.toLowerCase()">
                {{ item.status }}
              </div>
            </mat-card-content>
            <mat-card-actions *ngIf="item.status === 'Received'" align="end">
              <button mat-stroked-button color="accent" (click)="updateStatus(item.id, 'Acknowledged')">ACKNOWLEDGE</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .section { margin-bottom: 30px; }
    .item-card { margin-bottom: 15px; }
    .avatar-icon { display: flex; justify-content: center; align-items: center; color: white; }
    .visitor-icon { background-color: #3f51b5; }
    .parcel-icon { background-color: #ff4081; }
    .empty-state { color: #888; font-style: italic; padding: 20px; text-align: center; background: #fff; border-radius: 4px; }
  `]
})
export class ResidentComponent implements OnInit, OnDestroy {
  items: any[] = [];
  user: any;
  private socketSub!: Subscription;
  private apiUrl = 'http://localhost:4000/items';

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private socket: SocketService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.user = this.auth.getUser();
    this.loadItems();
    this.socket.connect();

    this.socketSub = this.socket.onNotification().subscribe(data => {
      this.loadItems();
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

  loadItems() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.items = data;
    });
  }

  getVisitors() {
    return this.items.filter(i => i.type === 'Visitor');
  }

  getParcels() {
    return this.items.filter(i => i.type === 'Parcel');
  }

  updateStatus(id: number, status: string) {
    this.http.patch(`${this.apiUrl}/${id}/status`, { status }).subscribe(() => {
      this.loadItems();
      this.snackBar.open('Status updated successfully', '', { duration: 2000 });
    });
  }

  logout() {
    this.auth.logout();
  }
}
