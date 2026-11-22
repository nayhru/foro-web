export interface Tema {
  id: number;
  titulo: string;
  contenido: string;
  categoriaId: number;
  autorId: number;
  fechaCreacion: string;
  fechaEdicion?: string;
  baneado: boolean;
  motivoBaneo?: string;
}

// Lo que muestran las vistas: el tema con los nombres ya resueltos
export interface TemaVista extends Tema {
  autor: string;
  autorUsername: string;
  categoria: string;
  categoriaIcono: string;
  totalComentarios: number;
}
