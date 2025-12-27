import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
})
export class ProductCardComponent {
  @Input() product!: Product; // Accept a Product as input
  @Output() addToCart = new EventEmitter<Product>(); // Emit Product on addToCart

  get isInStock(): boolean {
    return (this.product?.rating?.count ?? 0) > 0;
  }

  onAddToCart() {
    this.addToCart.emit(this.product); // Emit the product when clicked
  }
}
