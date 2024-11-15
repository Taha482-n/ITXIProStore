// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
  ],
})
export class HeaderComponent {
  constructor(
    private auth: Auth,
    private router: Router,
    public userService: UserService,
    public cartService: CartService
  ) {}

  get cartItemCount(): number {
    return this.cartService.totalItems;
  }

  get userRole(): string | null {
    return this.userService.userRole;
  }

  get isAuthenticated(): boolean {
    return this.userService.isAuthenticated;
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/home']);
  }
}
