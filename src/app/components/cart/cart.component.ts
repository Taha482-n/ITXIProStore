import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class CartComponent {
  constructor(public cartService: CartService, private router: Router, public auth: Auth) {}

  get cartItems() {
    return this.cartService.cartItems();
  }

  get totalPrice(): number {
    return this.cartService.totalPrice;
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout() {
    const user = this.auth.currentUser;
    if (user) {
      alert('Order placed successfully! Payment on delivery.');
      this.cartService.clearCart();
      this.router.navigate(['/home']);
    } else {
      alert('Please log in to proceed to checkout.');
      this.router.navigate(['/login']);
    }
  }
}
