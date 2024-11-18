import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  weatherCards = signal<any[]>(this.getWeatherFromSession());
  selectedOption = signal<string>('current');

  constructor(private http: HttpClient) {}

  // Fetch weather data based on the current selected option
  fetchWeatherData() {
    const option = this.selectedOption();
    let apiUrl = '';

    // Define API URL based on the selected option
    if (option === 'current') {
      apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true`;
    } else if (option === 'past') {
      apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m`;
    } else if (option === 'archive') {
      apiUrl = `https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m`;
    }

    // Fetch data and process it
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        const processedData = this.processWeatherData(data, option);
        this.weatherCards.set(processedData);
        this.saveWeatherToSession(processedData);
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
  }

  // Process the data based on the selected option
  private processWeatherData(data: any, option: string): any[] {
    const weatherData: any[] = [];

    if (option === 'current') {
      const current = data['current_weather'];
      weatherData.push({
        temperature: `${current.temperature}°C`,
        wind: `${current.windspeed} km/h`,
        time: `Last Updated: ${current.time.replace('T', ' ')}`,
      });
    } else if (option === 'past' || option === 'archive') {
      const times = data['hourly']['time'];
      const temperatures = data['hourly']['temperature_2m'];

      for (let i = 0; i < Math.min(times.length, 5); i++) {
        weatherData.push({
          time: `${times[i].replace('T', ' ')}`,
          temperature: `${temperatures[i]}°C`,
        });
      }
    }

    return weatherData;
  }

  // Save weather data to session storage
  private saveWeatherToSession(weatherData: any[]) {
    sessionStorage.setItem('weatherCards', JSON.stringify(weatherData));
  }

  // Retrieve weather data from session storage
  private getWeatherFromSession(): any[] {
    const storedWeather = sessionStorage.getItem('weatherCards');
    return storedWeather ? JSON.parse(storedWeather) : [];
  }

  // Update the selected weather option and fetch new data
  setWeatherOption(option: string) {
    this.selectedOption.set(option);
    this.fetchWeatherData();
  }
}
