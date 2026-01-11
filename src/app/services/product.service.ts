import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly pageSize = 10;
  private readonly storageKey = 'products';
  private readonly pageKey = 'productsPage';
  private readonly totalKey = 'productsTotal';
  private readonly sourceKey = 'productsSource';
  private readonly sourceId = 'dummyjson';
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
      .get<DummyJsonProductsResponse>(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
      )
      .subscribe(
        (data) => {
          const nextItems = data.products.map((product) =>
            this.mapToProduct(product)
          );
          if (nextItems.length === 0) {
            this.hasMoreSignal.set(false);
            if (replace) {
              this.productsSignal.set([]);
              this.saveProductsToStorage([], page, data.total);
            }
            return;
          }

          const combined = replace
            ? nextItems
            : [...this.productsSignal(), ...nextItems];

          this.productsSignal.set(combined);
          this.currentPage.set(page);
          this.hasMoreSignal.set(combined.length < data.total);
          this.saveProductsToStorage(combined, page, data.total);
        },
        (error) => console.error('Error fetching products:', error)
      );
  }

  private saveProductsToStorage(
    products: Product[],
    page: number,
    total: number | null
  ) {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
    localStorage.setItem(this.pageKey, String(page));
    localStorage.setItem(this.sourceKey, this.sourceId);
    if (typeof total === 'number') {
      localStorage.setItem(this.totalKey, String(total));
    } else {
      localStorage.removeItem(this.totalKey);
    }
  }

  private getProductsFromStorage(): Product[] {
    const storedProducts = localStorage.getItem(this.storageKey);
    const storedPage = localStorage.getItem(this.pageKey);
    const storedSource = localStorage.getItem(this.sourceKey);
    if (storedProducts && storedSource !== this.sourceId) {
      this.clearStoredProducts();
      return [];
    }
    if (!storedPage && storedProducts) {
      this.clearStoredProducts();
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
    const storedTotal = this.getTotalFromStorage();
    if (storedTotal !== null) {
      return parsedProducts.length < storedTotal;
    }
    return parsedProducts.length % this.pageSize === 0;
  }

  private getTotalFromStorage(): number | null {
    const storedTotal = localStorage.getItem(this.totalKey);
    if (storedTotal === null) {
      return null;
    }
    const parsedTotal = Number(storedTotal);
    return Number.isNaN(parsedTotal) ? null : parsedTotal;
  }

  private clearStoredProducts() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.pageKey);
    localStorage.removeItem(this.totalKey);
    localStorage.removeItem(this.sourceKey);
  }

  private mapToProduct(product: DummyJsonProduct): Product {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.thumbnail ?? product.images?.[0] ?? '',
      rating: {
        rate: product.rating ?? 0,
        count: 0,
      },
    };
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

interface DummyJsonProductsResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

interface DummyJsonProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail?: string;
  images?: string[];
  rating?: number;
}
