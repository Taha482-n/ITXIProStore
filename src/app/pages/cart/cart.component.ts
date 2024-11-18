import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartTableComponent } from '../../components/cart-table/cart-table.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, CartTableComponent],
})
export class CartComponent {
  user$ = authState(this.auth); // Reactive user state

  constructor(
    public cartService: CartService,
    private router: Router,
    public auth: Auth,
    private snackBar: MatSnackBar
  ) {}

  get cartItems() {
    return this.cartService.cartItems(); // Returns the items in the cart
  }

  get totalPrice(): number {
    return this.cartService.totalPrice; // Returns the total price
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId); // Remove item
    this.snackBar.open('Item removed from cart', 'Close', { duration: 3000 }); // Snackbar for feedback
  }

  proceedToCheckout() {
    this.user$.subscribe((user) => {
      if (user) {
        this.snackBar.open('Order placed successfully! Payment on delivery.', 'Close', { duration: 3000 });
        this.cartService.clearCart(); // Clear cart
        this.router.navigate(['/home']); // Navigate to home
      } else {
        this.snackBar.open('Please log in to proceed to checkout.', 'Close', { duration: 3000 });
        this.router.navigate(['/login']); // Navigate to login
      }
    });
  }
}
