import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ForoFacade } from '../../facades/foro.facade';
import { DialogoConfirmacion } from '../dialogo-confirmacion/dialogo-confirmacion';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Logo, DialogoConfirmacion],
  template: `
    <footer class="pie mt-5">
      <div class="container py-4">
        <div class="row g-3 align-items-center">
          <div class="col-12 col-md-6 col-lg-4 text-center text-md-start">
            <app-logo [tamano]="28" />
            <p class="small texto-suave mb-0 mt-1">El foro de la comunidad estudiantil.</p>
          </div>
          <div class="col-12 col-md-6 col-lg-4 text-center small">
            <a routerLink="/" class="me-3">Temas</a>
            <a routerLink="/registro" class="me-3">Crear cuenta</a>
            <a routerLink="/recuperar">¿Olvidaste tu contraseña?</a>
          </div>
          <div class="col-12 col-lg-4 text-center text-lg-end">
            <button type="button" class="btn btn-sm btn-outline-secondary" (click)="confirmando.set(true)">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Restablecer datos de prueba
            </button>
          </div>
        </div>
        <p class="text-center small texto-suave mb-0 mt-3">
          Tertulia {{ anio }} · Desarrollo Full Stack III
        </p>
      </div>
    </footer>

    <app-dialogo-confirmacion
      [abierto]="confirmando()"
      titulo="Restablecer datos de prueba"
      mensaje="Se borrarán los temas, comentarios y usuarios que hayas creado, y todo volverá a los datos iniciales."
      textoConfirmar="Sí, restablecer"
      (confirmar)="restablecer()"
      (cancelar)="confirmando.set(false)"
    />
  `,
  styles: `
    .pie {
      background: var(--tt-superficie);
      border-top: 1px solid var(--tt-borde);
    }
  `,
})
export class Footer {
  private readonly foro = inject(ForoFacade);
  protected readonly confirmando = signal(false);
  protected readonly anio = new Date().getFullYear();

  restablecer(): void {
    this.foro.restablecerDatos();
    this.confirmando.set(false);
  }
}
