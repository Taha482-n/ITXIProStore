import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { Product } from '../../models/product.model';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'This is a test product description.',
    price: 100,
    category: 'Electronics',
    image: 'test-image.jpg',
    rating: {
      rate: 4.5,
      count: 120,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatButtonModule, ProductCardComponent], // Include standalone component and dependencies
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct; // Provide a mock product input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product title', () => {
    const titleElement = fixture.debugElement.query(By.css('.product-title')).nativeElement;
    expect(titleElement.textContent).toContain(mockProduct.title);
  });

  it('should display the product description', () => {
    const descriptionElement = fixture.debugElement.query(By.css('.product-description')).nativeElement;
    expect(descriptionElement.textContent).toContain(mockProduct.description.slice(0, 100));
  });

  it('should display the product price', () => {
    const priceElement = fixture.debugElement.query(By.css('.product-price')).nativeElement;
    expect(priceElement.textContent).toContain(`$${mockProduct.price.toFixed(2)}`);
  });

  it('should display the product image', () => {
    const imageElement = fixture.debugElement.query(By.css('.image-container img')).nativeElement;
    expect(imageElement.src).toContain(mockProduct.image);
    expect(imageElement.alt).toBe(mockProduct.title);
  });

  it('should emit the product when "Add to Cart" is clicked', () => {
    spyOn(component.addToCart, 'emit');
    const addToCartButton = fixture.debugElement.query(By.css('button')).nativeElement;
    addToCartButton.click();
    expect(component.addToCart.emit).toHaveBeenCalledWith(mockProduct);
  });
});
