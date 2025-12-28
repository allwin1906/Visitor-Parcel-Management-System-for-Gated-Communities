import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: any[] = [];
  residentForm: FormGroup;
  residents: any[] = [];
  securityGuards: any[] = [];
  allVisitors: any[] = [];
  allParcels: any[] = [];

  // Toggle for visibility
  showResidentForm = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public auth: AuthService
  ) {
    this.residentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
      ]],
      confirmPassword: ['', Validators.required],
      contact_info: ['', Validators.required],
      role: ['Resident']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
    this.loadHistory();
  }

  loadHistory() {
    this.apiService.getItems().subscribe(data => {
      this.allVisitors = data.filter(i => i.type === 'Visitor');
      this.allParcels = data.filter(i => i.type === 'Parcel');
    });
  }

  loadStats() {
    this.apiService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = [
          { title: 'Visitors Today', value: data.visitorsToday, icon: 'people', color: 'primary' },
          { title: 'Pending Approvals', value: data.pendingApprovals, icon: 'pending', color: 'warn' },
          { title: 'Parcels Received', value: data.parcelsReceived, icon: 'local_shipping', color: 'accent' },
          { title: 'Total Residents', value: data.totalResidents, icon: 'home', color: 'primary' },
          { title: 'Security Guards', value: data.totalSecurity, icon: 'security', color: 'accent' }
        ];
      },
      error: (err) => console.error(err)
    });
  }

  loadUsers() {
    // Load Residents
    this.apiService.getUsers('Resident').subscribe(data => this.residents = data);
    // Load Security
    this.apiService.getUsers('Security').subscribe(data => this.securityGuards = data);
  }

  addResident() {
    if (this.residentForm.invalid) return;

    const { confirmPassword, ...payload } = this.residentForm.value;

    this.apiService.registerUser(payload).subscribe({
      next: () => {
        this.snackBar.open('User registered successfully', 'OK', { duration: 3000 });
        this.residentForm.reset({ role: 'Resident' });
        this.showResidentForm = false;
        this.loadUsers();
        this.loadStats();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error adding resident', 'Close', { duration: 3000 });
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
