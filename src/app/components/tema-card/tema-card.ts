import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemaVista } from '../../models';
import { Avatar } from '../avatar/avatar';
import { BotonLena } from '../boton-lena/boton-lena';
import { NivelFuegoBadge } from '../nivel-fuego/nivel-fuego';

@Component({
  selector: 'app-tema-card',
  imports: [RouterLink, DatePipe, Avatar, BotonLena, NivelFuegoBadge],
  template: `
    @let t = tema();
    <article class="tarjeta tarjeta-hover h-100 d-flex flex-column p-3 p-md-4">
      <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
        <span class="etiqueta-categoria"><i class="bi {{ t.categoriaIcono }}"></i>{{ t.categoria }}</span>
        <app-nivel-fuego [nivel]="t.nivel" />
      </div>

      <h2 class="h5 mb-2">
        <a [routerLink]="['/temas', t.id]" class="stretched-link titulo">{{ t.titulo }}</a>
      </h2>
      <p class="texto-suave extracto mb-3">{{ t.contenido }}</p>

      <div class="d-flex align-items-center gap-2 mt-auto small mb-3">
        <app-avatar [nombre]="t.autor" [tamano]="28" />
        <span class="fw-bold text-truncate">{{ t.autor }}</span>
        <small class="ms-auto texto-suave text-nowrap">{{ t.fechaCreacion | date: 'd MMM y' }}</small>
      </div>

      <div class="d-flex align-items-center gap-2 pt-3 border-top">
        <app-boton-lena [tema]="t" />
        <span class="ms-auto texto-suave small text-nowrap" [title]="t.totalComentarios + ' comentarios'">
          <i class="bi bi-chat-left-text me-1"></i>{{ t.totalComentarios }}
        </span>
      </div>
    </article>
  `,
  styles: `
    .titulo {
      color: var(--lf-texto);
    }
    .titulo:hover {
      color: var(--lf-primario);
    }
    .extracto {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    article {
      position: relative;
    }
  `,
})
export class TemaCard {
  readonly tema = input.required<TemaVista>();
}
