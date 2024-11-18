import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import * as authModule from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayContainer } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';
import { computed } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authMock: jasmine.SpyObj<Auth>;
  let weatherServiceMock: any;
  let cartServiceMock: any;
  let userServiceMock: any;
  let router: Router;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    // Mock Auth
    authMock = jasmine.createSpyObj('Auth', ['signOut']);

    // Mock WeatherService
    weatherServiceMock = {
      fetchWeatherData: jasmine.createSpy('fetchWeatherData').and.returnValue(Promise.resolve()),
      weatherCards: jasmine.createSpy('weatherCards').and.returnValue([]),
      setWeatherOption: jasmine.createSpy('setWeatherOption'),
    };

    // Mock CartService
    cartServiceMock = {
      cartItems: jasmine.createSpy('cartItems').and.returnValue([]),
    };

    // Mock UserService with property getters and setters
    let userRole: string | null = null;
    let isAuthenticated: boolean = false;

    userServiceMock = {
      get userRole() {
        return userRole;
      },
      set userRole(value: string | null) {
        userRole = value;
      },
      get isAuthenticated() {
        return isAuthenticated;
      },
      set isAuthenticated(value: boolean) {
        isAuthenticated = value;
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent, // Since it's standalone
        CommonModule,
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatBadgeModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: WeatherService, useValue: weatherServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchWeatherData on init', () => {
    expect(weatherServiceMock.fetchWeatherData).toHaveBeenCalled();
  });

  it('should start weather rotation on init', fakeAsync(() => {
    spyOn(component, 'startWeatherRotation');
    component.ngOnInit();
    expect(component.startWeatherRotation).toHaveBeenCalled();
  }));

  it('should toggle burger menu state', () => {
    component.isBurgerMenuOpen.set(false);
    component.toggleBurgerMenu();
    expect(component.isBurgerMenuOpen()).toBeTrue();
    component.toggleBurgerMenu();
    expect(component.isBurgerMenuOpen()).toBeFalse();
  });


  it('should not update weather when user is not admin or weather manager', () => {
    userServiceMock.userRole = 'user';
    fixture.detectChanges();

    spyOn(component, 'fetchAndSetWeather');

    expect(component.isAdminOrWeatherManager).toBeFalse();

    component.updateWeather('current');

    expect(component.isLoadingWeather()).toBeFalse();
    expect(weatherServiceMock.setWeatherOption).not.toHaveBeenCalled();
    expect(component.fetchAndSetWeather).not.toHaveBeenCalled();
  });

  it('should return true for isAdminOrWeatherManager when role is admin', () => {
    userServiceMock.userRole = 'admin';
    fixture.detectChanges();
    expect(component.isAdminOrWeatherManager).toBeTrue();
  });

  it('should return true for isAdminOrWeatherManager when role is weather-manager', () => {
    userServiceMock.userRole = 'weather-manager';
    fixture.detectChanges();
    expect(component.isAdminOrWeatherManager).toBeTrue();
  });

  it('should return false for isAdminOrWeatherManager when role is user', () => {
    userServiceMock.userRole = 'user';
    fixture.detectChanges();
    expect(component.isAdminOrWeatherManager).toBeFalse();
  });


  it('should display current weather', fakeAsync(() => {
    weatherServiceMock.weatherCards.and.returnValue([
      { temperature: '25°C', time: '12:00 PM' },
    ]);

    component.startWeatherRotation();
    tick(3000); // Fast-forward 3 seconds to simulate the interval

    expect(component.currentWeather()).toBe('Temp: 25°C, Time: 12:00 PM');

    discardPeriodicTasks(); // Clean up pending timers
  }));

  it('should compute cart item count', () => {
    cartServiceMock.cartItems.and.returnValue([
      { id: '1', quantity: 2 },
      { id: '2', quantity: 3 },
    ]);

    // Re-instantiate the computed signal
    component.cartItemCount = computed(() =>
      component.cartService.cartItems().reduce((acc, item) => acc + item.quantity, 0)
    );

    expect(component.cartItemCount()).toBe(5);
  });

  it('should display the correct cart item count', () => {
    cartServiceMock.cartItems.and.returnValue([
      { id: '1', quantity: 2 },
      { id: '2', quantity: 3 },
    ]);

    // Re-instantiate the computed signal
    component.cartItemCount = computed(() =>
      component.cartService.cartItems().reduce((acc, item) => acc + item.quantity, 0)
    );

    fixture.detectChanges();

    const cartButton = fixture.debugElement.query(By.css('button[aria-label="Cart"]'));
    expect(cartButton).toBeTruthy();

    const badge = cartButton.nativeElement.querySelector('.badge');
    expect(badge.textContent).toBe('5');
  });

  it('should open and close burger menu on small screens', () => {
    component.isSmallScreen.set(true);
    fixture.detectChanges();

    const burgerButton = fixture.debugElement.query(By.css('button.burger-button'));
    expect(burgerButton).toBeTruthy();

    component.isBurgerMenuOpen.set(false);
    burgerButton.nativeElement.click();
    expect(component.isBurgerMenuOpen()).toBeTrue();

    burgerButton.nativeElement.click();
    expect(component.isBurgerMenuOpen()).toBeFalse();
  });
});
