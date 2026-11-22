import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EstadoVacio } from '../../components/estado-vacio/estado-vacio';
import { TemaCard } from '../../components/tema-card/tema-card';
import { ForoFacade, OrdenTemas } from '../../facades/foro.facade';

@Component({
  selector: 'app-temas',
  imports: [ReactiveFormsModule, RouterLink, TemaCard, EstadoVacio],
  templateUrl: './temas.html',
  styleUrl: './temas.css',
})
export class Temas implements OnInit {
  protected readonly foro = inject(ForoFacade);
  private readonly fb = inject(NonNullableFormBuilder);

  // ?categoria=ID en la URL, por ejemplo desde el detalle de un tema
  readonly categoria = input<string>();

  protected readonly orden = signal<OrdenTemas>('recientes');

  protected readonly filtros = this.fb.group({
    texto: ['', Validators.maxLength(100)],
    categoriaId: this.fb.control<number | null>(null),
    autorId: this.fb.control<number | null>(null),
  });

  private readonly valoresFiltro = toSignal(this.filtros.valueChanges, {
    initialValue: this.filtros.getRawValue(),
  });

  protected readonly temas = computed(() => {
    const f = { ...this.filtros.getRawValue(), ...this.valoresFiltro() };
    return this.foro.filtrarTemas({
      texto: f.texto ?? '',
      categoriaId: f.categoriaId ?? null,
      autorId: f.autorId ?? null,
      orden: this.orden(),
    });
  });

  protected readonly hayFiltros = computed(() => {
    const f = this.valoresFiltro();
    return !!f.texto?.trim() || f.categoriaId != null || f.autorId != null;
  });

  ngOnInit(): void {
    const id = Number(this.categoria());
    if (id) this.filtros.controls.categoriaId.setValue(id);
  }

  elegirCategoria(id: number | null): void {
    this.filtros.controls.categoriaId.setValue(id);
  }

  ordenar(orden: OrdenTemas): void {
    this.orden.set(orden);
  }

  totalEn(categoriaId: number): number {
    return this.foro.temasPublicos().filter((t) => t.categoriaId === categoriaId).length;
  }

  limpiar(): void {
    this.filtros.reset();
  }
}
