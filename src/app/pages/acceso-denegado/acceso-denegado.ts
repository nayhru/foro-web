import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  imports: [RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 text-center py-5">
        <i class="bi bi-shield-lock display-1 icono"></i>
        <h1 class="h3 mt-3">No tienes acceso a esta sección</h1>
        <p class="texto-suave">Tu rol no tiene los privilegios necesarios para entrar aquí.</p>
        <a routerLink="/" class="btn btn-primary"><i class="bi bi-house me-1"></i>Volver a los temas</a>
      </div>
    </div>
  `,
  styles: `
    .icono {
      color: var(--lf-primario);
    }
  `,
})
export class AccesoDenegado {}
