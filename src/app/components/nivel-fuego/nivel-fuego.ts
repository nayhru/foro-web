import { Component, input } from '@angular/core';
import { NivelFuego } from '../../models';

@Component({
  selector: 'app-nivel-fuego',
  template: `
    <span class="nivel nivel-{{ nivel().codigo }}" [title]="nivel().descripcion">
      <i class="bi bi-fire" aria-hidden="true"></i>{{ nivel().nombre }}
    </span>
  `,
  styles: `
    .nivel {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 800;
      white-space: nowrap;
    }
    .nivel i {
      display: inline-block;
      transform-origin: 50% 90%;
    }
    .nivel-BRASA {
      background: #f5f5f4;
      color: #57534e;
    }
    .nivel-BRASA i {
      font-size: 0.8rem;
      color: #b45309;
      animation: brillo 3s ease-in-out infinite;
    }
    .nivel-FOGATA {
      background: var(--lf-acento-suave);
      color: #92400e;
    }
    .nivel-FOGATA i {
      font-size: 0.95rem;
      color: #d97706;
      animation: llama 2.4s ease-in-out infinite;
    }
    .nivel-HOGUERA {
      background: var(--lf-primario-suave);
      color: var(--lf-primario-oscuro);
    }
    .nivel-HOGUERA i {
      font-size: 1.1rem;
      color: #ea580c;
      animation: llama 1.6s ease-in-out infinite;
    }
    .nivel-INCENDIO {
      background: linear-gradient(90deg, var(--lf-primario-oscuro), var(--lf-primario));
      color: #fff;
      box-shadow: 0 0 10px rgba(234, 88, 12, 0.45);
    }
    .nivel-INCENDIO i {
      font-size: 1.25rem;
      color: #fde68a;
      animation: llama 1s ease-in-out infinite;
    }
    @keyframes llama {
      0%,
      100% {
        transform: scale(1) rotate(0deg);
      }
      50% {
        transform: scale(1.15) rotate(-4deg);
      }
    }
    @keyframes brillo {
      0%,
      100% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .nivel i {
        animation: none !important;
      }
    }
  `,
})
export class NivelFuegoBadge {
  readonly nivel = input.required<NivelFuego>();
}
