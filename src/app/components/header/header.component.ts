import { Component, OnInit, signal, computed } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { WeatherService } from '../../services/weather.service';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
  ],
})
export class HeaderComponent implements OnInit {
  cartItemCount = computed(() =>
    this.cartService.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );
  currentWeather = signal<{ temperature: string; time: string } | null>(null);
  isBurgerMenuOpen = signal<boolean>(false);
  isSmallScreen = signal<boolean>(window.innerWidth <= 768);
  isLoadingWeather = signal<boolean>(false); // Loader for weather updates
  isAccountPanelOpen = signal<boolean>(false);

  constructor(
    private auth: Auth,
    private router: Router,
    public userService: UserService,
    public cartService: CartService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.weatherService.fetchWeatherData();
    this.startWeatherRotation();

    // Add event listener for screen resize
    window.addEventListener('resize', this.updateScreenSize.bind(this));
  }

  toggleBurgerMenu() {
    this.isBurgerMenuOpen.set(!this.isBurgerMenuOpen());
  }

  toggleAccountPanel() {
    this.isAccountPanelOpen.set(!this.isAccountPanelOpen());
  }

  closeAccountPanel() {
    this.isAccountPanelOpen.set(false);
  }

  updateScreenSize() {
    this.isSmallScreen.set(window.innerWidth <= 768);
    if (!this.isSmallScreen()) {
      this.isBurgerMenuOpen.set(false);
    } else {
      this.isAccountPanelOpen.set(false);
    }
  }

  startWeatherRotation() {
    let index = 0;
    setInterval(() => {
      const weatherData = this.weatherService.weatherCards();
      if (weatherData.length > 0) {
        const { temperature, time } = weatherData[index];
        this.currentWeather.set({ temperature, time });
        index = (index + 1) % weatherData.length;
      }
    }, 3000);
  }

  updateWeather(option: string) {
    if (this.isAdminOrWeatherManager) {
      this.isLoadingWeather.set(true); // Show loader
      this.weatherService.setWeatherOption(option);
      this.fetchAndSetWeather(); // Fetch and set weather data
    }
  }

  fetchAndSetWeather() {
    this.weatherService.fetchWeatherData().then(() => {
      const weatherData = this.weatherService.weatherCards();
      if (weatherData.length > 0) {
        const { temperature, time } = weatherData[0];
        this.currentWeather.set({ temperature, time });
      }
      this.isLoadingWeather.set(false); // Hide loader after data is fetched
    });
  }

  simplifiedWeather(): string | null {
    const current = this.currentWeather();
    return current ? current.temperature : null;
  }

  weatherTimeLabel(): string {
    const current = this.currentWeather();
    if (!current?.time) {
      return 'Syncing';
    }
    const parts = current.time.split(',');
    return (parts[1] || parts[0]).trim();
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/home']);
  }

  get isAdminOrWeatherManager(): boolean {
    return this.userRole === 'admin' || this.userRole === 'weather-manager';
  }

  get userRole(): string | null {
    return this.userService.userRole;
  }

  get isAuthenticated(): boolean {
    return this.userService.isAuthenticated;
  }
}
