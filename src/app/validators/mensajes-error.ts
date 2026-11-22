import { AbstractControl, ValidationErrors } from '@angular/forms';

type Mensaje = string | ((detalle: { requiredLength?: number }) => string);

const MENSAJES: Record<string, Mensaje> = {
  required: 'Este campo es obligatorio.',
  requiredTrue: 'Debes aceptar para continuar.',
  minlength: (e) => `Debe tener al menos ${e.requiredLength} caracteres.`,
  maxlength: (e) => `No puede superar los ${e.requiredLength} caracteres.`,
  correo: 'Ingresa un correo válido, por ejemplo nombre@dominio.cl.',
  formatoUsername: 'Solo se permiten letras, números, punto (.) y guion bajo (_), sin espacios.',
  nombre: 'El nombre solo puede tener letras y espacios.',
  mayusculaMinuscula: 'Debe incluir al menos una letra mayúscula y una minúscula.',
  numero: 'Debe incluir al menos un número.',
  especial: 'Debe incluir al menos un carácter especial, por ejemplo * ! # $.',
  espacios: 'No puede contener espacios.',
  soloEspacios: 'No puede contener solo espacios en blanco.',
  codigo: 'El código tiene 6 dígitos numéricos.',
  duplicado: 'Este valor ya está en uso.',
};

export function primerMensaje(
  errores: ValidationErrors | null,
  personalizados: Record<string, string> = {},
): string | null {
  if (!errores) return null;
  const clave = Object.keys(errores)[0];
  if (personalizados[clave]) return personalizados[clave];
  const mensaje = MENSAJES[clave];
  if (!mensaje) return 'El valor ingresado no es válido.';
  return typeof mensaje === 'string' ? mensaje : mensaje(errores[clave]);
}

export function campoInvalido(control: AbstractControl): boolean {
  return control.invalid && (control.dirty || control.touched);
}
