import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PRIVILEGIOS_POR_ROL, Privilegio, Usuario } from '../models';
import { AlmacenamientoService } from './almacenamiento.service';
import { UsuarioService } from './usuario.service';

const CLAVE_SESION = 'sesion';

// Estado de la sesión con signals: los componentes que lo leen se actualizan solos
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly almacenamiento = inject(AlmacenamientoService);
  private readonly usuarios = toSignal(inject(UsuarioService).items$, { requireSync: true });
  private readonly idUsuario = signal<number | null>(this.almacenamiento.leer<number>(CLAVE_SESION));

  readonly usuarioActual = computed<Usuario | null>(() => {
    const id = this.idUsuario();
    return this.usuarios().find((u) => u.id === id && u.activo) ?? null;
  });

  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);
  readonly rol = computed(() => this.usuarioActual()?.rol ?? null);

  iniciar(usuario: Usuario): void {
    this.idUsuario.set(usuario.id);
    this.almacenamiento.guardar(CLAVE_SESION, usuario.id);
  }

  cerrar(): void {
    this.idUsuario.set(null);
    this.almacenamiento.borrar(CLAVE_SESION);
  }

  tienePrivilegio(privilegio: Privilegio): boolean {
    const rol = this.rol();
    return rol !== null && PRIVILEGIOS_POR_ROL[rol].includes(privilegio);
  }
}
