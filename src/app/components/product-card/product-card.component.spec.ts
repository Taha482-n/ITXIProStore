import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../models/product.model';
import { MatButtonModule } from '@angular/material/button';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let mockProduct: Product;
  let mockAddToCart: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule, ProductCardComponent], // Moved ProductCardComponent to imports
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;

    // Define a sample product
    mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 10,
      description: 'A sample product',
      category: 'Electronics',
      image: 'sample-image-url',
      rating: { rate: 4.5, count: 10 },
    };

    // Assign mock product and mock addToCart function
    component.product = mockProduct;
    mockAddToCart = jasmine.createSpy('addToCart');
    component.addToCart = mockAddToCart; // Assign the spy directly

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call addToCart when the button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
