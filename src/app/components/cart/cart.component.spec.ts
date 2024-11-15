import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';
import { of } from 'rxjs';
import { Product } from '../../models/product.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: jasmine.SpyObj<Router>;
  let authMock: Partial<Auth>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 10,
    description: 'A test product',
    category: 'Electronics',
    image: 'test-image-url',
    rating: { rate: 4.5, count: 10 },
  };

  const cartItemsMock = [{ product: mockProduct, quantity: 2 }];

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['cartItems', 'removeFromCart', 'clearCart'], {
      totalPrice: 20, // Set the totalPrice to match the expected value in the test
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Set up the Auth mock with a getter for currentUser
    authMock = {
      get currentUser() {
        return null; // Default to unauthenticated state; we'll modify it in specific tests as needed
      },
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Auth, useValue: authMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    cartService.cartItems.and.returnValue(cartItemsMock); // Mock cart items data
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve cart items from CartService', () => {
    expect(component.cartItems.length).toBe(1);
    expect(component.cartItems[0].product).toEqual(mockProduct);
    expect(component.cartItems[0].quantity).toBe(2);
  });

  it('should calculate total price correctly', () => {
    expect(component.totalPrice).toBe(20);
  });

  it('should remove item from cart', () => {
    component.removeItem(mockProduct.id);
    expect(cartService.removeFromCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should navigate to login if user is not authenticated', () => {
    // Override currentUser to simulate an unauthenticated state
    spyOnProperty(authMock, 'currentUser', 'get').and.returnValue(null);
    
    component.proceedToCheckout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should place order and clear cart if user is authenticated', () => {
    // Override currentUser to simulate an authenticated user
    spyOnProperty(authMock, 'currentUser', 'get').and.returnValue({
      uid: '123',
      emailVerified: true,
      isAnonymous: false,
      providerData: [],
      metadata: { creationTime: '', lastSignInTime: '' },
      refreshToken: '',
      tenantId: null,
      delete: jasmine.createSpy(),
      getIdToken: jasmine.createSpy(),
      getIdTokenResult: jasmine.createSpy(),
      reload: jasmine.createSpy(),
      toJSON: jasmine.createSpy(),
      displayName: null,
      email: null,
      phoneNumber: null,
      photoURL: null,
      providerId: '',
    } as unknown as User);

    component.proceedToCheckout();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
