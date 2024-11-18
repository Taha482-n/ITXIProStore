import { Routes } from '@angular/router';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { RoleGuard } from '../guards/role.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: ManageUsersComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
