import { Component, inject } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-toasts',
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      @for (n of servicio.notificaciones(); track n.id) {
        <div
          class="toast show align-items-center border-0 text-white"
          [class.text-bg-success]="n.tipo === 'exito'"
          [class.text-bg-danger]="n.tipo === 'error'"
          [class.text-bg-dark]="n.tipo === 'info'"
          role="status"
          aria-live="polite"
        >
          <div class="d-flex">
            <div class="toast-body d-flex gap-2 align-items-start">
              <i
                class="bi"
                [class.bi-check-circle-fill]="n.tipo === 'exito'"
                [class.bi-exclamation-triangle-fill]="n.tipo === 'error'"
                [class.bi-info-circle-fill]="n.tipo === 'info'"
              ></i>
              <span>{{ n.mensaje }}</span>
            </div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              aria-label="Cerrar"
              (click)="servicio.cerrar(n.id)"
            ></button>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-container {
      z-index: 1100;
    }
  `,
})
export class Toasts {
  protected readonly servicio = inject(NotificacionService);
}
