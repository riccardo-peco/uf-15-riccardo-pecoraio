import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherFormComponent } from '../../components/weather-form/weather-form.component';
import { WeatherDisplayComponent } from '../../components/weather-display/weather-display.component';
import { WeatherService } from '../../services/weather.service';
import { WeatherRequestParams } from '../../models/weather.model';

@Component({
  selector: 'app-meteo-page',
  standalone: true,
  imports: [CommonModule, WeatherFormComponent, WeatherDisplayComponent],
  templateUrl: './meteo-page.component.html',
  styleUrl: './meteo-page.component.css'
})
export class MeteoPageComponent {
  private readonly weatherService = inject(WeatherService);

  readonly weatherData = this.weatherService.weatherData;
  readonly loading = this.weatherService.loading;
  readonly error = this.weatherService.error;

  onSearch(params: WeatherRequestParams): void {
    this.weatherService.fetchWeather(params).subscribe();
  }
}
