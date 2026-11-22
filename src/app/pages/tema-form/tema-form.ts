import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ErrorCampo } from '../../components/error-campo/error-campo';
import { ForoFacade } from '../../facades/foro.facade';
import { campoInvalido } from '../../validators/mensajes-error';
import { VALIDADORES_CONTENIDO, VALIDADORES_TITULO } from '../../validators/texto.validators';

@Component({
  selector: 'app-tema-form',
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo],
  templateUrl: './tema-form.html',
})
export class TemaForm implements OnInit {
  protected readonly foro = inject(ForoFacade);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  // solo viene cuando la ruta es /temas/:id/editar
  readonly id = input<string>();

  protected readonly invalido = campoInvalido;
  protected readonly editando = signal(false);

  protected readonly form = this.fb.group({
    titulo: ['', VALIDADORES_TITULO],
    categoriaId: this.fb.control<number | null>(null, Validators.required),
    contenido: ['', VALIDADORES_CONTENIDO],
  });

  ngOnInit(): void {
    if (!this.id()) return;

    const tema = this.foro.temaPorId(Number(this.id()));
    if (!tema || !this.foro.puedeGestionar(tema.autorId)) {
      this.router.navigate(['/sin-permiso']);
      return;
    }
    this.editando.set(true);
    this.form.setValue({
      titulo: tema.titulo,
      categoriaId: tema.categoriaId,
      contenido: tema.contenido,
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valores = this.form.getRawValue();
    const datos = { ...valores, categoriaId: valores.categoriaId as number };

    if (this.editando()) {
      const id = Number(this.id());
      if (this.foro.editarTema(id, datos).ok) this.router.navigate(['/temas', id]);
    } else {
      const resultado = this.foro.crearTema(datos);
      if (resultado.ok && resultado.dato) this.router.navigate(['/temas', resultado.dato.id]);
    }
  }

  cancelar(): void {
    this.router.navigate(this.editando() ? ['/temas', this.id()] : ['/']);
  }
}
