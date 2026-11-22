import { Routes } from '@angular/router';
import { autenticadoGuard, invitadoGuard, rolGuard } from './guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    title: 'Temas · La Fogata',
    loadComponent: () => import('./pages/temas/temas').then((m) => m.Temas),
  },
  {
    path: 'temas/nuevo',
    title: 'Nuevo tema · La Fogata',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./pages/tema-form/tema-form').then((m) => m.TemaForm),
  },
  {
    path: 'temas/:id/editar',
    title: 'Editar tema · La Fogata',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./pages/tema-form/tema-form').then((m) => m.TemaForm),
  },
  {
    path: 'temas/:id',
    title: 'Tema · La Fogata',
    loadComponent: () => import('./pages/tema-detalle/tema-detalle').then((m) => m.TemaDetalle),
  },
  {
    path: 'perfil',
    title: 'Mi perfil · La Fogata',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./pages/perfil/perfil').then((m) => m.Perfil),
  },
  {
    path: 'moderacion',
    title: 'Moderación · La Fogata',
    canActivate: [rolGuard],
    data: { roles: ['MODERADOR', 'ADMIN'] },
    loadComponent: () => import('./pages/moderacion/moderacion').then((m) => m.Moderacion),
  },
  {
    path: 'admin',
    title: 'Administración · La Fogata',
    canActivate: [rolGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
  },
  {
    path: 'login',
    title: 'Iniciar sesión · La Fogata',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Crear cuenta · La Fogata',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'recuperar',
    title: 'Recuperar contraseña · La Fogata',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/recuperar/recuperar').then((m) => m.Recuperar),
  },
  {
    path: 'sin-permiso',
    title: 'Sin permiso · La Fogata',
    loadComponent: () =>
      import('./pages/acceso-denegado/acceso-denegado').then((m) => m.AccesoDenegado),
  },
  {
    path: '**',
    title: 'Página no encontrada · La Fogata',
    loadComponent: () => import('./pages/no-encontrada/no-encontrada').then((m) => m.NoEncontrada),
  },
];
