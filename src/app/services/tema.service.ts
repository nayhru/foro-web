import { Injectable } from '@angular/core';
import { TEMAS_SEMILLA } from '../data/datos-semilla';
import { Tema } from '../models';
import { RepositorioEnMemoria } from './repositorio-en-memoria';

@Injectable({ providedIn: 'root' })
export class TemaService extends RepositorioEnMemoria<Tema> {
  constructor() {
    super('temas', TEMAS_SEMILLA);
  }

  // Echa o quita la leña del usuario; devuelve true si quedó echada
  alternarLena(temaId: number, usuarioId: number): boolean {
    const tema = this.buscarPorId(temaId);
    if (!tema) return false;
    const actual = tema.lena ?? [];
    const yaEcho = actual.includes(usuarioId);
    this.actualizar(temaId, {
      lena: yaEcho ? actual.filter((id) => id !== usuarioId) : [...actual, usuarioId],
    });
    return !yaEcho;
  }
}
