export type TipoContenido = 'TEMA' | 'COMENTARIO';
export type EstadoReporte = 'PENDIENTE' | 'RESUELTO' | 'DESCARTADO';

export interface Reporte {
  id: number;
  tipo: TipoContenido;
  contenidoId: number;
  usuarioId: number;
  motivo: string;
  fecha: string;
  estado: EstadoReporte;
}

export interface ReporteVista extends Reporte {
  reportadoPor: string;
  resumen: string;
  temaId: number;
}
