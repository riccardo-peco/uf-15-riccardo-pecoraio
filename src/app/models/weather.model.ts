export interface WeatherCurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  precipitation: string;
  rain: string;
  cloud_cover: string;
  wind_speed_10m: string;
  weather_code: string;
}

export interface WeatherCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  precipitation: number;
  rain: number;
  cloud_cover: number;
  wind_speed_10m: number;
  weather_code: number;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: WeatherCurrentUnits;
  current: WeatherCurrent;
}

export interface WeatherRequestParams {
  latitude: number;
  longitude: number;
}

export interface WeatherCodeDescription {
  description: string;
  icon: string;
}
