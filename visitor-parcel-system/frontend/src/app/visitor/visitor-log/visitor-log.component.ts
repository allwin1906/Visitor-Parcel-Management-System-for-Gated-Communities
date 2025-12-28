import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-visitor-log',
  templateUrl: './visitor-log.component.html',
  styleUrls: ['./visitor-log.component.css']
})
export class VisitorLogComponent implements OnInit {
  visitorForm!: FormGroup;
  purposes: string[] = ['Delivery', 'Guest', 'Maintenance', 'Service', 'Other'];
  residents: any[] = []; // To select resident (simulating Unit #)

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.visitorForm = this.fb.group({
      name: ['', Validators.required],
      contactWrapper: this.fb.group({
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', Validators.email]
      }),
      purpose: ['', Validators.required],
      otherPurpose: [''],
      residentId: ['', Validators.required], // Mapped to unitNumber in UI
      vehicleDetails: [''],
      media: [''],
      entryTime: [new Date(), Validators.required]
    });

    this.loadResidents();

    // Conditional validator for otherPurpose
    this.visitorForm.get('purpose')?.valueChanges.subscribe(val => {
      const otherCtrl = this.visitorForm.get('otherPurpose');
      if (val === 'Other') {
        otherCtrl?.setValidators([Validators.required]);
      } else {
        otherCtrl?.clearValidators();
      }
      otherCtrl?.updateValueAndValidity();
    });
  }

  loadResidents() {
    this.apiService.getUsers('Resident').subscribe({
      next: (users) => this.residents = users,
      error: (err) => console.error('Failed to load residents', err)
    });
  }

  onSubmit(): void {
    if (this.visitorForm.valid) {
      const formVal = this.visitorForm.value;

      const finalPurpose = formVal.purpose === 'Other' ? formVal.otherPurpose : formVal.purpose;

      const payload = {
        residentId: formVal.residentId,
        name: formVal.name,
        phone: formVal.contactWrapper.phone,
        purpose: finalPurpose,
        media: formVal.media || '',
        vehicleDetails: formVal.vehicleDetails || ''
      };

      this.apiService.createVisitor(payload).subscribe({
        next: (res) => {
          this.snackBar.open('Visitor logged successfully', 'Close', { duration: 3000 });
          this.visitorForm.reset({ entryTime: new Date() });
        },
        error: (err) => {
          this.snackBar.open('Error logging visitor: ' + err.error?.message, 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill required fields', 'Close', { duration: 2000 });
    }
  }
}
