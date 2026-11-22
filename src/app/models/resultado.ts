export interface Resultado<T = void> {
  ok: boolean;
  mensaje: string;
  dato?: T;
}
