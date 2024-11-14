// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cart.asObservable();

  addToCart(product: Product) {
    const currentCart = this.cart.value.slice();
    const itemIndex = currentCart.findIndex(
      (item) => item.product.id === product.id
    );

    if (itemIndex > -1) {
      currentCart[itemIndex].quantity += 1;
    } else {
      currentCart.push({ product, quantity: 1 });
    }
    this.cart.next(currentCart);
  }

  removeFromCart(productId: number) {
    const currentCart = this.cart.value.filter(
      (item) => item.product.id !== productId
    );
    this.cart.next(currentCart);
  }

  clearCart() {
    this.cart.next([]);
  }
}
