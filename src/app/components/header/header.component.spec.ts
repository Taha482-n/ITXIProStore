import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute
import { Auth } from '@angular/fire/auth';  // Import Auth from @angular/fire/auth
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';  // Firebase app initialization
import { of } from 'rxjs';  // For mocking observable methods

// Mocking Auth signOut function
const authMock = jasmine.createSpyObj('Auth', ['signOut']);
const routerStub = { navigate: jasmine.createSpy('navigate') };
const userServiceStub = { userRole: 'user', isAuthenticated: true } as Partial<UserService>;
const cartServiceStub = { totalItems: 3 } as Partial<CartService>;
const activatedRouteStub = { snapshot: { params: {} } } as Partial<ActivatedRoute>;

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    // Mock the `signOut` method to return a resolved promise
    authMock.signOut.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatBadgeModule,
        CommonModule,
        // Initialize Firebase with a mock configuration for the test environment
        provideFirebaseApp(() => initializeApp({ apiKey: 'fake-api-key', authDomain: 'fake-auth-domain' })),
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: CartService, useValue: cartServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },  // Mock ActivatedRoute
        { provide: Auth, useValue: authMock },  // Provide mock for Auth
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct cart item count', () => {
    expect(component.cartItemCount).toBe(3);
  });

  it('should display the correct user role', () => {
    expect(component.userRole).toBe('user');
  });

  it('should display correct authentication status', () => {
    expect(component.isAuthenticated).toBeTrue();
  });

  it('should log out and navigate to home on logout', fakeAsync(() => {
    component.logout();
    tick();

    // Verify that the signOut function was called
    expect(authMock.signOut).toHaveBeenCalled();
    // Verify that the navigation to the home route occurred
    expect(routerStub.navigate).toHaveBeenCalledWith(['/home']);
  }));
});
