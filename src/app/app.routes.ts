import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/meteo-page/meteo-page.component').then((m) => m.MeteoPageComponent)
  }
];
