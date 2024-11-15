import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from '../../services/cart.service';
import { Firestore } from '@angular/fire/firestore';
import { Product } from '../../models/product.model';
import { CardComponent } from '../card/card.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let firestoreMock: jasmine.SpyObj<Firestore>;

  const mockProducts: Product[] = [
    { id: 1, title: 'Product 1', price: 10, description: 'Description', category: 'Category', image: '', rating: { rate: 4, count: 100 } },
    { id: 2, title: 'Product 2', price: 20, description: 'Description', category: 'Category', image: '', rating: { rate: 4.5, count: 150 } },
  ];

  const mockWeatherData = {
    current_weather: { time: '2024-11-15T10:00:00Z', temperature: 15, windspeed: 5 },
  };

  beforeEach(async () => {
    cartServiceMock = jasmine.createSpyObj('CartService', ['addToCart']);
    firestoreMock = jasmine.createSpyObj('Firestore', ['doc'], {});

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CommonModule,
        CardComponent,
        ProductCardComponent,
      ],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: Firestore, useValue: firestoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', fakeAsync(() => {
    // Trigger ngOnInit and tick to process async code
    fixture.detectChanges();
    tick();

    // Mock the request to the fake store API
    const req = httpMock.expectOne('https://fakestoreapi.com/products');
    expect(req.request.method).toBe('GET'); // Ensure it is a GET request

    // Provide a mock response for the request
    req.flush(mockProducts);

    // Check that the products signal was updated
    expect(component.products()).toEqual(mockProducts);

    // Check that only the first 5 products are paginated
    expect(component.paginatedProducts()).toEqual(mockProducts.slice(0, 5));
  }));

  it('should fetch weather data on initialization', fakeAsync(() => {
    // Manually call fetchWeatherData
    component.fetchWeatherData('current', 0, component.weatherPageSize);
    tick();

    const req = httpMock.expectOne(
      'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);

    const weatherCards = component.weatherCards();
    expect(weatherCards.length).toBe(1);
    expect(weatherCards[0].title).toBe('Current Weather');
  }));

  it('should filter products based on search query', () => {
    component.products.set(mockProducts);
    component.searchQuery.set('Product 1');

    const filteredProducts = component.filteredProducts();
    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].title).toBe('Product 1');
  });

  it('should load more products on "Load More" click', () => {
    component.products.set(mockProducts);
    component.loadedProductsCount = 1;

    component.loadMoreProducts();

    expect(component.loadedProductsCount).toBe(6);
    expect(component.paginatedProducts().length).toBe(mockProducts.length);
  });

  it('should add product to the cart', () => {
    const product = mockProducts[0];
    component.addToCart(product);

    expect(cartServiceMock.addToCart).toHaveBeenCalledWith(product);
  });
});
