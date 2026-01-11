import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly pageSize = 8;
  private readonly storageKey = 'products';
  private readonly pageKey = 'productsPage';
  private productsSignal = signal<Product[]>(this.getProductsFromStorage());
  private currentPage = signal<number>(this.getPageFromStorage());
  private hasMoreSignal = signal<boolean>(this.getHasMoreFromStorage());

  constructor(private http: HttpClient) {}

  // Fetch the first page of products from the API
  fetchProducts() {
    if (this.productsSignal().length === 0) {
      this.currentPage.set(0);
      this.hasMoreSignal.set(true);
      this.loadPage(0, true);
    }
  }

  // Signal for paginated products
  paginatedProducts = computed(() => this.productsSignal());

  // Load the next page of products from the API
  loadMoreProducts() {
    if (!this.hasMoreSignal()) {
      return;
    }
    this.loadPage(this.currentPage() + 1);
  }

  private loadPage(page: number, replace = false) {
    const limit = this.pageSize;
    const skip = page * this.pageSize;
    console.log(`Loading page ${page}, skip: ${skip}, limit: ${limit}`);
    this.http
      .get<Product[]>(
        `https://fakestoreapi.com/products?limit=${limit}&skip=${skip}`
      )
      .subscribe(
        (data) => {
          const nextItems = data;

          if (nextItems.length === 0) {
            this.hasMoreSignal.set(false);
            if (replace) {
              this.productsSignal.set([]);
              this.saveProductsToStorage([], page);
            }
            return;
          }

          const combined = replace
            ? nextItems
            : [...this.productsSignal(), ...nextItems];

          this.productsSignal.set(combined);
          this.currentPage.set(page);
          this.hasMoreSignal.set(nextItems.length === this.pageSize);
          this.saveProductsToStorage(combined, page);
        },
        (error) => console.error('Error fetching products:', error)
      );
  }

  private saveProductsToStorage(products: Product[], page: number) {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
    localStorage.setItem(this.pageKey, String(page));
  }

  private getProductsFromStorage(): Product[] {
    const storedProducts = localStorage.getItem(this.storageKey);
    const storedPage = localStorage.getItem(this.pageKey);
    if (!storedPage && storedProducts) {
      localStorage.removeItem(this.storageKey);
      return [];
    }
    return storedProducts ? JSON.parse(storedProducts) : [];
  }

  private getPageFromStorage(): number {
    const storedPage = localStorage.getItem(this.pageKey);
    if (storedPage === null) {
      return 0;
    }
    const parsedPage = Number(storedPage);
    return Number.isNaN(parsedPage) ? 0 : parsedPage;
  }

  private getHasMoreFromStorage(): boolean {
    const storedProducts = localStorage.getItem(this.storageKey);
    if (!storedProducts) {
      return true;
    }
    const parsedProducts = JSON.parse(storedProducts) as Product[];
    if (parsedProducts.length === 0) {
      return true;
    }
    return parsedProducts.length % this.pageSize === 0;
  }

  // Public methods to expose signals for use in components
  get products() {
    return this.productsSignal();
  }

  get paginated() {
    return this.paginatedProducts();
  }

  get hasMore() {
    return this.hasMoreSignal();
  }
}
