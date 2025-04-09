import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
import { SideNavService } from '../../../../services/sidenav.service';
import { LoginService } from '../../../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-sidenav',
  standalone: false,
  templateUrl: './menu-sidenav.component.html',
  styleUrl: './menu-sidenav.component.css'
})
export class MenuSidenavComponent {

  ListaMenu = [
      { nombre: 'OPORTUNIDADES', path: '/oportunidades', icono: 'bi-briefcase', tooltip: 'Ir a oportunidades' },
      { nombre: 'PROSPECTOS', path: '/prospectos', icono: 'bi-person-plus', tooltip: 'Ir a prospectos' },
      { nombre: 'CONTACTOS', path: '/contactos', icono: 'bi-person-lines-fill', tooltip: 'Ir a contactos' },
      { nombre: 'TIPOS SERVICIOS', path: '/tipos-servicios', icono: 'bi-basket', tooltip: 'Ir a tipos de servicios' },
      { nombre: 'SALIR', path: '/', icono: 'bi-box-arrow-right', tooltip: 'Cerrar sesión' }
    ];

  constructor(private readonly router: Router, public sideNavService: SideNavService, private dialog: MatDialog, private confirmationService: ConfirmationService,
    private readonly authService: LoginService
  ) {
    
  }
    
  ngOnInit(): void {
    
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getFooterTooltip(): string {
    return `Administrador de OpenAl\nisanchez.financiero@gmail.com\nNet-Angular V.`;
  }

}
