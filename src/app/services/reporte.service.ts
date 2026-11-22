import { Injectable } from '@angular/core';
import { REPORTES_SEMILLA } from '../data/datos-semilla';
import { Reporte, TipoContenido } from '../models';
import { RepositorioEnMemoria } from './repositorio-en-memoria';

@Injectable({ providedIn: 'root' })
export class ReporteService extends RepositorioEnMemoria<Reporte> {
  constructor() {
    super('reportes', REPORTES_SEMILLA);
  }

  resolverPendientesDe(tipo: TipoContenido, contenidoId: number): void {
    this.items
      .filter((r) => r.tipo === tipo && r.contenidoId === contenidoId && r.estado === 'PENDIENTE')
      .forEach((r) => this.actualizar(r.id, { estado: 'RESUELTO' }));
  }

  eliminarDe(tipo: TipoContenido, contenidoIds: number[]): void {
    this.eliminarDonde((r) => r.tipo === tipo && contenidoIds.includes(r.contenidoId));
  }
}
