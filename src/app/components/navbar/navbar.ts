import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { ForoFacade } from '../../facades/foro.facade';
import { NOMBRE_ROL } from '../../models';
import { Avatar } from '../avatar/avatar';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Logo, Avatar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly foro = inject(ForoFacade);
  private readonly router = inject(Router);

  protected readonly nombreRol = NOMBRE_ROL;
  protected readonly menuAbierto = signal(false);
  protected readonly cuentaAbierta = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.cerrarMenus());
  }

  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  alternarCuenta(): void {
    this.cuentaAbierta.update((abierta) => !abierta);
  }

  cerrarSesion(): void {
    this.foro.cerrarSesion();
    this.cerrarMenus();
    this.router.navigate(['/']);
  }

  private cerrarMenus(): void {
    this.menuAbierto.set(false);
    this.cuentaAbierta.set(false);
  }
}
