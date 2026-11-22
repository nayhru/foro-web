import { Injectable } from '@angular/core';
import { USUARIOS_SEMILLA } from '../data/datos-semilla';
import { Usuario } from '../models';
import { RepositorioEnMemoria } from './repositorio-en-memoria';

@Injectable({ providedIn: 'root' })
export class UsuarioService extends RepositorioEnMemoria<Usuario> {
  constructor() {
    super('usuarios', USUARIOS_SEMILLA);
  }

  buscarPorUsername(username: string): Usuario | undefined {
    const buscado = username.trim().toLowerCase();
    return this.items.find((u) => u.username.toLowerCase() === buscado);
  }

  buscarPorEmail(email: string): Usuario | undefined {
    const buscado = email.trim().toLowerCase();
    return this.items.find((u) => u.email.toLowerCase() === buscado);
  }
}
