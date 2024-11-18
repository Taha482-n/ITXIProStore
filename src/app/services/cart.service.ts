// src/app/services/cart.service.ts
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]); // Cart items as a Signal

  addToCart(product: Product) {
    const currentCart = [...this.cartItems()];
    const itemIndex = currentCart.findIndex((item) => item.product.id === product.id);
  
    if (itemIndex > -1) {
      currentCart[itemIndex].quantity += 1;
    } else {
      currentCart.push({ product, quantity: 1 });
    }
    this.cartItems.set(currentCart);
    console.log('Cart Updated:', this.cartItems());
  }
  

  removeFromCart(productId: number) {
    const updatedCart = this.cartItems().filter((item) => item.product.id !== productId);
    this.cartItems.set(updatedCart);
  }

  clearCart() {
    this.cartItems.set([]);
  }

  get totalItems(): number {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }
}
