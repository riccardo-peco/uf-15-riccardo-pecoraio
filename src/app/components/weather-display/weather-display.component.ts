import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherResponse } from '../../models/weather.model';
import { describeWeatherCode } from '../../utils/weather-code.util';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-display.component.html',
  styleUrl: './weather-display.component.css'
})
export class WeatherDisplayComponent {
  @Input({ required: true }) data!: WeatherResponse;

  get description(): string {
    return describeWeatherCode(this.data.current.weather_code).description;
  }

  get icon(): string {
    return describeWeatherCode(this.data.current.weather_code).icon;
  }
}
