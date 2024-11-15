import { Component, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CardComponent } from '../card/card.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CardComponent, ProductCardComponent, CommonModule, MatPaginatorModule],
})
export class HomeComponent implements OnInit {
  // Signals for products and weather
  searchQuery = signal('');
  products = signal<Product[]>([]);
  weatherCards = signal<any[]>([]);
  
  // Pagination variables for products and weather
  productsPageSize = 4;
  productsCurrentPage = 0;
  weatherPageSize = 4;
  weatherCurrentPage = 0;

  // Computed signals for filtered and paginated products and weather cards
  filteredProducts = computed(() =>
    this.products().filter((product) =>
      product.title.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  paginatedProducts = computed(() => {
    const startIndex = this.productsCurrentPage * this.productsPageSize;
    return this.filteredProducts().slice(startIndex, startIndex + this.productsPageSize);
  });

  paginatedWeatherCards = computed(() => {
    const startIndex = this.weatherCurrentPage * this.weatherPageSize;
    return this.weatherCards().slice(startIndex, startIndex + this.weatherPageSize);
  });

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.fetchProducts();
    this.fetchWeatherData('current');
  }

  fetchProducts() {
    this.http.get<Product[]>('https://fakestoreapi.com/products').subscribe(
      (data) => {
        this.products.set(data);
      },
      (error) => console.error('Error fetching products:', error)
    );
  }

  async fetchWeatherData(option: string) {
    const apiUrl = this.getWeatherApiUrl(option);
    this.http.get<any>(apiUrl).subscribe(
      (data) => this.processWeatherData(data, option),
      (error) => console.error('Error fetching weather data:', error)
    );
  }

  getWeatherApiUrl(option: string): string {
    if (option === 'current') {
      return 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true';
    } else if (option === 'past') {
      return 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';
    } else if (option === 'archive') {
      return 'https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m';
    }
    return '';
  }

  processWeatherData(data: any, option: string) {
    const weatherCards: any[] = []; // Explicitly define the array type
  
    if (option === 'current') {
      const current = data?.current_weather; // Use optional chaining
      if (current) { // Check if 'current_weather' exists
        weatherCards.push({
          title: 'Current Weather',
          subtitle: `Time: ${current.time}`,
          content: `Temperature: ${current.temperature}°C\nWind Speed: ${current.windspeed} km/h`,
        });
      }
    } else if (option === 'past') {
      const times = data?.hourly?.time;
      const temperatures = data?.hourly?.temperature_2m;
      const humidities = data?.hourly?.relative_humidity_2m;
      const windSpeeds = data?.hourly?.wind_speed_10m;
  
      if (times && temperatures && humidities && windSpeeds) { // Check if data arrays exist
        for (let i = 0; i < times.length; i++) {
          weatherCards.push({
            title: 'Past Weather',
            subtitle: `Date: ${times[i].replace('T', ' ')}`,
            content: `Temperature: ${temperatures[i]}°C\nHumidity: ${humidities[i]}%\nWind Speed: ${windSpeeds[i]} km/h`,
          });
        }
      }
    } else if (option === 'archive') {
      const times = data?.hourly?.time;
      const temperatures = data?.hourly?.temperature_2m;
  
      if (times && temperatures) { // Check if data arrays exist
        for (let i = 0; i < times.length; i++) {
          weatherCards.push({
            title: 'Archive Weather',
            subtitle: `Date: ${times[i].replace('T', ' ')}`,
            content: `Temperature: ${temperatures[i]}°C`,
          });
        }
      }
    }
  
    this.weatherCards.set(weatherCards);
  }
  

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert('Product added to cart!');
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onProductsPageChange(event: PageEvent) {
    this.productsPageSize = event.pageSize;
    this.productsCurrentPage = event.pageIndex;
  }

  onWeatherPageChange(event: PageEvent) {
    this.weatherPageSize = event.pageSize;
    this.weatherCurrentPage = event.pageIndex;
  }
}
