import { inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlmacenamientoService } from './almacenamiento.service';

// Base de los servicios de datos: guarda la lista en un BehaviorSubject (patrón Observer)
// y cada cambio se emite a todos los que estén suscritos.
export abstract class RepositorioEnMemoria<T extends { id: number }> {
  private readonly almacenamiento = inject(AlmacenamientoService);
  private readonly sujeto: BehaviorSubject<T[]>;
  readonly items$: Observable<T[]>;

  protected constructor(
    private readonly clave: string,
    private readonly semilla: T[],
  ) {
    const guardados = this.almacenamiento.leer<T[]>(clave);
    this.sujeto = new BehaviorSubject<T[]>(guardados ?? structuredClone(semilla));
    this.items$ = this.sujeto.asObservable();
  }

  get items(): T[] {
    return this.sujeto.value;
  }

  buscarPorId(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  agregar(datos: Omit<T, 'id'>): T {
    const siguienteId = Math.max(0, ...this.items.map((item) => item.id)) + 1;
    const nuevo = { ...datos, id: siguienteId } as T;
    this.emitir([...this.items, nuevo]);
    return nuevo;
  }

  actualizar(id: number, cambios: Partial<T>): T | undefined {
    let actualizado: T | undefined;
    const lista = this.items.map((item) => {
      if (item.id !== id) return item;
      actualizado = { ...item, ...cambios, id };
      return actualizado;
    });
    if (actualizado) this.emitir(lista);
    return actualizado;
  }

  eliminar(id: number): void {
    this.eliminarDonde((item) => item.id === id);
  }

  eliminarDonde(condicion: (item: T) => boolean): void {
    this.emitir(this.items.filter((item) => !condicion(item)));
  }

  restablecer(): void {
    this.emitir(structuredClone(this.semilla));
  }

  private emitir(lista: T[]): void {
    this.sujeto.next(lista);
    this.almacenamiento.guardar(this.clave, lista);
  }
}
