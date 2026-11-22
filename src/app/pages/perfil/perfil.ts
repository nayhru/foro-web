import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Avatar } from '../../components/avatar/avatar';
import { ErrorCampo } from '../../components/error-campo/error-campo';
import { EstadoVacio } from '../../components/estado-vacio/estado-vacio';
import { ReglasPassword } from '../../components/reglas-password/reglas-password';
import { ForoFacade } from '../../facades/foro.facade';
import { NOMBRE_ROL, Privilegio, PRIVILEGIOS_POR_ROL } from '../../models';
import { coincidenValidator, distintasValidator } from '../../validators/grupo.validators';
import { campoInvalido } from '../../validators/mensajes-error';
import { VALIDADORES_PASSWORD } from '../../validators/password.validators';
import { VALIDADORES_CORREO, VALIDADORES_NOMBRE, valorUnico } from '../../validators/texto.validators';

const DESCRIPCION_PRIVILEGIO: Record<Privilegio, string> = {
  PUBLICAR: 'Publicar temas',
  COMENTAR: 'Comentar en los temas',
  REPORTAR: 'Reportar contenido',
  EDITAR_PERFIL: 'Editar tu perfil',
  ECHAR_LENA: 'Echarle leña a los temas que te gustan',
  EDITAR_CUALQUIER_CONTENIDO: 'Editar o eliminar contenido de otras personas',
  MODERAR: 'Banear contenido y revisar reportes',
  ADMINISTRAR: 'Gestionar usuarios y categorías',
};

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, Avatar, ErrorCampo, EstadoVacio, ReglasPassword],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  protected readonly foro = inject(ForoFacade);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly invalido = campoInvalido;
  protected readonly nombreRol = NOMBRE_ROL;

  protected readonly usuario = this.foro.usuarioActual;
  protected readonly misTemas = computed(() => {
    const u = this.usuario();
    return u ? this.foro.temasDe(u.id) : [];
  });
  protected readonly privilegios = computed(() => {
    const rol = this.foro.rol();
    return rol ? PRIVILEGIOS_POR_ROL[rol].map((p) => DESCRIPCION_PRIVILEGIO[p]) : [];
  });

  protected readonly datos = this.fb.group({
    nombreCompleto: ['', VALIDADORES_NOMBRE],
    email: [
      '',
      [...VALIDADORES_CORREO, valorUnico((v) => this.foro.existeEmail(v, this.usuario()?.id))],
    ],
  });

  protected readonly clave = this.fb.group(
    {
      actual: ['', Validators.required],
      nueva: ['', VALIDADORES_PASSWORD],
      confirmar: ['', Validators.required],
    },
    {
      validators: [coincidenValidator('nueva', 'confirmar'), distintasValidator('actual', 'nueva')],
    },
  );

  ngOnInit(): void {
    this.cargarDatos();
  }

  get noCoinciden(): boolean {
    const c = this.clave.controls.confirmar;
    return this.clave.hasError('noCoinciden') && (c.dirty || c.touched);
  }

  get igualAActual(): boolean {
    const n = this.clave.controls.nueva;
    return this.clave.hasError('igualAActual') && (n.dirty || n.touched);
  }

  guardarDatos(): void {
    if (this.datos.invalid) {
      this.datos.markAllAsTouched();
      return;
    }
    if (this.foro.actualizarPerfil(this.datos.getRawValue()).ok) this.cargarDatos();
  }

  cambiarClave(): void {
    if (this.clave.invalid) {
      this.clave.markAllAsTouched();
      return;
    }
    const { actual, nueva } = this.clave.getRawValue();
    if (this.foro.cambiarPassword(actual, nueva).ok) this.clave.reset();
  }

  cargarDatos(): void {
    const u = this.usuario();
    if (u) this.datos.reset({ nombreCompleto: u.nombreCompleto, email: u.email });
  }
}
