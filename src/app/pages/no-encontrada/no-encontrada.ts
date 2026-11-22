import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 text-center py-5">
        <div class="display-1 fw-bold codigo">404</div>
        <h1 class="h3">No encontramos esta página</h1>
        <p class="texto-suave">Puede que el enlace esté mal escrito o que el contenido ya no exista.</p>
        <a routerLink="/" class="btn btn-primary"><i class="bi bi-house me-1"></i>Volver a los temas</a>
      </div>
    </div>
  `,
  styles: `
    .codigo {
      color: var(--lf-primario);
    }
  `,
})
export class NoEncontrada {}
