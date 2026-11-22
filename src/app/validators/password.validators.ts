import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 20;

const texto = (control: AbstractControl): string => control.value ?? '';

export function mayusculaYMinuscula(control: AbstractControl): ValidationErrors | null {
  const valor = texto(control);
  if (!valor) return null;
  return /\p{Lu}/u.test(valor) && /\p{Ll}/u.test(valor) ? null : { mayusculaMinuscula: true };
}

export function tieneNumero(control: AbstractControl): ValidationErrors | null {
  const valor = texto(control);
  if (!valor) return null;
  return /\d/.test(valor) ? null : { numero: true };
}

export function tieneCaracterEspecial(control: AbstractControl): ValidationErrors | null {
  const valor = texto(control);
  if (!valor) return null;
  return /[^\p{L}\p{N}\s]/u.test(valor) ? null : { especial: true };
}

export function sinEspacios(control: AbstractControl): ValidationErrors | null {
  return /\s/.test(texto(control)) ? { espacios: true } : null;
}

// Las mismas reglas para registro, recuperación y cambio de contraseña
export const VALIDADORES_PASSWORD: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(PASSWORD_MIN),
  Validators.maxLength(PASSWORD_MAX),
  mayusculaYMinuscula,
  tieneNumero,
  tieneCaracterEspecial,
  sinEspacios,
];

export interface ReglaPassword {
  texto: string;
  cumple: (valor: string) => boolean;
}

export const REGLAS_PASSWORD: ReglaPassword[] = [
  {
    texto: `Entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres`,
    cumple: (v) => v.length >= PASSWORD_MIN && v.length <= PASSWORD_MAX,
  },
  { texto: 'Una letra mayúscula y una minúscula', cumple: (v) => /\p{Lu}/u.test(v) && /\p{Ll}/u.test(v) },
  { texto: 'Al menos un número', cumple: (v) => /\d/.test(v) },
  { texto: 'Al menos un carácter especial (* ! # $ ...)', cumple: (v) => /[^\p{L}\p{N}\s]/u.test(v) },
  { texto: 'Sin espacios', cumple: (v) => v.length > 0 && !/\s/.test(v) },
];
