import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ErrorCampo } from '../../components/error-campo/error-campo';
import { ReglasPassword } from '../../components/reglas-password/reglas-password';
import { ForoFacade } from '../../facades/foro.facade';
import { coincidenValidator } from '../../validators/grupo.validators';
import { campoInvalido } from '../../validators/mensajes-error';
import { VALIDADORES_PASSWORD } from '../../validators/password.validators';
import {
  VALIDADORES_CORREO,
  VALIDADORES_NOMBRE,
  VALIDADORES_USERNAME,
  valorUnico,
} from '../../validators/texto.validators';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo, ReglasPassword],
  templateUrl: './registro.html',
})
export class Registro {
  private readonly foro = inject(ForoFacade);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly invalido = campoInvalido;
  protected readonly verPassword = signal(false);

  protected readonly form = this.fb.group(
    {
      username: ['', [...VALIDADORES_USERNAME, valorUnico((v) => this.foro.existeUsername(v))]],
      nombreCompleto: ['', VALIDADORES_NOMBRE],
      email: ['', [...VALIDADORES_CORREO, valorUnico((v) => this.foro.existeEmail(v))]],
      password: ['', VALIDADORES_PASSWORD],
      confirmar: ['', Validators.required],
      aceptaNormas: [false, Validators.requiredTrue],
    },
    { validators: coincidenValidator('password', 'confirmar') },
  );

  get noCoinciden(): boolean {
    const confirmar = this.form.controls.confirmar;
    return this.form.hasError('noCoinciden') && (confirmar.dirty || confirmar.touched);
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, nombreCompleto, email, password } = this.form.getRawValue();
    const resultado = this.foro.registrar({ username, nombreCompleto, email, password });
    if (resultado.ok) this.router.navigate(['/']);
  }
}
