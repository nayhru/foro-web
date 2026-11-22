import { nivelDeFuego } from './fuego';

describe('Niveles de fuego según la leña', () => {
  it('calcula el nivel en cada tramo', () => {
    expect(nivelDeFuego(0).codigo).toBe('BRASA');
    expect(nivelDeFuego(2).codigo).toBe('BRASA');
    expect(nivelDeFuego(3).codigo).toBe('FOGATA');
    expect(nivelDeFuego(6).codigo).toBe('FOGATA');
    expect(nivelDeFuego(7).codigo).toBe('HOGUERA');
    expect(nivelDeFuego(11).codigo).toBe('HOGUERA');
    expect(nivelDeFuego(12).codigo).toBe('INCENDIO');
    expect(nivelDeFuego(40).codigo).toBe('INCENDIO');
  });
});
