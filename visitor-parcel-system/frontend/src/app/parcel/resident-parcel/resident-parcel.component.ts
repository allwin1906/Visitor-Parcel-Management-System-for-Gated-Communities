import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-resident-parcel',
  templateUrl: './resident-parcel.component.html',
  styleUrls: ['./resident-parcel.component.css']
})
export class ResidentParcelComponent implements OnInit {
  parcels: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadParcels();
  }

  loadParcels() {
    const user = this.authService.getUser();
    if (!user) return;

    this.apiService.getItems(user.id).subscribe({
      next: (items) => {
        // Filter Parcels. Ideally backed filtering
        this.parcels = items.filter(i => i.type === 'Parcel');
      },
      error: (err) => console.error(err)
    });
  }

  acknowledgeParcel(parcel: any): void {
    // Flow: Received -> Acknowledged -> Collected
    // If status is Received, move to Acknowledged. If Acknowledged, move to Collected?
    // Requirement says: Resident acknowledges parcel pickup. 
    // Let's assume this means marking it as Collected (or acknowledging notification).
    // Let's implement marking as Collected for simplicity or Acknowledged if allowed?

    // Using 'Collected' as end state per flow
    // Wait, requirement: Received -> Acknowledged -> Collected. 
    // Let's move to 'Collected' directly if Resident picks it up? Or just 'Acknowledged'?
    // "Resident acknowledges parcel pickup" -> implies Collected.

    this.apiService.updateItemStatus(parcel.id, 'Collected').subscribe({
      next: (res) => {
        this.snackBar.open('Parcel marked as collected', 'Close', { duration: 3000 });
        this.loadParcels();
      },
      error: (err) => {
        this.snackBar.open('Error: ' + err.error?.message, 'Close', { duration: 3000 });
      }
    });
  }
}
