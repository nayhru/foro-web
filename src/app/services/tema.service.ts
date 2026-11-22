import { Injectable } from '@angular/core';
import { TEMAS_SEMILLA } from '../data/datos-semilla';
import { Tema } from '../models';
import { RepositorioEnMemoria } from './repositorio-en-memoria';

@Injectable({ providedIn: 'root' })
export class TemaService extends RepositorioEnMemoria<Tema> {
  constructor() {
    super('temas', TEMAS_SEMILLA);
  }
}
