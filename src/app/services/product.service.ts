import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsSignal = signal<Product[]>(this.getProductsFromSession());
  private loadedProductCount = signal<number>(8); // Initial count of loaded products

  constructor(private http: HttpClient) {}

  // Fetch products from API if not already loaded
  fetchProducts() {
    if (this.productsSignal().length === 0) {
      this.http.get<Product[]>('https://fakestoreapi.com/products').subscribe(
        (data) => {
          this.productsSignal.set(data);
          this.saveProductsToSession(data); // Save to session storage
        },
        (error) => console.error('Error fetching products:', error)
      );
    }
  }

  // Signal for paginated products
  paginatedProducts = computed(() =>
    this.productsSignal().slice(0, this.loadedProductCount())
  );

  // Increase the pagination count to load more products
  increasePagination() {
    const currentCount = this.loadedProductCount();
    const newCount = currentCount + 4; // Load 5 more products
    this.loadedProductCount.set(newCount);
  }

  // Save products to session storage
  private saveProductsToSession(products: Product[]) {
    sessionStorage.setItem('products', JSON.stringify(products));
  }

  // Get products from session storage
  private getProductsFromSession(): Product[] {
    const storedProducts = sessionStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
  }

  // Public methods to expose signals for use in components
  get products() {
    return this.productsSignal();
  }

  get paginated() {
    return this.paginatedProducts();
  }
}
