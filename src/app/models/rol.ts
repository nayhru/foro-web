export type Rol = 'ADMIN' | 'MODERADOR' | 'USUARIO';

export type Privilegio =
  | 'PUBLICAR'
  | 'COMENTAR'
  | 'REPORTAR'
  | 'EDITAR_PERFIL'
  | 'ECHAR_LENA'
  | 'EDITAR_CUALQUIER_CONTENIDO'
  | 'MODERAR'
  | 'ADMINISTRAR';

const BASE: Privilegio[] = ['PUBLICAR', 'COMENTAR', 'REPORTAR', 'EDITAR_PERFIL', 'ECHAR_LENA'];

// Cada rol hereda lo del anterior y suma lo suyo
export const PRIVILEGIOS_POR_ROL: Record<Rol, Privilegio[]> = {
  USUARIO: BASE,
  MODERADOR: [...BASE, 'EDITAR_CUALQUIER_CONTENIDO', 'MODERAR'],
  ADMIN: [...BASE, 'EDITAR_CUALQUIER_CONTENIDO', 'MODERAR', 'ADMINISTRAR'],
};

export const ROLES: Rol[] = ['USUARIO', 'MODERADOR', 'ADMIN'];

export const NOMBRE_ROL: Record<Rol, string> = {
  USUARIO: 'Usuario',
  MODERADOR: 'Moderador',
  ADMIN: 'Administrador',
};
