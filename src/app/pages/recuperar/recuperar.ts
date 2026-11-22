import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorCampo } from '../../components/error-campo/error-campo';
import { ReglasPassword } from '../../components/reglas-password/reglas-password';
import { ForoFacade } from '../../facades/foro.facade';
import { coincidenValidator } from '../../validators/grupo.validators';
import { campoInvalido } from '../../validators/mensajes-error';
import { VALIDADORES_PASSWORD } from '../../validators/password.validators';
import { VALIDADORES_CORREO, codigoVerificacion } from '../../validators/texto.validators';

type Paso = 'correo' | 'codigo' | 'listo';

@Component({
  selector: 'app-recuperar',
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo, ReglasPassword],
  templateUrl: './recuperar.html',
})
export class Recuperar {
  private readonly foro = inject(ForoFacade);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly invalido = campoInvalido;
  protected readonly paso = signal<Paso>('correo');
  protected readonly codigoSimulado = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly formCorreo = this.fb.group({
    email: ['', VALIDADORES_CORREO],
  });

  protected readonly formClave = this.fb.group(
    {
      codigo: ['', [Validators.required, codigoVerificacion]],
      password: ['', VALIDADORES_PASSWORD],
      confirmar: ['', Validators.required],
    },
    { validators: coincidenValidator('password', 'confirmar') },
  );

  get noCoinciden(): boolean {
    const confirmar = this.formClave.controls.confirmar;
    return this.formClave.hasError('noCoinciden') && (confirmar.dirty || confirmar.touched);
  }

  solicitarCodigo(): void {
    this.error.set(null);
    if (this.formCorreo.invalid) {
      this.formCorreo.markAllAsTouched();
      return;
    }
    const resultado = this.foro.solicitarCodigoRecuperacion(this.formCorreo.getRawValue().email);
    if (!resultado.ok || !resultado.dato) {
      this.error.set(resultado.mensaje);
      return;
    }
    this.codigoSimulado.set(resultado.dato);
    this.formClave.reset();
    this.paso.set('codigo');
  }

  cambiarClave(): void {
    this.error.set(null);
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }
    const { codigo, password } = this.formClave.getRawValue();
    const resultado = this.foro.restablecerPassword(
      this.formCorreo.getRawValue().email,
      codigo,
      password,
    );
    if (resultado.ok) {
      this.codigoSimulado.set(null);
      this.paso.set('listo');
    } else {
      this.error.set(resultado.mensaje);
    }
  }

  volverAlCorreo(): void {
    this.error.set(null);
    this.codigoSimulado.set(null);
    this.paso.set('correo');
  }
}
