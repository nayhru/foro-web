import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ErrorCampo } from '../../components/error-campo/error-campo';
import { Logo } from '../../components/logo/logo';
import { ForoFacade } from '../../facades/foro.facade';
import { campoInvalido } from '../../validators/mensajes-error';
import { noSoloEspacios } from '../../validators/texto.validators';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo, Logo],
  templateUrl: './login.html',
})
export class Login {
  private readonly foro = inject(ForoFacade);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  // viene en la URL cuando un guard manda a iniciar sesión
  readonly volver = input<string>();

  protected readonly invalido = campoInvalido;
  protected readonly verPassword = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    identificador: ['', [Validators.required, noSoloEspacios, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.maxLength(20)]],
  });

  enviar(): void {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { identificador, password } = this.form.getRawValue();
    const resultado = this.foro.iniciarSesion(identificador.trim(), password);
    if (resultado.ok) {
      this.router.navigateByUrl(this.volver() || '/');
    } else {
      this.error.set(resultado.mensaje);
    }
  }
}
