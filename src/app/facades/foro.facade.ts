import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Categoria,
  Comentario,
  ComentarioVista,
  NOMBRE_ROL,
  Privilegio,
  ReporteVista,
  Resultado,
  Rol,
  Tema,
  TemaVista,
  TipoContenido,
  Usuario,
} from '../models';
import { CategoriaService } from '../services/categoria.service';
import { ComentarioService } from '../services/comentario.service';
import { NotificacionService } from '../services/notificacion.service';
import { RecuperacionService } from '../services/recuperacion.service';
import { ReporteService } from '../services/reporte.service';
import { SesionService } from '../services/sesion.service';
import { TemaService } from '../services/tema.service';
import { UsuarioService } from '../services/usuario.service';

export interface FiltroTemas {
  texto: string;
  categoriaId: number | null;
  autorId: number | null;
}

export interface DatosRegistro {
  username: string;
  email: string;
  nombreCompleto: string;
  password: string;
}

export interface DatosTema {
  titulo: string;
  contenido: string;
  categoriaId: number;
}

export interface DatosCategoria {
  nombre: string;
  descripcion: string;
  icono: string;
}

// Patrón Facade: las páginas solo hablan con esta clase y no con cada servicio por separado.
// Aquí también se revisan los privilegios del rol antes de modificar cualquier dato.
@Injectable({ providedIn: 'root' })
export class ForoFacade {
  private readonly usuarioService = inject(UsuarioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly temaService = inject(TemaService);
  private readonly comentarioService = inject(ComentarioService);
  private readonly reporteService = inject(ReporteService);
  private readonly recuperacion = inject(RecuperacionService);
  private readonly sesion = inject(SesionService);
  private readonly notificaciones = inject(NotificacionService);

  private readonly listaUsuarios = toSignal(this.usuarioService.items$, { requireSync: true });
  private readonly listaCategorias = toSignal(this.categoriaService.items$, { requireSync: true });
  private readonly listaTemas = toSignal(this.temaService.items$, { requireSync: true });
  private readonly listaComentarios = toSignal(this.comentarioService.items$, { requireSync: true });
  private readonly listaReportes = toSignal(this.reporteService.items$, { requireSync: true });

  private readonly vistasComentarios = computed<ComentarioVista[]>(() =>
    this.listaComentarios().map((c) => {
      const autor = this.usuario(c.autorId);
      return {
        ...c,
        autor: autor?.nombreCompleto ?? 'Usuario eliminado',
        autorUsername: autor?.username ?? '',
        temaTitulo: this.listaTemas().find((t) => t.id === c.temaId)?.titulo ?? '',
      };
    }),
  );

  // ---- Sesión ----
  readonly usuarioActual = this.sesion.usuarioActual;
  readonly estaAutenticado = this.sesion.estaAutenticado;
  readonly rol = this.sesion.rol;

  // ---- Datos para las vistas ----
  readonly usuarios = computed(() =>
    [...this.listaUsuarios()].sort((a, b) => a.username.localeCompare(b.username)),
  );

  readonly categorias = computed(() =>
    [...this.listaCategorias()].sort((a, b) => a.nombre.localeCompare(b.nombre)),
  );

  readonly todosLosTemas = computed<TemaVista[]>(() =>
    this.listaTemas()
      .map((t) => this.aVistaTema(t))
      .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion)),
  );

  readonly temasPublicos = computed(() => this.todosLosTemas().filter((t) => !t.baneado));
  readonly temasBaneados = computed(() => this.todosLosTemas().filter((t) => t.baneado));

  readonly comentariosPublicos = computed(() =>
    this.vistasComentarios().filter((c) => !c.baneado && this.temaVisible(c.temaId)),
  );
  readonly comentariosBaneados = computed(() => this.vistasComentarios().filter((c) => c.baneado));

  readonly autores = computed(() => {
    const ids = new Set(this.temasPublicos().map((t) => t.autorId));
    return this.usuarios().filter((u) => ids.has(u.id));
  });

  readonly reportesPendientes = computed<ReporteVista[]>(() =>
    this.listaReportes()
      .filter((r) => r.estado === 'PENDIENTE')
      .map((r) => {
        const usuario = this.usuario(r.usuarioId);
        const tema = r.tipo === 'TEMA' ? this.temaService.buscarPorId(r.contenidoId) : undefined;
        const comentario =
          r.tipo === 'COMENTARIO' ? this.comentarioService.buscarPorId(r.contenidoId) : undefined;
        return {
          ...r,
          reportadoPor: usuario?.username ?? 'desconocido',
          resumen: tema?.titulo ?? comentario?.contenido ?? '(contenido eliminado)',
          temaId: tema?.id ?? comentario?.temaId ?? 0,
        };
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha)),
  );

  readonly estadisticas = computed(() => ({
    usuarios: this.listaUsuarios().length,
    temas: this.temasPublicos().length,
    comentarios: this.comentariosPublicos().length,
    reportes: this.reportesPendientes().length,
  }));

  // ---- Permisos ----
  puede(privilegio: Privilegio): boolean {
    return this.sesion.tienePrivilegio(privilegio);
  }

  esPropio(autorId: number): boolean {
    return this.usuarioActual()?.id === autorId;
  }

  puedeGestionar(autorId: number): boolean {
    return this.esPropio(autorId) || this.puede('EDITAR_CUALQUIER_CONTENIDO');
  }

  puedeReportar(autorId: number): boolean {
    return this.puede('REPORTAR') && !this.esPropio(autorId);
  }

  // ---- Consultas ----
  filtrarTemas(filtro: FiltroTemas): TemaVista[] {
    const texto = this.normalizar(filtro.texto);
    return this.temasPublicos().filter(
      (t) =>
        (!texto || this.normalizar(`${t.titulo} ${t.contenido}`).includes(texto)) &&
        (filtro.categoriaId === null || t.categoriaId === filtro.categoriaId) &&
        (filtro.autorId === null || t.autorId === filtro.autorId),
    );
  }

  temaPorId(id: number): TemaVista | undefined {
    const tema = this.todosLosTemas().find((t) => t.id === id);
    if (tema?.baneado && !this.puede('MODERAR')) return undefined;
    return tema;
  }

  comentariosDeTema(temaId: number): ComentarioVista[] {
    const verBaneados = this.puede('MODERAR');
    return this.vistasComentarios()
      .filter((c) => c.temaId === temaId && (verBaneados || !c.baneado))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  temasDe(usuarioId: number): TemaVista[] {
    return this.todosLosTemas().filter((t) => t.autorId === usuarioId && !t.baneado);
  }

  totalComentariosDe(usuarioId: number): number {
    return this.listaComentarios().filter((c) => c.autorId === usuarioId && !c.baneado).length;
  }

  temasEnCategoria(categoriaId: number): number {
    return this.listaTemas().filter((t) => t.categoriaId === categoriaId).length;
  }

  existeUsername(username: string, excluirId?: number): boolean {
    const u = this.usuarioService.buscarPorUsername(username);
    return !!u && u.id !== excluirId;
  }

  existeEmail(email: string, excluirId?: number): boolean {
    const u = this.usuarioService.buscarPorEmail(email);
    return !!u && u.id !== excluirId;
  }

  existeCategoria(nombre: string, excluirId?: number): boolean {
    const buscado = this.normalizar(nombre);
    return this.listaCategorias().some(
      (c) => this.normalizar(c.nombre) === buscado && c.id !== excluirId,
    );
  }

  // ---- Autenticación ----
  iniciarSesion(identificador: string, password: string): Resultado<Usuario> {
    const usuario = identificador.includes('@')
      ? this.usuarioService.buscarPorEmail(identificador)
      : this.usuarioService.buscarPorUsername(identificador);

    if (!usuario || usuario.password !== password) {
      return this.error('Usuario o contraseña incorrectos.');
    }
    if (!usuario.activo) {
      return this.error('Tu cuenta está desactivada. Contacta a un administrador.');
    }
    this.sesion.iniciar(usuario);
    return this.exito(`¡Hola de nuevo, ${usuario.nombreCompleto.split(' ')[0]}!`, usuario);
  }

  cerrarSesion(): void {
    this.sesion.cerrar();
    this.notificaciones.mostrar('Cerraste tu sesión. ¡Vuelve pronto!');
  }

  registrar(datos: DatosRegistro): Resultado<Usuario> {
    if (this.existeUsername(datos.username)) return this.error('Ese nombre de usuario ya existe.');
    if (this.existeEmail(datos.email)) return this.error('Ese correo ya está registrado.');

    const usuario = this.usuarioService.agregar({
      username: datos.username.trim(),
      email: datos.email.trim().toLowerCase(),
      nombreCompleto: datos.nombreCompleto.trim(),
      password: datos.password,
      rol: 'USUARIO',
      activo: true,
      fechaRegistro: new Date().toISOString(),
    });
    this.sesion.iniciar(usuario);
    return this.exito('¡Tu cuenta quedó creada! Ya puedes participar en el foro.', usuario);
  }

  solicitarCodigoRecuperacion(email: string): Resultado<string> {
    const usuario = this.usuarioService.buscarPorEmail(email);
    if (!usuario) return this.error('No encontramos una cuenta asociada a ese correo.');
    if (!usuario.activo) return this.error('Esa cuenta está desactivada.');
    const codigo = this.recuperacion.generarCodigo(email);
    return { ok: true, mensaje: 'Código generado.', dato: codigo };
  }

  restablecerPassword(email: string, codigo: string, nueva: string): Resultado {
    const usuario = this.usuarioService.buscarPorEmail(email);
    if (!usuario || !this.recuperacion.validarCodigo(email, codigo)) {
      return this.error('El código no es válido o ya expiró.');
    }
    this.usuarioService.actualizar(usuario.id, { password: nueva });
    this.recuperacion.limpiar();
    return this.exito('Tu contraseña se actualizó. Ya puedes iniciar sesión.');
  }

  // ---- Perfil ----
  actualizarPerfil(datos: { nombreCompleto: string; email: string }): Resultado {
    const yo = this.usuarioActual();
    if (!yo || !this.puede('EDITAR_PERFIL')) return this.sinPermiso();
    if (this.existeEmail(datos.email, yo.id)) return this.error('Ese correo ya está registrado.');

    this.usuarioService.actualizar(yo.id, {
      nombreCompleto: datos.nombreCompleto.trim(),
      email: datos.email.trim().toLowerCase(),
    });
    return this.exito('Tus datos se guardaron correctamente.');
  }

  cambiarPassword(actual: string, nueva: string): Resultado {
    const yo = this.usuarioActual();
    if (!yo) return this.sinPermiso();
    if (yo.password !== actual) return this.error('La contraseña actual no es correcta.');

    this.usuarioService.actualizar(yo.id, { password: nueva });
    return this.exito('Tu contraseña se cambió correctamente.');
  }

  // ---- Temas ----
  crearTema(datos: DatosTema): Resultado<Tema> {
    const yo = this.usuarioActual();
    if (!yo || !this.puede('PUBLICAR')) return this.sinPermiso();

    const tema = this.temaService.agregar({
      titulo: datos.titulo.trim(),
      contenido: datos.contenido.trim(),
      categoriaId: datos.categoriaId,
      autorId: yo.id,
      fechaCreacion: new Date().toISOString(),
      baneado: false,
    });
    return this.exito('Tu tema ya está publicado.', tema);
  }

  editarTema(id: number, datos: DatosTema): Resultado {
    const tema = this.temaService.buscarPorId(id);
    if (!tema) return this.error('El tema no existe.');
    if (!this.puedeGestionar(tema.autorId)) return this.sinPermiso();

    this.temaService.actualizar(id, {
      titulo: datos.titulo.trim(),
      contenido: datos.contenido.trim(),
      categoriaId: datos.categoriaId,
      fechaEdicion: new Date().toISOString(),
    });
    return this.exito('Los cambios del tema se guardaron.');
  }

  eliminarTema(id: number): Resultado {
    const tema = this.temaService.buscarPorId(id);
    if (!tema) return this.error('El tema no existe.');
    if (!this.puedeGestionar(tema.autorId)) return this.sinPermiso();

    const idsComentarios = this.listaComentarios()
      .filter((c) => c.temaId === id)
      .map((c) => c.id);
    this.reporteService.eliminarDe('COMENTARIO', idsComentarios);
    this.reporteService.eliminarDe('TEMA', [id]);
    this.comentarioService.eliminarDeTema(id);
    this.temaService.eliminar(id);
    return this.exito('El tema se eliminó.');
  }

  // ---- Comentarios ----
  comentar(temaId: number, contenido: string): Resultado<Comentario> {
    const yo = this.usuarioActual();
    if (!yo || !this.puede('COMENTAR')) return this.sinPermiso();
    if (!this.temaVisible(temaId)) return this.error('No puedes comentar en este tema.');

    const comentario = this.comentarioService.agregar({
      temaId,
      autorId: yo.id,
      contenido: contenido.trim(),
      fecha: new Date().toISOString(),
      baneado: false,
    });
    return this.exito('Tu comentario se publicó.', comentario);
  }

  editarComentario(id: number, contenido: string): Resultado {
    const comentario = this.comentarioService.buscarPorId(id);
    if (!comentario) return this.error('El comentario no existe.');
    if (!this.puedeGestionar(comentario.autorId)) return this.sinPermiso();

    this.comentarioService.actualizar(id, {
      contenido: contenido.trim(),
      fechaEdicion: new Date().toISOString(),
    });
    return this.exito('El comentario se actualizó.');
  }

  eliminarComentario(id: number): Resultado {
    const comentario = this.comentarioService.buscarPorId(id);
    if (!comentario) return this.error('El comentario no existe.');
    if (!this.puedeGestionar(comentario.autorId)) return this.sinPermiso();

    this.reporteService.eliminarDe('COMENTARIO', [id]);
    this.comentarioService.eliminar(id);
    return this.exito('El comentario se eliminó.');
  }

  // ---- Reportes y moderación ----
  reportar(tipo: TipoContenido, contenidoId: number, motivo: string): Resultado {
    const yo = this.usuarioActual();
    const autorId = this.autorDe(tipo, contenidoId);
    if (!yo || autorId === undefined || !this.puedeReportar(autorId)) return this.sinPermiso();

    const repetido = this.listaReportes().some(
      (r) =>
        r.tipo === tipo &&
        r.contenidoId === contenidoId &&
        r.usuarioId === yo.id &&
        r.estado === 'PENDIENTE',
    );
    if (repetido) return this.error('Ya reportaste este contenido; la moderación lo está revisando.');

    this.reporteService.agregar({
      tipo,
      contenidoId,
      usuarioId: yo.id,
      motivo: motivo.trim(),
      fecha: new Date().toISOString(),
      estado: 'PENDIENTE',
    });
    return this.exito('Gracias por avisar. La moderación revisará tu reporte.');
  }

  banear(tipo: TipoContenido, contenidoId: number, motivo: string): Resultado {
    if (!this.puede('MODERAR')) return this.sinPermiso();
    const cambios = { baneado: true, motivoBaneo: motivo.trim() };
    const ok =
      tipo === 'TEMA'
        ? this.temaService.actualizar(contenidoId, cambios)
        : this.comentarioService.actualizar(contenidoId, cambios);
    if (!ok) return this.error('El contenido ya no existe.');

    this.reporteService.resolverPendientesDe(tipo, contenidoId);
    return this.exito(tipo === 'TEMA' ? 'El tema quedó baneado.' : 'El comentario quedó baneado.');
  }

  quitarBaneo(tipo: TipoContenido, contenidoId: number): Resultado {
    if (!this.puede('MODERAR')) return this.sinPermiso();
    const cambios = { baneado: false, motivoBaneo: undefined };
    if (tipo === 'TEMA') this.temaService.actualizar(contenidoId, cambios);
    else this.comentarioService.actualizar(contenidoId, cambios);
    return this.exito('Se quitó el baneo; el contenido vuelve a ser visible.');
  }

  descartarReporte(id: number): Resultado {
    if (!this.puede('MODERAR')) return this.sinPermiso();
    this.reporteService.actualizar(id, { estado: 'DESCARTADO' });
    return this.exito('Reporte descartado.');
  }

  // ---- Administración ----
  cambiarRol(usuarioId: number, rol: Rol): Resultado {
    if (!this.puede('ADMINISTRAR')) return this.sinPermiso();
    if (this.esPropio(usuarioId)) return this.error('No puedes cambiar tu propio rol.');

    const usuario = this.usuarioService.actualizar(usuarioId, { rol });
    return usuario
      ? this.exito(`${usuario.username} ahora tiene el rol ${NOMBRE_ROL[rol]}.`)
      : this.error('El usuario no existe.');
  }

  cambiarEstado(usuarioId: number, activo: boolean): Resultado {
    if (!this.puede('ADMINISTRAR')) return this.sinPermiso();
    if (this.esPropio(usuarioId)) return this.error('No puedes desactivar tu propia cuenta.');

    const usuario = this.usuarioService.actualizar(usuarioId, { activo });
    if (!usuario) return this.error('El usuario no existe.');
    return this.exito(`La cuenta de ${usuario.username} quedó ${activo ? 'activa' : 'desactivada'}.`);
  }

  crearCategoria(datos: DatosCategoria): Resultado<Categoria> {
    if (!this.puede('ADMINISTRAR')) return this.sinPermiso();
    if (this.existeCategoria(datos.nombre)) return this.error('Ya existe una categoría con ese nombre.');

    const categoria = this.categoriaService.agregar({
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      icono: datos.icono,
    });
    return this.exito(`Se creó la categoría ${categoria.nombre}.`, categoria);
  }

  editarCategoria(id: number, datos: DatosCategoria): Resultado {
    if (!this.puede('ADMINISTRAR')) return this.sinPermiso();
    if (this.existeCategoria(datos.nombre, id)) return this.error('Ya existe una categoría con ese nombre.');

    this.categoriaService.actualizar(id, {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      icono: datos.icono,
    });
    return this.exito('La categoría se actualizó.');
  }

  eliminarCategoria(id: number): Resultado {
    if (!this.puede('ADMINISTRAR')) return this.sinPermiso();
    const total = this.temasEnCategoria(id);
    if (total > 0) {
      return this.error(`No se puede eliminar: la categoría tiene ${total} tema(s) asociados.`);
    }
    this.categoriaService.eliminar(id);
    return this.exito('La categoría se eliminó.');
  }

  restablecerDatos(): void {
    this.usuarioService.restablecer();
    this.categoriaService.restablecer();
    this.temaService.restablecer();
    this.comentarioService.restablecer();
    this.reporteService.restablecer();
    this.notificaciones.exito('Se restablecieron los datos de prueba.');
  }

  // ---- Apoyo interno ----
  private aVistaTema(tema: Tema): TemaVista {
    const autor = this.usuario(tema.autorId);
    const categoria = this.listaCategorias().find((c) => c.id === tema.categoriaId);
    return {
      ...tema,
      autor: autor?.nombreCompleto ?? 'Usuario eliminado',
      autorUsername: autor?.username ?? '',
      categoria: categoria?.nombre ?? 'Sin categoría',
      categoriaIcono: categoria?.icono ?? 'bi-chat-square-text',
      totalComentarios: this.listaComentarios().filter((c) => c.temaId === tema.id && !c.baneado)
        .length,
    };
  }

  private usuario(id: number): Usuario | undefined {
    return this.listaUsuarios().find((u) => u.id === id);
  }

  private temaVisible(temaId: number): boolean {
    const tema = this.listaTemas().find((t) => t.id === temaId);
    return !!tema && !tema.baneado;
  }

  private autorDe(tipo: TipoContenido, id: number): number | undefined {
    return tipo === 'TEMA'
      ? this.temaService.buscarPorId(id)?.autorId
      : this.comentarioService.buscarPorId(id)?.autorId;
  }

  private normalizar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
  }

  private exito<T>(mensaje: string, dato?: T): Resultado<T> {
    this.notificaciones.exito(mensaje);
    return { ok: true, mensaje, dato };
  }

  private error<T>(mensaje: string): Resultado<T> {
    this.notificaciones.error(mensaje);
    return { ok: false, mensaje };
  }

  private sinPermiso<T>(): Resultado<T> {
    return this.error('No tienes permiso para realizar esta acción.');
  }
}
