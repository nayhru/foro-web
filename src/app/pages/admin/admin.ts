import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avatar } from '../../components/avatar/avatar';
import { DialogoConfirmacion } from '../../components/dialogo-confirmacion/dialogo-confirmacion';
import { ErrorCampo } from '../../components/error-campo/error-campo';
import { EstadoVacio } from '../../components/estado-vacio/estado-vacio';
import { ForoFacade } from '../../facades/foro.facade';
import { Categoria, NOMBRE_ROL, Rol, ROLES } from '../../models';
import { campoInvalido } from '../../validators/mensajes-error';
import { largoTexto, noSoloEspacios, valorUnico } from '../../validators/texto.validators';

type Pestana = 'usuarios' | 'categorias';

const ICONOS = [
  'bi-chat-square-text',
  'bi-cpu',
  'bi-controller',
  'bi-music-note-beamed',
  'bi-film',
  'bi-trophy',
  'bi-mortarboard',
  'bi-book',
  'bi-palette',
  'bi-globe-americas',
  'bi-briefcase',
  'bi-heart-pulse',
];

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, DatePipe, Avatar, ErrorCampo, EstadoVacio, DialogoConfirmacion],
  templateUrl: './admin.html',
})
export class Admin {
  protected readonly foro = inject(ForoFacade);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly invalido = campoInvalido;
  protected readonly roles = ROLES;
  protected readonly nombreRol = NOMBRE_ROL;
  protected readonly iconos = ICONOS;

  protected readonly pestana = signal<Pestana>('usuarios');
  protected readonly editandoId = signal<number | null>(null);
  protected readonly porEliminar = signal<Categoria | null>(null);

  protected readonly form = this.fb.group({
    nombre: [
      '',
      [
        Validators.required,
        noSoloEspacios,
        largoTexto(3, 40),
        valorUnico((v) => this.foro.existeCategoria(v, this.editandoId() ?? undefined)),
      ],
    ],
    descripcion: ['', [Validators.required, noSoloEspacios, largoTexto(10, 200)]],
    icono: [ICONOS[0], Validators.required],
  });

  totalPorRol(rol: Rol): number {
    return this.foro.usuarios().filter((u) => u.rol === rol).length;
  }

  cambiarRol(usuarioId: number, evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    const resultado = this.foro.cambiarRol(usuarioId, select.value as Rol);
    if (!resultado.ok) {
      select.value = this.foro.usuarios().find((u) => u.id === usuarioId)?.rol ?? select.value;
    }
  }

  cambiarEstado(usuarioId: number, evento: Event): void {
    const check = evento.target as HTMLInputElement;
    if (!this.foro.cambiarEstado(usuarioId, check.checked).ok) check.checked = !check.checked;
  }

  editar(categoria: Categoria): void {
    this.editandoId.set(categoria.id);
    this.form.reset({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      icono: categoria.icono,
    });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.form.reset();
  }

  guardarCategoria(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const datos = this.form.getRawValue();
    const id = this.editandoId();
    const resultado = id === null ? this.foro.crearCategoria(datos) : this.foro.editarCategoria(id, datos);
    if (resultado.ok) this.cancelarEdicion();
  }

  confirmarEliminacion(): void {
    const categoria = this.porEliminar();
    if (categoria) {
      this.foro.eliminarCategoria(categoria.id);
      if (this.editandoId() === categoria.id) this.cancelarEdicion();
    }
    this.porEliminar.set(null);
  }
}
