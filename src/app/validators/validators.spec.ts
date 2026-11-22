import { FormControl, FormGroup } from '@angular/forms';
import { coincidenValidator } from './grupo.validators';
import { VALIDADORES_PASSWORD } from './password.validators';
import { VALIDADORES_CORREO, VALIDADORES_USERNAME } from './texto.validators';

const errores = (valor: string, validadores = VALIDADORES_PASSWORD) =>
  Object.keys(new FormControl(valor, validadores).errors ?? {});

describe('Validadores de contraseña', () => {
  it('acepta una contraseña que cumple todas las reglas', () => {
    expect(errores('Fogata2026*')).toEqual([]);
  });

  it('exige largo entre 8 y 20', () => {
    expect(errores('Ab1*')).toContain('minlength');
    expect(errores('Abcdefghij1234567890*')).toContain('maxlength');
  });

  it('exige mayúscula, minúscula, número y carácter especial', () => {
    expect(errores('fogata2026*')).toContain('mayusculaMinuscula');
    expect(errores('Fogata****')).toContain('numero');
    expect(errores('Fogata2026')).toContain('especial');
  });

  it('detecta cuando la confirmación no coincide', () => {
    const grupo = new FormGroup(
      { password: new FormControl('Fogata2026*'), confirmar: new FormControl('Otra2026*') },
      { validators: coincidenValidator('password', 'confirmar') },
    );
    expect(grupo.hasError('noCoinciden')).toBe(true);
    grupo.controls.confirmar.setValue('Fogata2026*');
    expect(grupo.hasError('noCoinciden')).toBe(false);
  });
});

describe('Validadores de texto', () => {
  it('valida el formato del nombre de usuario', () => {
    expect(errores('camila.rojas', VALIDADORES_USERNAME)).toEqual([]);
    expect(errores('ca', VALIDADORES_USERNAME)).toContain('minlength');
    expect(errores('camila rojas', VALIDADORES_USERNAME)).toContain('formatoUsername');
  });

  it('valida el correo', () => {
    expect(errores('camila.rojas@foro.cl', VALIDADORES_CORREO)).toEqual([]);
    expect(errores('camila@foro', VALIDADORES_CORREO)).toContain('correo');
  });
});
