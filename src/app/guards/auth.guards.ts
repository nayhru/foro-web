import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ForoFacade } from '../facades/foro.facade';
import { Rol } from '../models';
import { NotificacionService } from '../services/notificacion.service';

// Solo deja pasar si hay una sesión iniciada
export const autenticadoGuard: CanActivateFn = (_ruta, estado) => {
  const foro = inject(ForoFacade);
  if (foro.estaAutenticado()) return true;

  inject(NotificacionService).mostrar('Inicia sesión para continuar.');
  return inject(Router).createUrlTree(['/login'], { queryParams: { volver: estado.url } });
};

// Login, registro y recuperación no tienen sentido con la sesión abierta
export const invitadoGuard: CanActivateFn = () => {
  const foro = inject(ForoFacade);
  return foro.estaAutenticado() ? inject(Router).createUrlTree(['/']) : true;
};

// Revisa que el rol del usuario esté en data.roles de la ruta
export const rolGuard: CanActivateFn = (ruta, estado) => {
  const foro = inject(ForoFacade);
  const router = inject(Router);
  const roles = (ruta.data['roles'] ?? []) as Rol[];
  const rol = foro.rol();

  if (!rol) {
    inject(NotificacionService).mostrar('Inicia sesión para continuar.');
    return router.createUrlTree(['/login'], { queryParams: { volver: estado.url } });
  }
  return roles.includes(rol) ? true : router.createUrlTree(['/sin-permiso']);
};
