import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartTableComponent } from './cart-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('CartTableComponent', () => {
  let component: CartTableComponent;
  let fixture: ComponentFixture<CartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartTableComponent, MatButtonModule, MatIconModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CartTableComponent);
    component = fixture.componentInstance;

    // Mock data for the cart
    component.cartItems = [
      { product: { id: 1, title: 'Product 1', price: 100, image: 'img1.jpg' }, quantity: 2 },
      { product: { id: 2, title: 'Product 2', price: 50, image: 'img2.jpg' }, quantity: 1 },
    ];
    component.totalPrice = 250;

    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of rows in the table', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(component.cartItems.length);
  });

  it('should display the correct product information', () => {
    const firstRow = fixture.debugElement.query(By.css('tbody tr:first-child'));
    const productTitle = firstRow.query(By.css('.product-title')).nativeElement.textContent.trim();
    expect(productTitle).toBe('Product 1');
  });

  it('should display the correct total price', () => {
    const totalPriceElement = fixture.debugElement.query(By.css('tfoot .total-label + td strong'))
      .nativeElement.textContent.trim();
    expect(totalPriceElement).toBe('$250');
  });

  it('should emit the remove event with the correct product ID when remove button is clicked', () => {
    spyOn(component.removeItem, 'emit');
    const removeButton = fixture.debugElement.query(By.css('tbody tr:first-child .remove-icon'))
      .nativeElement;
    removeButton.click();

    expect(component.removeItem.emit).toHaveBeenCalledOnceWith(1);
  });

  it('should update the quantity in the model when the quantity input is changed', () => {
    const quantityInput = fixture.debugElement.query(By.css('tbody tr:first-child .quantity-input'))
      .nativeElement;

    quantityInput.value = '3';
    quantityInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.cartItems[0].quantity).toBe(3);
  });
});
