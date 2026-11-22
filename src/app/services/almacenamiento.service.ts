import { Injectable } from '@angular/core';

const PREFIJO = 'lafogata.';

// Envuelve localStorage; si el navegador lo bloquea, la app sigue funcionando solo en memoria
@Injectable({ providedIn: 'root' })
export class AlmacenamientoService {
  leer<T>(clave: string): T | null {
    try {
      const texto = localStorage.getItem(PREFIJO + clave);
      return texto ? (JSON.parse(texto) as T) : null;
    } catch {
      return null;
    }
  }

  guardar<T>(clave: string, valor: T): void {
    try {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    } catch {
      // sin almacenamiento disponible
    }
  }

  borrar(clave: string): void {
    try {
      localStorage.removeItem(PREFIJO + clave);
    } catch {
      // sin almacenamiento disponible
    }
  }
}
