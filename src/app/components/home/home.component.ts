// src/app/components/home/home.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CardComponent } from '../card/card.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
  // Weather variables
  weatherCards: any[] = [];
  paginatedWeatherCards: any[] = [];
  weatherPageSize = 4;
  weatherCurrentPage = 0;
  weatherTotalSize = 0;

  // Products variables
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  productsPageSize = 4;
  productsCurrentPage = 0;
  productsTotalSize = 0;

  @ViewChild('weatherPaginator') weatherPaginator!: MatPaginator;
  @ViewChild('productsPaginator') productsPaginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    const selectedOption = await this.getSelectedWeatherOption();
    this.fetchWeatherData(selectedOption);
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<Product[]>('https://fakestoreapi.com/products').subscribe(
      (data) => {
        this.products = data;
        this.productsTotalSize = this.products.length;
        this.paginateProducts();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  async getSelectedWeatherOption(): Promise<string> {
    const docRef = doc(this.firestore, 'settings/weather');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()['weatherOption'];
    }
    return 'current'; // default option
  }

  fetchWeatherData(option: string) {
    let apiUrl = '';
    if (option === 'current') {
      apiUrl =
        'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true';
    } else if (option === 'past') {
      apiUrl =
        'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';
    } else if (option === 'archive') {
      apiUrl =
        'https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m';
    }

    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        this.processWeatherData(data, option);
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
  }

  processWeatherData(data: any, option: string) {
    // Clear existing cards
    this.weatherCards = [];

    if (option === 'current') {
      const current = data['current_weather'];
      this.weatherCards.push({
        title: 'Current Weather',
        subtitle: `Time: ${current.time}`,
        content: `Temperature: ${current.temperature}°C\nWind Speed: ${current.windspeed} km/h`,
      });
    } else if (option === 'past') {
      const times = data['hourly']['time'];
      const temperatures = data['hourly']['temperature_2m'];
      const humidities = data['hourly']['relative_humidity_2m'];
      const windSpeeds = data['hourly']['wind_speed_10m'];

      for (let i = 0; i < times.length; i++) {
        this.weatherCards.push({
          title: 'Past Weather',
          subtitle: `Date: ${times[i].replace('T', ' ')}`,
          content: `Temperature: ${temperatures[i]}°C\nHumidity: ${humidities[i]}%\nWind Speed: ${windSpeeds[i]} km/h`,
        });
      }
    } else if (option === 'archive') {
      const times = data['hourly']['time'];
      const temperatures = data['hourly']['temperature_2m'];

      for (let i = 0; i < times.length; i++) {
        this.weatherCards.push({
          title: 'Archive Weather',
          subtitle: `Date: ${times[i].replace('T', ' ')}`,
          content: `Temperature: ${temperatures[i]}°C`,
        });
      }
    }
    this.weatherTotalSize = this.weatherCards.length;
    this.paginateWeatherCards();
  }

  paginateWeatherCards() {
    const startIndex = this.weatherCurrentPage * this.weatherPageSize;
    const endIndex = startIndex + this.weatherPageSize;
    this.paginatedWeatherCards = this.weatherCards.slice(startIndex, endIndex);
  }

  onWeatherPageChange(event: PageEvent) {
    this.weatherPageSize = event.pageSize;
    this.weatherCurrentPage = event.pageIndex;
    this.paginateWeatherCards();
  }

  paginateProducts() {
    const startIndex = this.productsCurrentPage * this.productsPageSize;
    const endIndex = startIndex + this.productsPageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  onProductsPageChange(event: PageEvent) {
    this.productsPageSize = event.pageSize;
    this.productsCurrentPage = event.pageIndex;
    this.paginateProducts();
  }

  addToCart = (product: Product) => {
    this.cartService.addToCart(product);
    alert('Product added to cart!');
  };  
}
