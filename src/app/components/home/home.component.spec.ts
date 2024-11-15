import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { of } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Product } from '../../models/product.model';
import { Firestore } from '@angular/fire/firestore';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  const mockFirestore = {
    collection: jasmine.createSpy().and.returnValue({
      get: jasmine.createSpy().and.returnValue(of([])), // Mocking Firestore collection retrieval
    }),
  };

  beforeEach(() => {
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatPaginatorModule,
        HomeComponent, // Moved HomeComponent to imports for standalone
        ProductCardComponent, // Moved ProductCardComponent to imports for standalone
      ],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: Firestore, useValue: mockFirestore }, // Mock Firestore provider
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test: Fetch products
  it('should fetch products and set them correctly', fakeAsync(() => {
    const mockProducts: Product[] = [
      { 
        id: 1, title: 'Product 1', price: 100, category: 'Category 1', description: 'Description 1',
        image: 'image1.jpg', rating: { rate: 4, count: 100 }
      },
      { 
        id: 2, title: 'Product 2', price: 200, category: 'Category 2', description: 'Description 2',
        image: 'image2.jpg', rating: { rate: 5, count: 200 }
      },
    ];

    // Simulate HTTP call
    spyOn(component['http'], 'get').and.returnValue(of(mockProducts));
    
    component.ngOnInit();
    tick();

    expect(component.products()).toEqual(mockProducts);
  }));

  it('should fetch weather data and set weather cards', fakeAsync(() => {
    const mockWeatherData = {
      current_weather: {
        time: '2024-11-10T12:00:00Z',  // Ensure 'time' is provided
        temperature: 25,
        windspeed: 10
      }
    };
  
    // Simulate HTTP call for weather data
    spyOn(component['http'], 'get').and.returnValue(of(mockWeatherData));
  
    component.fetchWeatherData('current'); // Call method to fetch weather
    tick();
  
    expect(component.weatherCards().length).toBe(1); // Assert weather data was processed correctly
    expect(component.weatherCards()[0].title).toBe('Current Weather');
    expect(component.weatherCards()[0].content).toContain('Temperature: 25°C');
  }));
  


  // Test: Search functionality
  it('should filter products based on search query', fakeAsync(() => {
    const mockProducts: Product[] = [
      { 
        id: 1, title: 'Product 1', price: 100, category: 'Category 1', description: 'Description 1',
        image: 'image1.jpg', rating: { rate: 4, count: 100 }
      },
      { 
        id: 2, title: 'Product 2', price: 200, category: 'Category 2', description: 'Description 2',
        image: 'image2.jpg', rating: { rate: 5, count: 200 }
      },
    ];

    component.products.set(mockProducts);

    // Simulating a search query input
    const searchEvent = { target: { value: 'Product 1' } } as unknown as Event;  // Cast to Event correctly
    component.onSearchChange(searchEvent);
    tick();

    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].title).toBe('Product 1');
  }));

  // Test: Pagination for products
  it('should paginate products correctly', fakeAsync(() => {
    const mockProducts: Product[] = [
      { 
        id: 1, title: 'Product 1', price: 100, category: 'Category 1', description: 'Description 1',
        image: 'image1.jpg', rating: { rate: 4, count: 100 }
      },
      { 
        id: 2, title: 'Product 2', price: 200, category: 'Category 2', description: 'Description 2',
        image: 'image2.jpg', rating: { rate: 5, count: 200 }
      },
      { 
        id: 3, title: 'Product 3', price: 300, category: 'Category 3', description: 'Description 3',
        image: 'image3.jpg', rating: { rate: 4, count: 150 }
      },
      { 
        id: 4, title: 'Product 4', price: 400, category: 'Category 4', description: 'Description 4',
        image: 'image4.jpg', rating: { rate: 5, count: 300 }
      },
      { 
        id: 5, title: 'Product 5', price: 500, category: 'Category 5', description: 'Description 5',
        image: 'image5.jpg', rating: { rate: 4, count: 120 }
      },
    ];

    component.products.set(mockProducts);
    component.productsCurrentPage = 1; // Set to second page (index 1)
    
    const paginated = component.paginatedProducts();
    
    expect(paginated.length).toBe(1);
    expect(paginated[0].title).toBe('Product 5');
  }));

  // Test: Add product to cart
  it('should add a product to the cart', () => {
    const product: Product = { 
      id: 1, title: 'Product 1', price: 100, category: 'Category 1', description: 'Description 1',
      image: 'image1.jpg', rating: { rate: 4, count: 100 }
    };

    component.addToCart(product);

    expect(mockCartService.addToCart).toHaveBeenCalledWith(product);
  });
});
