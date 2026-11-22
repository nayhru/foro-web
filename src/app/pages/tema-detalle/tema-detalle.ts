import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Avatar } from '../../components/avatar/avatar';
import { BotonLena } from '../../components/boton-lena/boton-lena';
import { DialogoConfirmacion } from '../../components/dialogo-confirmacion/dialogo-confirmacion';
import { DialogoMotivo } from '../../components/dialogo-motivo/dialogo-motivo';
import { ErrorCampo } from '../../components/error-campo/error-campo';
import { EstadoVacio } from '../../components/estado-vacio/estado-vacio';
import { NivelFuegoBadge } from '../../components/nivel-fuego/nivel-fuego';
import { ForoFacade } from '../../facades/foro.facade';
import { ComentarioVista, NOMBRE_ROL, TipoContenido } from '../../models';
import { campoInvalido } from '../../validators/mensajes-error';
import { largoTexto, noSoloEspacios } from '../../validators/texto.validators';

interface AccionPendiente {
  tipo: TipoContenido;
  id: number;
}

const validadoresComentario = [Validators.required, noSoloEspacios, largoTexto(3, 1000)];

@Component({
  selector: 'app-tema-detalle',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    Avatar,
    ErrorCampo,
    EstadoVacio,
    DialogoConfirmacion,
    DialogoMotivo,
    BotonLena,
    NivelFuegoBadge,
  ],
  templateUrl: './tema-detalle.html',
  styleUrl: './tema-detalle.css',
})
export class TemaDetalle {
  protected readonly foro = inject(ForoFacade);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly invalido = campoInvalido;
  protected readonly nombreRol = NOMBRE_ROL;

  protected readonly tema = computed(() => this.foro.temaPorId(Number(this.id())));
  protected readonly comentarios = computed(() => {
    const tema = this.tema();
    return tema ? this.foro.comentariosDeTema(tema.id) : [];
  });
  protected readonly autor = computed(() =>
    this.foro.usuarios().find((u) => u.id === this.tema()?.autorId),
  );
  protected readonly relacionados = computed(() => {
    const tema = this.tema();
    if (!tema) return [];
    return this.foro
      .filtrarTemas({ texto: '', categoriaId: tema.categoriaId, autorId: null })
      .filter((t) => t.id !== tema.id)
      .slice(0, 4);
  });

  protected readonly nuevoComentario = new FormGroup({
    contenido: new FormControl('', { nonNullable: true, validators: validadoresComentario }),
  });
  protected readonly edicion = new FormGroup({
    contenido: new FormControl('', { nonNullable: true, validators: validadoresComentario }),
  });
  protected readonly editandoId = signal<number | null>(null);

  protected readonly porEliminar = signal<AccionPendiente | null>(null);
  protected readonly porReportar = signal<AccionPendiente | null>(null);
  protected readonly porBanear = signal<AccionPendiente | null>(null);

  comentar(): void {
    const tema = this.tema();
    if (!tema) return;
    if (this.nuevoComentario.invalid) {
      this.nuevoComentario.markAllAsTouched();
      return;
    }
    const resultado = this.foro.comentar(tema.id, this.nuevoComentario.getRawValue().contenido);
    if (resultado.ok) this.nuevoComentario.reset();
  }

  empezarEdicion(comentario: ComentarioVista): void {
    this.editandoId.set(comentario.id);
    this.edicion.reset({ contenido: comentario.contenido });
  }

  guardarEdicion(): void {
    const id = this.editandoId();
    if (id === null) return;
    if (this.edicion.invalid) {
      this.edicion.markAllAsTouched();
      return;
    }
    const resultado = this.foro.editarComentario(id, this.edicion.getRawValue().contenido);
    if (resultado.ok) this.editandoId.set(null);
  }

  confirmarEliminacion(): void {
    const accion = this.porEliminar();
    if (!accion) return;
    this.porEliminar.set(null);
    if (accion.tipo === 'TEMA') {
      if (this.foro.eliminarTema(accion.id).ok) this.router.navigate(['/']);
    } else {
      this.foro.eliminarComentario(accion.id);
    }
  }

  enviarReporte(motivo: string): void {
    const accion = this.porReportar();
    if (accion) this.foro.reportar(accion.tipo, accion.id, motivo);
    this.porReportar.set(null);
  }

  enviarBaneo(motivo: string): void {
    const accion = this.porBanear();
    if (!accion) return;
    this.foro.banear(accion.tipo, accion.id, motivo);
    this.porBanear.set(null);
  }

  quitarBaneo(tipo: TipoContenido, id: number): void {
    this.foro.quitarBaneo(tipo, id);
  }
}
