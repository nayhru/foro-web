import { Injectable } from '@angular/core';
import { COMENTARIOS_SEMILLA } from '../data/datos-semilla';
import { Comentario } from '../models';
import { RepositorioEnMemoria } from './repositorio-en-memoria';

@Injectable({ providedIn: 'root' })
export class ComentarioService extends RepositorioEnMemoria<Comentario> {
  constructor() {
    super('comentarios', COMENTARIOS_SEMILLA);
  }

  eliminarDeTema(temaId: number): void {
    this.eliminarDonde((c) => c.temaId === temaId);
  }
}
