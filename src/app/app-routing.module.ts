import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { WeatherManagerComponent } from './components/weather-manager/weather-manager.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'manage-weather',
    component: WeatherManagerComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'weather-manager'] },
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
