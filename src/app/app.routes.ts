import { Routes } from '@angular/router';
import { autenticadoGuard, invitadoGuard, rolGuard } from './guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    title: 'Temas · Tertulia',
    loadComponent: () => import('./pages/temas/temas').then((m) => m.Temas),
  },
  {
    path: 'temas/nuevo',
    title: 'Nuevo tema · Tertulia',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./pages/tema-form/tema-form').then((m) => m.TemaForm),
  },
  {
    path: 'temas/:id/editar',
    title: 'Editar tema · Tertulia',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./pages/tema-form/tema-form').then((m) => m.TemaForm),
  },
  {
    path: 'temas/:id',
    title: 'Tema · Tertulia',
    loadComponent: () => import('./pages/tema-detalle/tema-detalle').then((m) => m.TemaDetalle),
  },
  {
    path: 'perfil',
    title: 'Mi perfil · Tertulia',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./pages/perfil/perfil').then((m) => m.Perfil),
  },
  {
    path: 'moderacion',
    title: 'Moderación · Tertulia',
    canActivate: [rolGuard],
    data: { roles: ['MODERADOR', 'ADMIN'] },
    loadComponent: () => import('./pages/moderacion/moderacion').then((m) => m.Moderacion),
  },
  {
    path: 'admin',
    title: 'Administración · Tertulia',
    canActivate: [rolGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
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
