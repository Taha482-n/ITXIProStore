import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  weatherCards = signal<any[]>([]);
  selectedOption = signal<string>('current');

  constructor(private http: HttpClient) {}

  setWeatherOption(option: string) {
    this.selectedOption.set(option);
  }

  fetchWeatherData(): Promise<void> {
    const option = this.selectedOption();
    let apiUrl = '';

    if (option === 'current') {
      apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true`;
    } else if (option === 'past') {
      apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m`;
    } else if (option === 'archive') {
      apiUrl = `https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m`;
    }

    this.weatherCards.set([]); // Clear previous data before fetching new data

    return new Promise<void>((resolve, reject) => {
      this.http.get<any>(apiUrl).subscribe(
        (data) => {
          const processedData = this.processWeatherData(data, option);
          this.weatherCards.set(processedData); // Update weather data
          resolve();
        },
        (error) => {
          console.error('Error fetching weather data:', error);
          reject(error);
        }
      );
    });
  }

  private processWeatherData(data: any, option: string): any[] {
    const weatherData: any[] = [];

    if (option === 'current') {
      const current = data['current_weather'];
      weatherData.push({
        temperature: `${current.temperature}°C`,
        time: new Date(current.time).toLocaleString(),
      });
    } else if (option === 'past' || option === 'archive') {
      const times = data['hourly']['time'];
      const temperatures = data['hourly']['temperature_2m'];
      for (let i = 0; i < Math.min(times.length, 5); i++) {
        weatherData.push({
          temperature: `${temperatures[i]}°C`,
          time: new Date(times[i]).toLocaleString(),
        });
      }
    }

    return weatherData;
  }
}
