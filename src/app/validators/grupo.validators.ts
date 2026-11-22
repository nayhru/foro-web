import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador de grupo: la confirmación tiene que ser igual a la contraseña
export function coincidenValidator(campo: string, confirmacion: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const valor = grupo.get(campo)?.value;
    const repetido = grupo.get(confirmacion)?.value;
    if (!valor || !repetido) return null;
    return valor === repetido ? null : { noCoinciden: true };
  };
}

// Validador de grupo: la clave nueva no puede ser igual a la actual
export function distintasValidator(actual: string, nueva: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(actual)?.value;
    const n = grupo.get(nueva)?.value;
    if (!a || !n) return null;
    return a === n ? { igualAActual: true } : null;
  };
}
