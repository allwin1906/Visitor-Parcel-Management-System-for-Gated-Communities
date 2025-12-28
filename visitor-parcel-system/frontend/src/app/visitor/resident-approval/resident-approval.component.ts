import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-resident-approval',
  templateUrl: './resident-approval.component.html',
  styleUrls: ['./resident-approval.component.css']
})
export class ResidentApprovalComponent implements OnInit {
  pendingVisitors: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors() {
    // Ideally filter by 'New' status on backend, but here we filter on client for simplicity if backend doesn't support status filter param yet
    const user = this.authService.getUser();
    if (!user) return;

    this.apiService.getItems(user.id).subscribe({
      next: (items) => {
        // Filter for Visitors that are New
        this.pendingVisitors = items.filter(i => i.type === 'Visitor' && i.status === 'New');
      },
      error: (err) => console.error(err)
    });
  }

  updateStatus(visitor: any, status: 'Approved' | 'Rejected'): void {
    if (confirm(`Are you sure you want to ${status.toLowerCase()} this visitor?`)) {
      this.apiService.updateItemStatus(visitor.id, status).subscribe({
        next: (updated) => {
          this.snackBar.open(`Visitor ${status} successfully`, 'Close', { duration: 3000 });
          this.loadVisitors(); // Refresh list
        },
        error: (err) => {
          this.snackBar.open('Error updating status', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
