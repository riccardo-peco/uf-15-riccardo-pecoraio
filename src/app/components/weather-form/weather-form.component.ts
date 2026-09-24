import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, catchError, debounceTime, first, map, of, switchMap } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { WeatherRequestParams } from '../../models/weather.model';

@Component({
  selector: 'app-weather-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather-form.component.html',
  styleUrl: './weather-form.component.css'
})
export class WeatherFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly weatherService = inject(WeatherService);

  @Output() readonly search = new EventEmitter<WeatherRequestParams>();

  readonly form = this.fb.nonNullable.group(
    {
      latitude: this.fb.control<number | null>(null, {
        validators: [Validators.required, Validators.min(-90), Validators.max(90)]
      }),
      longitude: this.fb.control<number | null>(null, {
        validators: [Validators.required, Validators.min(-180), Validators.max(180)]
      })
    },
    {
      asyncValidators: [this.coordinatesExistValidator()]
    }
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { latitude, longitude } = this.form.getRawValue();
    if (latitude === null || longitude === null) {
      return;
    }
    this.search.emit({ latitude, longitude });
  }

  /**
   * AsyncValidator a livello di gruppo: dopo un debounce, verifica in tempo reale
   * presso il servizio meteo che la coppia lat/lon restituisca dati validi.
   */
  private coordinatesExistValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const latitude = control.get('latitude')?.value as number | null;
      const longitude = control.get('longitude')?.value as number | null;

      if (latitude === null || longitude === null) {
        return of(null);
      }
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return of(null);
      }

      return of(null).pipe(
        debounceTime(500),
        switchMap(() => this.weatherService.checkCoordinatesValid(latitude, longitude)),
        map((isValid) => (isValid ? null : { coordinatesUnreachable: true })),
        catchError(() => of({ coordinatesUnreachable: true })),
        first()
      );
    };
  }
}
