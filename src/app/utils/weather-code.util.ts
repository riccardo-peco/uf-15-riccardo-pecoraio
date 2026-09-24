import { WeatherCodeDescription } from '../models/weather.model';

const WEATHER_CODE_MAP: Readonly<Record<number, WeatherCodeDescription>> = {
  0: { description: 'Cielo sereno', icon: '☀️' },
  1: { description: 'Prevalentemente sereno', icon: '🌤️' },
  2: { description: 'Parzialmente nuvoloso', icon: '⛅' },
  3: { description: 'Nuvoloso', icon: '☁️' },
  45: { description: 'Nebbia', icon: '🌫️' },
  48: { description: 'Nebbia con brina', icon: '🌫️' },
  51: { description: 'Pioviggine leggera', icon: '🌦️' },
  53: { description: 'Pioviggine moderata', icon: '🌦️' },
  55: { description: 'Pioviggine intensa', icon: '🌧️' },
  61: { description: 'Pioggia leggera', icon: '🌧️' },
  63: { description: 'Pioggia moderata', icon: '🌧️' },
  65: { description: 'Pioggia intensa', icon: '🌧️' },
  71: { description: 'Nevicata leggera', icon: '🌨️' },
  73: { description: 'Nevicata moderata', icon: '🌨️' },
  75: { description: 'Nevicata intensa', icon: '❄️' },
  80: { description: 'Rovesci leggeri', icon: '🌦️' },
  81: { description: 'Rovesci moderati', icon: '🌧️' },
  82: { description: 'Rovesci violenti', icon: '⛈️' },
  95: { description: 'Temporale', icon: '⛈️' },
  96: { description: 'Temporale con grandine leggera', icon: '⛈️' },
  99: { description: 'Temporale con grandine forte', icon: '⛈️' }
};

const DEFAULT_DESCRIPTION: WeatherCodeDescription = { description: 'Condizione sconosciuta', icon: '❓' };

export function describeWeatherCode(code: number): WeatherCodeDescription {
  return WEATHER_CODE_MAP[code] ?? DEFAULT_DESCRIPTION;
}
