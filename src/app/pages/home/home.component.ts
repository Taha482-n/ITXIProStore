import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent, SearchBarComponent], // Add SearchBarComponent here
})
export class HomeComponent implements OnInit {
  searchQuery = signal('');

  constructor(
    public productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.fetchProducts();
    console.log('Products on Home Init:', this.productService.products);
    // Fetch products when the component initializes
  }

  get paginatedProducts() {
    const query = this.searchQuery().toLowerCase();
    return this.productService.paginated.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product); // Ensure this receives a `Product` type
  }

  loadMoreProducts() {
    this.productService.loadMoreProducts(); // Fetch next page from API
  }
}
