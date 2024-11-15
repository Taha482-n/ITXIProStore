// src/app/services/cart.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
  });

  it('should add a product to the cart', () => {
    const product: Product = {
      id: 1,
      title: 'Test Product',
      price: 10,
      description: 'A test product',
      category: 'Electronics',
      image: 'test-image-url',
      rating: { rate: 4.5, count: 10 }
    };
    service.addToCart(product);
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(1);
  });

  it('should increase quantity if product already exists in cart', () => {
    const product: Product = {
      id: 1,
      title: 'Test Product',
      price: 10,
      description: 'A test product',
      category: 'Electronics',
      image: 'test-image-url',
      rating: { rate: 4.5, count: 10 }
    };
    service.addToCart(product);
    service.addToCart(product);
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
  });

  it('should remove a product from the cart', () => {
    const product: Product = {
      id: 1,
      title: 'Test Product',
      price: 10,
      description: 'A test product',
      category: 'Electronics',
      image: 'test-image-url',
      rating: { rate: 4.5, count: 10 }
    };
    service.addToCart(product);
    service.removeFromCart(1);
    expect(service.cartItems().length).toBe(0);
  });

  it('should clear the cart', () => {
    const product: Product = {
      id: 1,
      title: 'Test Product',
      price: 10,
      description: 'A test product',
      category: 'Electronics',
      image: 'test-image-url',
      rating: { rate: 4.5, count: 10 }
    };
    service.addToCart(product);
    service.clearCart();
    expect(service.cartItems().length).toBe(0);
  });
});
