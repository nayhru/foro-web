import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { campoInvalido, primerMensaje } from '../../validators/mensajes-error';

@Component({
  selector: 'app-error-campo',
  template: `
    @if (mensaje(); as texto) {
      <div class="invalid-feedback d-block"><i class="bi bi-exclamation-circle me-1"></i>{{ texto }}</div>
    }
  `,
})
export class ErrorCampo {
  readonly control = input.required<AbstractControl>();
  readonly mensajes = input<Record<string, string>>({});

  mensaje(): string | null {
    const control = this.control();
    return campoInvalido(control) ? primerMensaje(control.errors, this.mensajes()) : null;
  }
}
