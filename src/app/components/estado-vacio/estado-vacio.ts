import { Component, input } from '@angular/core';

@Component({
  selector: 'app-estado-vacio',
  template: `
    <div class="vacio text-center">
      <i class="bi {{ icono() }}"></i>
      <h3 class="h5 mt-3 mb-1">{{ titulo() }}</h3>
      @if (mensaje()) {
        <p class="texto-suave mb-3">{{ mensaje() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .vacio {
      padding: 3rem 1.5rem;
      border: 2px dashed var(--tt-borde);
      border-radius: var(--tt-radio);
      background: var(--tt-superficie);
    }
    .vacio > i {
      font-size: 2.6rem;
      color: var(--tt-acento);
    }
  `,
})
export class EstadoVacio {
  readonly icono = input('bi-chat-square-dots');
  readonly titulo = input.required<string>();
  readonly mensaje = input('');
}
