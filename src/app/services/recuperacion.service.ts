import { Injectable } from '@angular/core';

interface SolicitudRecuperacion {
  email: string;
  codigo: string;
  expira: number;
}

const MINUTOS_VIGENCIA = 10;

// Simula el envío del código de recuperación; en un sistema real llegaría por correo
@Injectable({ providedIn: 'root' })
export class RecuperacionService {
  private solicitud: SolicitudRecuperacion | null = null;

  generarCodigo(email: string): string {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    this.solicitud = {
      email: email.trim().toLowerCase(),
      codigo,
      expira: Date.now() + MINUTOS_VIGENCIA * 60 * 1000,
    };
    return codigo;
  }

  validarCodigo(email: string, codigo: string): boolean {
    const s = this.solicitud;
    return (
      s !== null &&
      s.email === email.trim().toLowerCase() &&
      s.codigo === codigo.trim() &&
      Date.now() < s.expira
    );
  }

  limpiar(): void {
    this.solicitud = null;
  }
}
