import { Component, computed, input } from '@angular/core';

const COLORES = ['#c2410c', '#b45309', '#57534e', '#9a3412', '#0f766e', '#7c3aed'];

@Component({
  selector: 'app-avatar',
  template: `
    <span
      class="avatar"
      [style.width.px]="tamano()"
      [style.height.px]="tamano()"
      [style.font-size.px]="tamano() * 0.4"
      [style.background]="color()"
      [attr.title]="nombre()"
      >{{ iniciales() }}</span
    >
  `,
  styles: `
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-radius: 50%;
      color: #fff;
      font-weight: 800;
      text-transform: uppercase;
    }
  `,
})
export class Avatar {
  readonly nombre = input.required<string>();
  readonly tamano = input(36);

  readonly iniciales = computed(() =>
    this.nombre()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join(''),
  );

  readonly color = computed(() => {
    const suma = [...this.nombre()].reduce((total, letra) => total + letra.charCodeAt(0), 0);
    return COLORES[suma % COLORES.length];
  });
}
