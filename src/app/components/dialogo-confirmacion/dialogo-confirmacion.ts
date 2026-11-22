import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialogo-confirmacion',
  template: `
    @if (abierto()) {
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title">{{ titulo() }}</h5>
              <button type="button" class="btn-close" aria-label="Cerrar" (click)="cancelar.emit()"></button>
            </div>
            <div class="modal-body texto-suave">{{ mensaje() }}</div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light" (click)="cancelar.emit()">Cancelar</button>
              <button
                type="button"
                class="btn"
                [class.btn-danger]="peligro()"
                [class.btn-primary]="!peligro()"
                (click)="confirmar.emit()"
              >
                {{ textoConfirmar() }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    }
  `,
})
export class DialogoConfirmacion {
  readonly abierto = input(false);
  readonly titulo = input('¿Confirmas esta acción?');
  readonly mensaje = input('');
  readonly textoConfirmar = input('Confirmar');
  readonly peligro = input(true);

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
}
