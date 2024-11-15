import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
})
export class ProductCardComponent {
  @Input() product!: Product; // The product to be displayed
  @Output() addToCart = new EventEmitter<Product>(); // EventEmitter for addToCart

  // Method to emit the addToCart event
  onAddToCart() {
    this.addToCart.emit(this.product);
  }
}
