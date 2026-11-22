# La Fogata · FrontEnd

FrontEnd en Angular de **La Fogata**, el foro de la comunidad estudiantil: un lugar para juntarse a
conversar alrededor del fuego. Proyecto de la Sumativa 2 de Desarrollo Full Stack III (Duoc UC).

En esta evaluación el FrontEnd y el BackEnd funcionan por separado, así que la app **no consume
ninguna API**: toda la información vive en variables de Angular (arreglos en memoria) y se guarda
en `localStorage` para que no se pierda al recargar.

## Tecnologías

- Angular 21 (componentes standalone, signals, Reactive Forms, rutas con carga diferida)
- Bootstrap 5 y Bootstrap Icons (instalados con npm) más CSS propio con variables
- Vitest para las pruebas unitarias
- Docker con nginx para el despliegue

## Cómo ejecutar

Necesitas Node 20.19 o superior (probado con Node 24) y npm.

```bash
npm install
npm start          # abre http://localhost:4200
```

Otros comandos:

```bash
npm run build      # compila en dist/foro-web/browser
npm test           # pruebas unitarias
```

## Usuarios de prueba

| Usuario        | Correo                | Nombre                 | Rol       | Contraseña      |
| -------------- | --------------------- | ---------------------- | --------- | --------------- |
| `admin`        | admin@foro.cl         | Administrador del Foro | ADMIN     | `Admin2026*`    |
| `moderador`    | moderador@foro.cl     | Valentina Fuentes      | MODERADOR | `Moderador2026*`|
| `camila.rojas` | camila.rojas@foro.cl  | Camila Rojas           | USUARIO   | `Usuario2026*`  |
| `diego.soto`   | diego.soto@foro.cl    | Diego Soto             | USUARIO   | `Usuario2026*`  |

Puedes iniciar sesión con el nombre de usuario o con el correo. Estos cuatro usuarios son los
mismos de la base Oracle del backend. Además hay 12 estudiantes extra (rol USUARIO, misma clave
`Usuario2026*`) que existen solo en el front para que los temas tengan distintas cantidades de leña.

El botón **Restablecer datos de prueba** del pie de página vuelve todo a los datos iniciales.

## Funcionalidades

**Sin sesión**
- Lista de temas con búsqueda por texto y filtros por categoría y autor.
- Orden por **Recientes** o por **Más encendidos** (los que tienen más leña) y un ranking de los tres más encendidos.
- Detalle de cada tema con sus comentarios.
- Registro, inicio de sesión y recuperación de contraseña.

**USUARIO**
- Publicar temas y editar o eliminar los suyos.
- Comentar y editar o eliminar sus comentarios.
- Reportar un tema o un comentario de otra persona, indicando el motivo.
- **Echar leña**: es el "me gusta" del foro. Cada persona puede echarle leña una vez a cada tema y
  quitarla si se arrepiente. Según la leña, el tema sube de nivel y su llama crece:

  | Nivel    | Leña      |
  | -------- | --------- |
  | Brasa    | 0 a 2     |
  | Fogata   | 3 a 6     |
  | Hoguera  | 7 a 11    |
  | Incendio | 12 o más  |

  La llama tiene una animación suave que se desactiva si el sistema tiene activada la opción de
  reducir movimiento (`prefers-reduced-motion`).
- Perfil: editar nombre y correo, cambiar la contraseña (pide la actual) y ver sus temas y la leña
  total que recibieron.

**MODERADOR** (además de lo anterior)
- Editar o eliminar cualquier tema o comentario.
- Panel de moderación: reportes pendientes, banear temas o comentarios con un motivo, descartar
  reportes y quitar baneos. El contenido baneado no aparece en la vista pública.

**ADMIN** (además de lo anterior)
- Panel de administración: cambiar el rol de los usuarios, activar o desactivar cuentas y CRUD de
  categorías. Una categoría con temas no se puede eliminar.

### Recuperar contraseña (simulado)

Ingresas tu correo y, si existe, la app muestra en pantalla un código de 6 dígitos (en un sistema
real llegaría por correo). Con ese código defines una contraseña nueva que cumpla las mismas reglas.

### Validaciones

Todos los formularios usan Reactive Forms con mensajes de error por campo:

- **Contraseña:** entre 8 y 20 caracteres, al menos una mayúscula y una minúscula, un número, un
  carácter especial y sin espacios. Se muestra una lista de reglas que se marca en verde al cumplirlas.
- **Confirmar contraseña:** validador de grupo (`coincidenValidator`).
- **Nombre de usuario:** 3 a 30 caracteres; letras, números, punto o guion bajo. No se puede repetir.
- **Correo:** formato válido y no repetido.
- **Título:** 5 a 150 caracteres. **Contenido:** 10 a 4000 caracteres.
- Comentarios, motivos de reporte o baneo y categorías también tienen largo mínimo y máximo.

### Roles y guards

Los privilegios de cada rol están en `src/app/models/rol.ts` (`PRIVILEGIOS_POR_ROL`). El
`ForoFacade` los revisa antes de cualquier cambio, y las rutas se protegen con guards:

- `autenticadoGuard`: `/temas/nuevo`, `/temas/:id/editar`, `/perfil`
- `rolGuard` con `data.roles`: `/moderacion` (MODERADOR y ADMIN) y `/admin` (solo ADMIN)
- `invitadoGuard`: `/login`, `/registro` y `/recuperar` (si ya tienes sesión te manda al inicio)

## Páginas y rutas

| Ruta                 | Página                                |
| -------------------- | ------------------------------------- |
| `/`                  | Temas (búsqueda, filtros y orden)     |
| `/temas/:id`         | Detalle del tema y comentarios        |
| `/temas/nuevo`       | Publicar tema                         |
| `/temas/:id/editar`  | Editar tema                           |
| `/login`             | Inicio de sesión                      |
| `/registro`          | Registro de usuarios                  |
| `/recuperar`         | Recuperar contraseña                  |
| `/perfil`            | Modificación de perfil                |
| `/moderacion`        | Panel de moderación                   |
| `/admin`             | Panel de administración               |
| `/sin-permiso`       | Acceso denegado                       |
| `**`                 | Página no encontrada                  |

## Patrones de diseño

| Patrón    | Dónde                                                                                     |
| --------- | ----------------------------------------------------------------------------------------- |
| Singleton | Todos los servicios usan `@Injectable({ providedIn: 'root' })`, por lo que Angular crea una sola instancia para toda la app: `UsuarioService`, `TemaService`, `ComentarioService`, `CategoriaService`, `ReporteService`, `SesionService`, `NotificacionService`, `RecuperacionService` y `AlmacenamientoService` (carpeta `src/app/services`). |
| Facade    | `ForoFacade` en `src/app/facades/foro.facade.ts`. Las páginas solo usan esta clase; por dentro coordina los servicios, arma los datos para las vistas y revisa los permisos del rol. |
| Observer  | `RepositorioEnMemoria` (`src/app/services/repositorio-en-memoria.ts`) guarda cada lista en un `BehaviorSubject` y la expone como `items$`; el facade se suscribe con `toSignal`. La sesión (`SesionService`) y las notificaciones usan signals, así que la navbar y las vistas se actualizan solas cuando algo cambia. |

## Estructura de carpetas

```
src/app/
├── models/        interfaces y tipos (Usuario, Tema, Comentario, Reporte, roles, niveles de fuego)
├── data/          datos de prueba (los arreglos iniciales)
├── services/      servicios singleton con el estado de cada entidad
├── facades/       ForoFacade, la única puerta de entrada para las vistas
├── guards/        guards por sesión y por rol
├── validators/    validadores personalizados y mensajes de error
├── components/    piezas reutilizables (navbar, footer, logo, tarjeta de tema, botón de leña...)
└── pages/         una carpeta por página
```

La idea es parecida a MVC: los **modelos** están en `models/` y `data/`, la lógica en `services/`
y `facades/`, y las **vistas** son los componentes de `pages/` y `components/`.

## Diseño responsivo

Se usa la grilla de 12 columnas de Bootstrap con clases `col-12 col-md-* col-lg-*` en todas las
vistas, así que la app se adapta a celular, tablet y escritorio. La navbar se colapsa en un menú
en pantallas pequeñas. La paleta (brasa, ámbar, carbón y crema) está definida en variables CSS en
`src/styles.css`.

## Docker

La imagen se construye en dos etapas: primero compila con Node y después sirve los archivos
estáticos con `nginx:alpine` en el puerto 80. El archivo `nginx.conf` redirige cualquier ruta a
`index.html` para que funcionen las rutas de Angular al recargar.

```bash
docker build -t foro-web:1.0.0 .
docker run -d -p 8088:80 --name foro-web foro-web:1.0.0
# la app queda en http://localhost:8088
```

En AWS EC2 se puede correr el mismo contenedor y dejarlo detrás del Nginx del servidor.

## GitFlow

- `main`: versiones entregables (tag `v1.0.0`).
- `develop`: integración de las funcionalidades.
- `feature/*`: una rama por funcionalidad, mergeada a `develop` con `--no-ff`, por ejemplo
  (modelos y servicios, layout, autenticación, temas, perfil, moderación, administración,
  identidad de La Fogata, leña, Docker y documentación).
