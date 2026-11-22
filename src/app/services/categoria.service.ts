import { Injectable } from '@angular/core';
import { CATEGORIAS_SEMILLA } from '../data/datos-semilla';
import { Categoria } from '../models';
import { RepositorioEnMemoria } from './repositorio-en-memoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService extends RepositorioEnMemoria<Categoria> {
  constructor() {
    super('categorias', CATEGORIAS_SEMILLA);
  }
}
