import { Component, input } from '@angular/core';
import { REGLAS_PASSWORD } from '../../validators/password.validators';

@Component({
  selector: 'app-reglas-password',
  template: `
    <ul class="list-unstyled small mb-0 mt-2 reglas">
      @for (regla of reglas; track regla.texto) {
        @let ok = regla.cumple(valor() ?? '');
        <li [class.ok]="ok">
          <i class="bi me-1" [class.bi-check-circle-fill]="ok" [class.bi-circle]="!ok"></i>{{ regla.texto }}
        </li>
      }
    </ul>
  `,
  styles: `
    .reglas li {
      color: var(--tt-texto-suave);
    }
    .reglas li.ok {
      color: #198754;
    }
  `,
})
export class ReglasPassword {
  readonly valor = input<string | null>('');
  protected readonly reglas = REGLAS_PASSWORD;
}
