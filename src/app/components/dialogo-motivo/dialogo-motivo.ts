import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { campoInvalido } from '../../validators/mensajes-error';
import { VALIDADORES_MOTIVO } from '../../validators/texto.validators';
import { ErrorCampo } from '../error-campo/error-campo';

// Se usa para reportar contenido y para banearlo; en ambos casos se pide un motivo
@Component({
  selector: 'app-dialogo-motivo',
  imports: [ReactiveFormsModule, ErrorCampo],
  template: `
    @if (abierto()) {
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-dialog modal-dialog-centered">
          <form class="modal-content border-0 shadow" [formGroup]="form" (ngSubmit)="enviar()" novalidate>
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title">{{ titulo() }}</h5>
              <button type="button" class="btn-close" aria-label="Cerrar" (click)="cancelar.emit()"></button>
            </div>
            <div class="modal-body">
              <p class="texto-suave small">{{ descripcion() }}</p>
              <div class="d-flex flex-wrap gap-2 mb-3">
                @for (sugerencia of sugerencias; track sugerencia) {
                  <button type="button" class="btn btn-sm btn-light border" (click)="motivo.setValue(sugerencia)">
                    {{ sugerencia }}
                  </button>
                }
              </div>
              <label for="motivo" class="form-label">Motivo</label>
              <textarea
                id="motivo"
                rows="3"
                class="form-control"
                [formControl]="motivo"
                [class.is-invalid]="invalido(motivo)"
              ></textarea>
              <div class="d-flex justify-content-between">
                <app-error-campo [control]="motivo" />
                <span class="contador-caracteres ms-auto">{{ motivo.value.length }}/200</span>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light" (click)="cancelar.emit()">Cancelar</button>
              <button type="submit" class="btn" [class.btn-danger]="peligro()" [class.btn-primary]="!peligro()">
                {{ textoConfirmar() }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    }
  `,
})
export class DialogoMotivo {
  readonly abierto = input(false);
  readonly titulo = input('Indica el motivo');
  readonly descripcion = input('');
  readonly textoConfirmar = input('Enviar');
  readonly peligro = input(false);
  readonly motivoInicial = input('');

  readonly confirmar = output<string>();
  readonly cancelar = output<void>();

  protected readonly invalido = campoInvalido;
  protected readonly sugerencias = [
    'Spam o publicidad',
    'Lenguaje ofensivo',
    'Fuera de tema',
    'Información falsa',
  ];
  protected readonly motivo = new FormControl('', { nonNullable: true, validators: VALIDADORES_MOTIVO });
  protected readonly form = new FormGroup({ motivo: this.motivo });

  constructor() {
    effect(() => {
      if (this.abierto()) this.motivo.reset(this.motivoInicial());
    });
  }

  enviar(): void {
    if (this.motivo.invalid) {
      this.motivo.markAsTouched();
      return;
    }
    this.confirmar.emit(this.motivo.value.trim());
  }
}
