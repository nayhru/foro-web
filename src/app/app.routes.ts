import { Routes } from '@angular/router';
import { invitadoGuard } from './guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    title: 'Temas · Tertulia',
    loadComponent: () => import('./pages/temas/temas').then((m) => m.Temas),
  },
  {
    path: 'login',
    title: 'Iniciar sesión · Tertulia',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Crear cuenta · Tertulia',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'recuperar',
    title: 'Recuperar contraseña · Tertulia',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/recuperar/recuperar').then((m) => m.Recuperar),
  },
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
