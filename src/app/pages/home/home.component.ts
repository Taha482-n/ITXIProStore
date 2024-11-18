import { Component, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CardComponent } from '../../components/card/card.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CardComponent, ProductCardComponent, CommonModule],
})
export class HomeComponent implements OnInit {
  // Signals for products and weather
  searchQuery = signal('');
  products = signal<Product[]>([]);
  weatherCards = signal<any[]>([]);

  // Variables for loading more products
  productsPageSize = 5;
  loadedProductsCount = 5; // Start with 5 products
  
  // Variables for pagination of weather section
  weatherPageSize = 8; // Number of weather data items per page
  loadedWeatherCount = 3; // Tracks the number of weather items loaded

  // Computed signals for filtered products
  filteredProducts = computed(() =>
    this.products().filter((product) =>
      product.title.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  // Computed signal for paginated products
  paginatedProducts = computed(() => {
    return this.filteredProducts().slice(0, this.loadedProductsCount);
  });

  // Computed signal for paginated weather cards
  paginatedWeatherCards = computed(() => {
    return this.weatherCards().slice(0, this.loadedWeatherCount);
  });

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    const selectedOption = await this.getSelectedWeatherOption();
    this.fetchWeatherData(selectedOption, 0, this.weatherPageSize); // Initial fetch for the first page
    this.fetchProducts();
  }

  // Fetch the selected weather option from Firestore
  async getSelectedWeatherOption(): Promise<string> {
    const docRef = doc(this.firestore, 'settings/weather');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()['weatherOption'];
    }
    return 'current'; // Default to current weather if not found
  }

  // Fetch the products from the fake store API
  fetchProducts() {
    this.http.get<Product[]>('https://fakestoreapi.com/products').subscribe(
      (data) => {
        this.products.set(data);
      },
      (error) => console.error('Error fetching products:', error)
    );
  }

  // Fetch weather data based on selected option and pagination
  fetchWeatherData(option: string, start: number, pageSize: number) {
    let apiUrl = '';
    if (option === 'current') {
      apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true`;
    } else if (option === 'past') {
      apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    } else if (option === 'archive') {
      apiUrl = `https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m`;
    }

    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        this.processWeatherData(data, option, start, pageSize);
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
  }

  // Process the weather data based on selected option and update weatherCards signal
  processWeatherData(data: any, option: string, start: number, pageSize: number) {
    let weatherData: any[] = [];

    if (option === 'current') {
      const current = data['current_weather'];
      weatherData.push({
        title: 'Current Weather',
        subtitle: `Time: ${current.time}`,
        content: `Temperature: ${current.temperature}°C\nWind Speed: ${current.windspeed} km/h`,
      });
    } else if (option === 'past') {
      const times = data['hourly']['time'];
      const temperatures = data['hourly']['temperature_2m'];
      const humidities = data['hourly']['relative_humidity_2m'];
      const windSpeeds = data['hourly']['wind_speed_10m'];

      // Paginate the weather data for 'past'
      for (let i = start; i < start + pageSize && i < times.length; i++) {
        weatherData.push({
          title: 'Past Weather',
          subtitle: `Date: ${times[i].replace('T', ' ')}`,
          content: `Temperature: ${temperatures[i]}°C\nHumidity: ${humidities[i]}%\nWind Speed: ${windSpeeds[i]} km/h`,
        });
      }
    } else if (option === 'archive') {
      const times = data['hourly']['time'];
      const temperatures = data['hourly']['temperature_2m'];

      // Paginate the weather data for 'archive'
      for (let i = start; i < start + pageSize && i < times.length; i++) {
        weatherData.push({
          title: 'Archive Weather',
          subtitle: `Date: ${times[i].replace('T', ' ')}`,
          content: `Temperature: ${temperatures[i]}°C`,
        });
      }
    }

    // Update the weather cards signal with new data
    this.weatherCards.update((cards) => [...cards, ...weatherData]);
  }

  // Add product to the cart
  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert('Product added to cart!');
  }

  // Handle search input change
  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Load more products (paginate)
  loadMoreProducts() {
    this.loadedProductsCount += this.productsPageSize;
  }
  
  loadMoreWeather() {
    this.loadedWeatherCount += this.weatherPageSize;
  }
}
