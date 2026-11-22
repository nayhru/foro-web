import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sin-permiso',
    title: 'Sin permiso · Tertulia',
    loadComponent: () =>
      import('./pages/acceso-denegado/acceso-denegado').then((m) => m.AccesoDenegado),
  },
  {
    path: '**',
    title: 'Página no encontrada · Tertulia',
    loadComponent: () => import('./pages/no-encontrada/no-encontrada').then((m) => m.NoEncontrada),
  },
];
