import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal for cart items
  cartItems = signal<CartItem[]>(this.getCartFromStorage());

  // Add to cart
  addToCart(product: Product) {
    const currentCart = [...this.cartItems()];
    const itemIndex = currentCart.findIndex((item) => item.product.id === product.id);

    if (itemIndex > -1) {
      currentCart[itemIndex].quantity += 1;
    } else {
      currentCart.push({ product, quantity: 1 });
    }

    this.cartItems.set(currentCart);
    this.saveCartToStorage(currentCart); // Persist the updated cart
  }

  // Remove from cart
  removeFromCart(productId: number) {
    const updatedCart = this.cartItems().filter((item) => item.product.id !== productId);
    this.cartItems.set(updatedCart);
    this.saveCartToStorage(updatedCart); // Persist the updated cart
  }

  // Clear cart
  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('cart'); // Clear from storage
  }

  // Get total items
  get totalItems(): number {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  }

  // Get total price
  get totalPrice(): number {
    return this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  // Save cart to localStorage
  private saveCartToStorage(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Retrieve cart from localStorage
  private getCartFromStorage(): CartItem[] {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }
}
