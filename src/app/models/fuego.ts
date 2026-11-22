export type CodigoNivel = 'BRASA' | 'FOGATA' | 'HOGUERA' | 'INCENDIO';

export interface NivelFuego {
  codigo: CodigoNivel;
  nombre: string;
  minimo: number;
  descripcion: string;
}

// Mientras más leña, más grande la llama
export const NIVELES_FUEGO: NivelFuego[] = [
  { codigo: 'BRASA', nombre: 'Brasa', minimo: 0, descripcion: 'Recién empieza a prender' },
  { codigo: 'FOGATA', nombre: 'Fogata', minimo: 3, descripcion: 'Ya hay gente conversando' },
  { codigo: 'HOGUERA', nombre: 'Hoguera', minimo: 7, descripcion: 'Un tema que está encendido' },
  { codigo: 'INCENDIO', nombre: 'Incendio', minimo: 12, descripcion: '¡Se volvió viral!' },
];

export function nivelDeFuego(totalLena: number): NivelFuego {
  return [...NIVELES_FUEGO].reverse().find((n) => totalLena >= n.minimo) ?? NIVELES_FUEGO[0];
}
