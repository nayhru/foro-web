import { DatePipe, SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DialogoMotivo } from '../../components/dialogo-motivo/dialogo-motivo';
import { EstadoVacio } from '../../components/estado-vacio/estado-vacio';
import { ForoFacade } from '../../facades/foro.facade';
import { TipoContenido } from '../../models';

type Pestana = 'reportes' | 'temas' | 'comentarios' | 'baneados';

interface Baneo {
  tipo: TipoContenido;
  id: number;
  motivoInicial: string;
}

@Component({
  selector: 'app-moderacion',
  imports: [RouterLink, DatePipe, SlicePipe, DialogoMotivo, EstadoVacio],
  templateUrl: './moderacion.html',
})
export class Moderacion {
  protected readonly foro = inject(ForoFacade);

  protected readonly pestana = signal<Pestana>('reportes');
  protected readonly porBanear = signal<Baneo | null>(null);

  banear(tipo: TipoContenido, id: number, motivoInicial = ''): void {
    this.porBanear.set({ tipo, id, motivoInicial });
  }

  confirmarBaneo(motivo: string): void {
    const baneo = this.porBanear();
    if (baneo) this.foro.banear(baneo.tipo, baneo.id, motivo);
    this.porBanear.set(null);
  }

  quitarBaneo(tipo: TipoContenido, id: number): void {
    this.foro.quitarBaneo(tipo, id);
  }

  descartar(reporteId: number): void {
    this.foro.descartarReporte(reporteId);
  }
}
