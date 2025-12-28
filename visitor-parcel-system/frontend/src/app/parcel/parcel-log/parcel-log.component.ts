import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-parcel-log',
  templateUrl: './parcel-log.component.html',
  styleUrls: ['./parcel-log.component.css']
})
export class ParcelLogComponent implements OnInit {
  parcelForm!: FormGroup;
  residents: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.parcelForm = this.fb.group({
      residentId: ['', Validators.required],
      courierName: ['', Validators.required],
      trackingId: [''],
      media: [''],
      arrivalDate: [new Date(), Validators.required]
    });

    this.loadResidents();
  }

  loadResidents() {
    this.apiService.getUsers('Resident').subscribe({
      next: (users) => this.residents = users,
      error: (err) => console.error('Failed to load residents', err)
    });
  }

  onSubmit(): void {
    if (this.parcelForm.valid) {
      const formVal = this.parcelForm.value;

      const payload = {
        residentId: formVal.residentId,
        courierName: formVal.courierName,
        trackingId: formVal.trackingId || '',
        name: formVal.courierName, // Fallback
        purpose: formVal.trackingId ? `Tracking: ${formVal.trackingId}` : 'No tracking ID',
        media: formVal.media || '',
        vehicleDetails: ''
      };

      this.apiService.createParcel(payload).subscribe({
        next: (res) => {
          this.snackBar.open('Parcel logged successfully', 'Close', { duration: 3000 });
          this.parcelForm.reset({ arrivalDate: new Date() });
        },
        error: (err) => {
          this.snackBar.open('Error logging parcel: ' + err.error?.message, 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill required fields', 'Close', { duration: 2000 });
    }
  }
}
