import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <span class="logo" [class.logo-claro]="claro()">
      <svg [attr.width]="tamano()" [attr.height]="tamano()" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="3" y="5" width="29" height="22" rx="8" class="burbuja-1" />
        <path d="M9 25 7 34l10-8z" class="burbuja-1" />
        <rect x="16" y="16" width="29" height="22" rx="8" class="burbuja-2" />
        <path d="M39 36l2 8-10-7z" class="burbuja-2" />
        <circle cx="24" cy="27" r="2.3" fill="#fff" />
        <circle cx="30.5" cy="27" r="2.3" fill="#fff" />
        <circle cx="37" cy="27" r="2.3" fill="#fff" />
      </svg>
      @if (conTexto()) {
        <span class="logo-texto">Tertulia</span>
      }
    </span>
  `,
  styles: `
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .burbuja-1 {
      fill: var(--tt-primario);
    }
    .burbuja-2 {
      fill: var(--tt-acento);
    }
    .logo-claro .burbuja-1 {
      fill: #fff;
      opacity: 0.9;
    }
    .logo-texto {
      font-weight: 800;
      font-size: 1.35rem;
      letter-spacing: -0.02em;
      color: inherit;
    }
  `,
})
export class Logo {
  readonly tamano = input(36);
  readonly conTexto = input(true);
  readonly claro = input(false);
}
