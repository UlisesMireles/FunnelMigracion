
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../services/login.service';
import { SideNavService } from '../../services/sidenav.service';
@Component({
  selector: 'app-usuario-perfil',
  standalone: false,
  templateUrl: './usuario-perfil.component.html',
  styleUrl: './usuario-perfil.component.css'
})


export class UsuarioPerfilComponent {
  constructor(private readonly router: Router, private readonly breakpointObserver: BreakpointObserver, private readonly authService: LoginService, public sideNavService: SideNavService) {

  }
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  isUserPanelVisible = false;
  baseUrl: string = environment.baseURLAssets;
  rutaImgen: string = this.baseUrl + '/assets/img/persona_icono_principal.png';
  nombreUsuario: string = '';
  nombre: string = '';
  rol: string = '';
  tipoUsuario: string = '';
  isMobile: boolean = false;
  isExpanded = false;

  onSidebarToggle(expanded: boolean) {
    this.isExpanded = expanded;
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 991.98px)'])
      .subscribe((result: any) => {
        this.isMobile = result.matches;
      });
    if (this.authService.currentUser) {
      this.nombreUsuario = localStorage.getItem('username')!;
      this.nombre = localStorage.getItem('nombre')!;
      this.rol = localStorage.getItem('tipoUsuario')!;
      if (this.rol == "Tenant") {
        this.tipoUsuario = "Usuario Master";
      }
      else {
        this.tipoUsuario = this.rol;
      }
    }
  }
  logout() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleUserPanel(event: Event): void {
    event.stopPropagation();
    this.isUserPanelVisible = !this.isUserPanelVisible;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.isUserPanelVisible = false;
  }

  toggleSideNav(): void {
    this.sideNavService.toggle();
    this.sideNavService.toggleIconState();
  }
}
