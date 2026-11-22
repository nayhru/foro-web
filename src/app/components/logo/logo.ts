import { Component, input } from '@angular/core';

// Logo de La Fogata: dos leños cruzados con una llama encima
@Component({
  selector: 'app-logo',
  template: `
    <span class="logo" [class.logo-claro]="claro()">
      <svg [attr.width]="tamano()" [attr.height]="tamano()" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="7" y="35" width="34" height="7" rx="3.5" class="leno" transform="rotate(-14 24 38.5)" />
        <rect x="7" y="35" width="34" height="7" rx="3.5" class="leno leno-2" transform="rotate(14 24 38.5)" />
        <path
          class="llama"
          d="M24 3c3 7 11 11 10.5 21.5C34.2 31 29.6 36 24 36s-10.2-5-10.5-11.5c-.2-5.5 3-8.6 5.2-12.3 1.3 2.6 1.6 4.6 1.4 6.8C22.8 14.6 22.6 8.6 24 3z"
        />
        <path
          class="nucleo"
          d="M24.5 17c2.6 3.4 5.3 6.2 4.9 11-.3 3.5-2.4 5.8-5.4 5.8s-5.1-2.3-5.1-5.4c0-3.8 3.9-5.8 5.6-11.4z"
        />
        <circle cx="36" cy="9" r="1.6" class="chispa" />
      </svg>
      @if (conTexto()) {
        <span class="logo-texto">La Fogata</span>
      }
    </span>
  `,
  styles: `
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .leno {
      fill: var(--lf-leno);
    }
    .leno-2 {
      fill: var(--lf-carbon-claro);
    }
    .llama {
      fill: var(--lf-primario);
    }
    .nucleo,
    .chispa {
      fill: var(--lf-acento);
    }
    .logo-claro .leno {
      fill: #c8a27c;
    }
    .logo-claro .leno-2 {
      fill: #a8a29e;
    }
    .logo-claro .llama {
      fill: #f97316;
    }
    .logo-texto {
      font-weight: 800;
      font-size: 1.35rem;
      letter-spacing: -0.02em;
      color: inherit;
      white-space: nowrap;
    }
  `,
})
export class Logo {
  readonly tamano = input(36);
  readonly conTexto = input(true);
  readonly claro = input(false);
}
