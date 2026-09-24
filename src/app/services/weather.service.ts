import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { WeatherRequestParams, WeatherResponse } from '../models/weather.model';

const CURRENT_FIELDS =
  'temperature_2m,relative_humidity_2m,precipitation,rain,cloud_cover,wind_speed_10m,weather_code';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly storageKey = 'meteo-app-last-weather';

  private readonly _weatherData = signal<WeatherResponse | null>(this.loadFromStorage());
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly weatherData = this._weatherData.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasData = computed(() => this._weatherData() !== null);

  constructor(private readonly http: HttpClient) {}

  /**
   * Recupera i dati meteo correnti per le coordinate indicate,
   * aggiorna lo stato tramite signal e li salva localmente.
   */
  fetchWeather(params: WeatherRequestParams): Observable<WeatherResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<WeatherResponse>(this.buildUrl(params, CURRENT_FIELDS)).pipe(
      tap((data) => {
        this._weatherData.set(data);
        this._loading.set(false);
        this.saveToStorage(data);
      }),
      catchError((err: unknown) => {
        this._loading.set(false);
        this._error.set('Impossibile recuperare i dati meteo. Verifica le coordinate inserite.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Verifica in modo leggero che le coordinate producano una risposta valida
   * dall'API, usata dall'AsyncValidator del form per la validazione in tempo reale.
   */
  checkCoordinatesValid(latitude: number, longitude: number): Observable<boolean> {
    return this.http.get<WeatherResponse>(this.buildUrl({ latitude, longitude }, 'temperature_2m')).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  private buildUrl(params: WeatherRequestParams, currentFields: string): string {
    const query = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      current: currentFields
    });
    return `${this.apiUrl}?${query.toString()}`;
  }

  private loadFromStorage(): WeatherResponse | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as WeatherResponse) : null;
    } catch {
      return null;
    }
  }

  private saveToStorage(data: WeatherResponse): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch {
      // storage non disponibile: si ignora silenziosamente
    }
  }
}
