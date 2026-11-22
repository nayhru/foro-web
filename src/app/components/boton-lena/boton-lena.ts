import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ForoFacade } from '../../facades/foro.facade';
import { TemaVista } from '../../models';

@Component({
  selector: 'app-boton-lena',
  imports: [RouterLink],
  template: `
    @let t = tema();
    @if (foro.puede('ECHAR_LENA')) {
      <button
        type="button"
        class="btn btn-sm boton-lena"
        [class.btn-primary]="echada()"
        [class.btn-outline-primary]="!echada()"
        [attr.aria-pressed]="echada()"
        [title]="echada() ? 'Quitar mi leña' : 'Echarle leña a este tema'"
        (click)="foro.echarLena(t.id)"
      >
        <i class="bi bi-fire me-1" aria-hidden="true"></i>{{ echada() ? 'Leña echada' : 'Echar leña' }}
        <span class="contador">{{ t.totalLena }}</span>
      </button>
    } @else {
      <a
        class="btn btn-sm btn-outline-primary boton-lena"
        routerLink="/login"
        [queryParams]="{ volver: '/temas/' + t.id }"
        title="Inicia sesión para echar leña"
      >
        <i class="bi bi-fire me-1" aria-hidden="true"></i>Echar leña
        <span class="contador">{{ t.totalLena }}</span>
      </a>
    }
  `,
  styles: `
    .boton-lena {
      position: relative;
      z-index: 2;
      border-radius: 999px;
      white-space: nowrap;
    }
    .contador {
      display: inline-block;
      margin-left: 0.35rem;
      padding-left: 0.4rem;
      border-left: 1px solid currentColor;
      font-weight: 800;
    }
  `,
})
export class BotonLena {
  protected readonly foro = inject(ForoFacade);
  readonly tema = input.required<TemaVista>();
  protected readonly echada = computed(() => this.foro.echeLena(this.tema()));
}
