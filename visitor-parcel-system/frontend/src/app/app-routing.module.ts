import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { ResidentComponent } from './dashboard/resident/resident.component';
import { SecurityComponent } from './dashboard/security/security.component';
import { RoleGuard } from './core/role.guard';

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
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
