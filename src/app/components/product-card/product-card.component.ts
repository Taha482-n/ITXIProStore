// src/app/components/product-card/product-card.component.ts
import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() addToCart!: (product: Product) => void;

  onAddToCart() {
    if (this.addToCart) {
      this.addToCart(this.product);
    }
  }
}
