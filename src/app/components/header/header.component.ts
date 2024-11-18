import { Component, OnInit, signal, computed } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  // Reactive cart item count using Angular Signals
  cartItemCount = computed(() => {
    const count = this.cartService.cartItems().reduce((acc, item) => acc + item.quantity, 0);
    console.log('Cart Item Count Updated:', count); // Log the computed value
    return count;
  });

  constructor(
    private auth: Auth,
    private router: Router,
    public userService: UserService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    // Log initial cart items and item count for debugging
    console.log('Initial Cart Items:', this.cartService.cartItems());
    console.log('Initial Cart Item Count:', this.cartItemCount());
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
