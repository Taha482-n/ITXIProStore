import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/product.model';
import { By } from '@angular/platform-browser';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 1,
    title: 'Mock Product',
    price: 100,
    description: 'This is a mock product description.',
    category: 'Mock Category',
    image: 'mock-image-url',
    rating: {
      rate: 4.5,
      count: 10,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, MatCardModule, MatButtonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct; // Set the input product
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product title', () => {
    const cardTitle = fixture.debugElement.query(By.css('mat-card-title')).nativeElement;
    expect(cardTitle.textContent).toContain(mockProduct.title); // Check for title
  });

  it('should display the product description and price', () => {
    const cardContent = fixture.debugElement.query(By.css('mat-card-content')).nativeElement;
    expect(cardContent.textContent).toContain(mockProduct.description); // Check for description
    expect(cardContent.textContent).toContain(`Price: $${mockProduct.price}`); // Check for price
  });

  it('should emit addToCart event when "Add to Cart" button is clicked', () => {
    spyOn(component.addToCart, 'emit'); // Spy on addToCart emitter

    const addButton = fixture.debugElement.query(By.css('button')).nativeElement;
    addButton.click();

    expect(component.addToCart.emit).toHaveBeenCalledOnceWith(mockProduct); // Check emitter call
  });
});
