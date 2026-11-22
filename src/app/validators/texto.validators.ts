import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const USERNAME_REGEX = /^[A-Za-z0-9._]+$/;
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const NOMBRE_REGEX = /^[\p{L}][\p{L} '.-]*$/u;

export function formatoUsername(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value ?? '';
  return !valor || USERNAME_REGEX.test(valor) ? null : { formatoUsername: true };
}

export function correoValido(control: AbstractControl): ValidationErrors | null {
  const valor: string = (control.value ?? '').trim();
  return !valor || CORREO_REGEX.test(valor) ? null : { correo: true };
}

export function nombreValido(control: AbstractControl): ValidationErrors | null {
  const valor: string = (control.value ?? '').trim();
  return !valor || NOMBRE_REGEX.test(valor) ? null : { nombre: true };
}

export function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value ?? '';
  return valor.length > 0 && valor.trim().length === 0 ? { soloEspacios: true } : null;
}

export function codigoVerificacion(control: AbstractControl): ValidationErrors | null {
  const valor: string = (control.value ?? '').trim();
  return !valor || /^\d{6}$/.test(valor) ? null : { codigo: true };
}

// Recibe una función que revisa si el valor ya está ocupado (usuario, correo, categoría...)
export function valorUnico(estaOcupado: (valor: string) => boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor: string = (control.value ?? '').trim();
    return valor && estaOcupado(valor) ? { duplicado: true } : null;
  };
}

// Largo medido sin contar los espacios de los extremos
export function largoTexto(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor: string = (control.value ?? '').trim();
    if (!valor) return null;
    if (valor.length < min) return { minlength: { requiredLength: min, actualLength: valor.length } };
    if (valor.length > max) return { maxlength: { requiredLength: max, actualLength: valor.length } };
    return null;
  };
}

export const VALIDADORES_USERNAME: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(30),
  formatoUsername,
];

export const VALIDADORES_CORREO: ValidatorFn[] = [
  Validators.required,
  Validators.maxLength(100),
  correoValido,
];

export const VALIDADORES_NOMBRE: ValidatorFn[] = [
  Validators.required,
  noSoloEspacios,
  largoTexto(3, 80),
  nombreValido,
];

export const VALIDADORES_TITULO: ValidatorFn[] = [Validators.required, noSoloEspacios, largoTexto(5, 150)];

export const VALIDADORES_CONTENIDO: ValidatorFn[] = [
  Validators.required,
  noSoloEspacios,
  largoTexto(10, 4000),
];

export const VALIDADORES_MOTIVO: ValidatorFn[] = [Validators.required, noSoloEspacios, largoTexto(5, 200)];
