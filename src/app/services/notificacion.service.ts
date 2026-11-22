import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error' | 'info';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private contador = 0;
  private readonly lista = signal<Notificacion[]>([]);
  readonly notificaciones = this.lista.asReadonly();

  mostrar(mensaje: string, tipo: TipoNotificacion = 'info'): void {
    const id = ++this.contador;
    this.lista.update((actuales) => [...actuales, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), 4500);
  }

  exito(mensaje: string): void {
    this.mostrar(mensaje, 'exito');
  }

  error(mensaje: string): void {
    this.mostrar(mensaje, 'error');
  }

  cerrar(id: number): void {
    this.lista.update((actuales) => actuales.filter((n) => n.id !== id));
  }
}
