import { Rol } from './rol';

export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombreCompleto: string;
  password: string;
  rol: Rol;
  activo: boolean;
  fechaRegistro: string;
}
