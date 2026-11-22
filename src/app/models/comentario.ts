export interface Comentario {
  id: number;
  temaId: number;
  autorId: number;
  contenido: string;
  fecha: string;
  fechaEdicion?: string;
  baneado: boolean;
  motivoBaneo?: string;
}

export interface ComentarioVista extends Comentario {
  autor: string;
  autorUsername: string;
  temaTitulo: string;
}
