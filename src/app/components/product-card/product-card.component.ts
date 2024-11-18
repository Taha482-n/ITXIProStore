import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
})
export class ProductCardComponent {
  @Input() product!: Product; // Accept a Product as input
  @Output() addToCart = new EventEmitter<Product>(); // Emit Product on addToCart

  onAddToCart() {
    this.addToCart.emit(this.product); // Emit the product when clicked
  }
}
