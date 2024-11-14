// src/app/components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
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
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    public auth: Auth
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout() {
    const user = this.auth.currentUser;
    if (user) {
      // User is logged in
      alert('Order placed successfully! Payment on delivery.');
      this.cartService.clearCart();
      this.router.navigate(['/home']);
    } else {
      // User is not logged in
      alert('Please log in to proceed to checkout.');
      this.router.navigate(['/login']);
    }
  }
  
}
