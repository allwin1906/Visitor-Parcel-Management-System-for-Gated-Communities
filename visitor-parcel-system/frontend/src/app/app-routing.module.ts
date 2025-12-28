import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { ResidentComponent } from './dashboard/resident/resident.component';
import { SecurityComponent } from './dashboard/security/security.component';
import { RoleGuard } from './core/role.guard';

import { VisitorLogComponent } from './visitor/visitor-log/visitor-log.component';
import { ResidentApprovalComponent } from './visitor/resident-approval/resident-approval.component';
import { ParcelLogComponent } from './parcel/parcel-log/parcel-log.component';
import { ResidentParcelComponent } from './parcel/resident-parcel/resident-parcel.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'resident',
    component: ResidentComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Resident'] }
  },
  {
    path: 'security',
    component: SecurityComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Security', 'Admin'] }
  },
  {
    path: 'visitor/log',
    component: VisitorLogComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Security', 'Admin'] }
  },
  {
    path: 'visitor/approval',
    component: ResidentApprovalComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Resident'] }
  },
  {
    path: 'parcel/log',
    component: ParcelLogComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Security', 'Admin'] }
  },
  {
    path: 'parcel/tracking',
    component: ResidentParcelComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Resident'] }
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
