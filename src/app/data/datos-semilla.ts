import { Categoria, Comentario, Reporte, Tema, Usuario } from '../models';

// Mismos datos de prueba que la base Oracle del backend
export const USUARIOS_SEMILLA: Usuario[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@foro.cl',
    nombreCompleto: 'Administrador del Foro',
    password: 'Admin2026*',
    rol: 'ADMIN',
    activo: true,
    fechaRegistro: '2026-08-01T09:00:00',
  },
  {
    id: 2,
    username: 'moderador',
    email: 'moderador@foro.cl',
    nombreCompleto: 'Valentina Fuentes',
    password: 'Moderador2026*',
    rol: 'MODERADOR',
    activo: true,
    fechaRegistro: '2026-08-03T10:30:00',
  },
  {
    id: 3,
    username: 'camila.rojas',
    email: 'camila.rojas@foro.cl',
    nombreCompleto: 'Camila Rojas',
    password: 'Usuario2026*',
    rol: 'USUARIO',
    activo: true,
    fechaRegistro: '2026-08-15T18:12:00',
  },
  {
    id: 4,
    username: 'diego.soto',
    email: 'diego.soto@foro.cl',
    nombreCompleto: 'Diego Soto',
    password: 'Usuario2026*',
    rol: 'USUARIO',
    activo: true,
    fechaRegistro: '2026-08-20T21:45:00',
  },
];

export const CATEGORIAS_SEMILLA: Categoria[] = [
  {
    id: 1,
    nombre: 'Tecnología',
    descripcion: 'Programación, computadores, celulares y todo lo que tenga un chip.',
    icono: 'bi-cpu',
  },
  {
    id: 2,
    nombre: 'Videojuegos',
    descripcion: 'Recomendaciones, partidas y torneos entre compañeros.',
    icono: 'bi-controller',
  },
  {
    id: 3,
    nombre: 'Música',
    descripcion: 'Bandas, playlists, tocatas y gente para armar grupo.',
    icono: 'bi-music-note-beamed',
  },
  {
    id: 4,
    nombre: 'Cine y Series',
    descripcion: 'Estrenos, maratones y debates sin spoilers (o con aviso).',
    icono: 'bi-film',
  },
  {
    id: 5,
    nombre: 'Deportes',
    descripcion: 'Equipos de la sede, pichangas y actividad física.',
    icono: 'bi-trophy',
  },
  {
    id: 6,
    nombre: 'Vida Estudiantil',
    descripcion: 'Ramos, pruebas, becas y el día a día en la sede.',
    icono: 'bi-mortarboard',
  },
];

export const TEMAS_SEMILLA: Tema[] = [
  {
    id: 1,
    titulo: 'Bienvenidos a Tertulia',
    contenido:
      'Este es el espacio de conversación de la comunidad estudiantil. Aquí puedes abrir temas, comentar y conocer gente de otras carreras. Antes de publicar, revisa las normas de convivencia que dejó la moderación. ¡Que lo disfruten!',
    categoriaId: 6,
    autorId: 1,
    fechaCreacion: '2026-10-01T09:15:00',
    baneado: false,
  },
  {
    id: 2,
    titulo: 'Normas de convivencia del foro (léelas antes de publicar)',
    contenido:
      'Tres reglas simples: respeto ante todo, nada de spam ni ventas, y publica cada tema en la categoría que corresponde. Si ves algo que no cumple las normas, usa el botón "Reportar" y lo revisamos lo antes posible.',
    categoriaId: 6,
    autorId: 2,
    fechaCreacion: '2026-10-01T11:40:00',
    baneado: false,
  },
  {
    id: 3,
    titulo: '¿Qué notebook me recomiendan para programar con menos de 600 lucas?',
    contenido:
      'Estoy en segundo año y mi notebook ya no da más con Docker y el IDE abiertos al mismo tiempo. Busco algo con 16 GB de RAM y SSD, ojalá liviano porque lo ando trayendo todos los días a la sede. ¿Alguna recomendación o algo que deba evitar?',
    categoriaId: 1,
    autorId: 3,
    fechaCreacion: '2026-10-12T20:05:00',
    baneado: false,
  },
  {
    id: 4,
    titulo: 'Torneo de juegos de pelea en la sede este viernes',
    contenido:
      'Con unos compañeros estamos organizando un torneo en la sala de estudio del tercer piso, el viernes a las 18:00. Trae tu control si tienes uno. La inscripción es gratis y el premio es la eterna gloria (y un paquete de galletas).',
    categoriaId: 2,
    autorId: 4,
    fechaCreacion: '2026-10-20T13:30:00',
    baneado: false,
  },
  {
    id: 5,
    titulo: 'Playlist para estudiar en semana de pruebas',
    contenido:
      'Armé una lista con lo-fi, bandas sonoras de películas y algo de jazz suave. A mí me sirve harto para concentrarme sin distraerme con letras. ¿Qué escuchan ustedes cuando les toca estudiar? Dejen sus recomendaciones.',
    categoriaId: 3,
    autorId: 3,
    fechaCreacion: '2026-10-25T22:10:00',
    baneado: false,
  },
  {
    id: 6,
    titulo: '¿Conviene ver la serie completa antes de ir a ver la película?',
    contenido:
      'Me invitaron al cine el sábado a ver la película de una serie que nunca he visto. Son cuatro temporadas y no sé si alcanzo. ¿Se entiende igual sin haberla visto o me voy a perder la mitad de la historia?',
    categoriaId: 4,
    autorId: 4,
    fechaCreacion: '2026-11-02T17:45:00',
    baneado: false,
  },
  {
    id: 7,
    titulo: 'Buscamos gente para el equipo de vóleibol mixto',
    contenido:
      'Nos faltan dos personas para completar el equipo que va a representar a la sede en el campeonato interescuelas. Entrenamos martes y jueves a las 19:00 en el gimnasio. No necesitas experiencia, solo ganas y buena onda.',
    categoriaId: 5,
    autorId: 3,
    fechaCreacion: '2026-11-08T12:00:00',
    baneado: false,
  },
  {
    id: 8,
    titulo: 'Tips para sobrevivir a la semana de exámenes',
    contenido:
      'Les dejo lo que a mí me ha funcionado: hacer un calendario con todas las fechas, estudiar en bloques de 45 minutos con pausas cortas, dormir por lo menos siete horas y no dejar los trabajos grupales para la última noche. ¿Qué más agregarían?',
    categoriaId: 6,
    autorId: 4,
    fechaCreacion: '2026-11-15T19:20:00',
    baneado: false,
  },
];

export const COMENTARIOS_SEMILLA: Comentario[] = [
  { id: 1, temaId: 1, autorId: 3, contenido: '¡Por fin un foro para la sede! Gracias por armarlo.', fecha: '2026-10-01T10:02:00', baneado: false },
  { id: 2, temaId: 1, autorId: 4, contenido: 'Buena iniciativa, ya me estoy imaginando los temas de videojuegos.', fecha: '2026-10-01T12:30:00', baneado: false },
  { id: 3, temaId: 2, autorId: 3, contenido: 'Muy claras las normas, así da gusto participar.', fecha: '2026-10-02T08:50:00', baneado: false },
  { id: 4, temaId: 2, autorId: 1, contenido: 'Gracias, Valentina. Cualquier duda sobre las normas la pueden dejar en este tema.', fecha: '2026-10-02T09:15:00', baneado: false },
  { id: 5, temaId: 3, autorId: 4, contenido: 'Yo compré uno con Ryzen 5 y 16 GB el año pasado y me ha ido increíble. Revisa que la RAM se pueda ampliar.', fecha: '2026-10-12T21:00:00', baneado: false },
  { id: 6, temaId: 3, autorId: 2, contenido: 'Fíjate también en la batería: si pasas el día en la sede, que dure por lo menos seis horas.', fecha: '2026-10-13T09:20:00', baneado: false },
  { id: 7, temaId: 3, autorId: 4, contenido: 'Vendo apuntes de todos los ramos a luca, escríbanme al interno.', fecha: '2026-10-13T11:00:00', baneado: true, motivoBaneo: 'Spam: venta de productos, va contra las normas del foro.' },
  { id: 8, temaId: 4, autorId: 3, contenido: '¡Me anoto! Aunque probablemente pierda en la primera ronda.', fecha: '2026-10-20T14:10:00', baneado: false },
  { id: 9, temaId: 4, autorId: 2, contenido: 'Recuerden dejar la sala ordenada al terminar, que después la usan para estudiar.', fecha: '2026-10-20T16:05:00', baneado: false },
  { id: 10, temaId: 5, autorId: 4, contenido: 'Yo estudio con música de videojuegos antiguos, está hecha para no distraer.', fecha: '2026-10-26T10:00:00', baneado: false },
  { id: 11, temaId: 5, autorId: 1, contenido: 'Buena lista. Agregaría algo de música clásica para los ramos de matemáticas.', fecha: '2026-10-26T15:30:00', baneado: false },
  { id: 12, temaId: 6, autorId: 3, contenido: 'Yo la vi sin conocer la serie y se entiende, pero hay chistes internos que no vas a pillar.', fecha: '2026-11-02T18:20:00', baneado: false },
  { id: 13, temaId: 6, autorId: 2, contenido: 'Con ver los resúmenes de cada temporada quedas bien. Son como diez minutos cada uno.', fecha: '2026-11-03T08:40:00', baneado: false },
  { id: 14, temaId: 7, autorId: 4, contenido: '¿Pueden ir personas de primer año? Me interesa harto.', fecha: '2026-11-08T13:15:00', baneado: false },
  { id: 15, temaId: 7, autorId: 3, contenido: '¡Claro que sí! Pásate el martes y te presento al equipo.', fecha: '2026-11-08T14:00:00', baneado: false },
  { id: 16, temaId: 8, autorId: 3, contenido: 'Agregaría tomar agua y no abusar del café, que después no se duerme nada.', fecha: '2026-11-15T20:00:00', baneado: false },
  { id: 17, temaId: 8, autorId: 2, contenido: 'Y usar las tutorías de la biblioteca, que casi nadie las aprovecha.', fecha: '2026-11-16T09:10:00', baneado: false },
  { id: 18, temaId: 8, autorId: 1, contenido: 'Excelentes consejos, Diego. Dejo el tema destacado para la próxima semana.', fecha: '2026-11-16T11:25:00', baneado: false },
];

export const REPORTES_SEMILLA: Reporte[] = [
  {
    id: 1,
    tipo: 'COMENTARIO',
    contenidoId: 7,
    usuarioId: 3,
    motivo: 'Está vendiendo apuntes, eso es spam.',
    fecha: '2026-10-13T11:30:00',
    estado: 'RESUELTO',
  },
  {
    id: 2,
    tipo: 'COMENTARIO',
    contenidoId: 10,
    usuarioId: 3,
    motivo: 'Creo que se salió un poco del tema de la conversación.',
    fecha: '2026-10-27T12:00:00',
    estado: 'PENDIENTE',
  },
  {
    id: 3,
    tipo: 'TEMA',
    contenidoId: 4,
    usuarioId: 3,
    motivo: 'No sé si se pueden organizar eventos en la sede sin permiso.',
    fecha: '2026-10-21T10:00:00',
    estado: 'PENDIENTE',
  },
];
