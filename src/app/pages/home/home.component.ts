import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component'; // Correct import path
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent], // Add imports here
})
export class HomeComponent implements OnInit {
  searchQuery = signal('');

  constructor(
    public productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.fetchProducts(); // Fetch products when the component initializes
  }

  get paginatedProducts() {
    return this.productService.paginated; // Use the paginated products signal
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product); // Ensure this receives a `Product` type
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value); // Update search query
  }

  loadMoreProducts() {
    this.productService.increasePagination(); // Increase pagination
  }
}
