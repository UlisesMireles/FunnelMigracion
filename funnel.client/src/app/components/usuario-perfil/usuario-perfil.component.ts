
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../services/login.service';
import { SideNavService } from '../../services/sidenav.service';
import { ModalService } from '../../services/modal-perfil.service';
import { Subscription } from 'rxjs';
import { ImagenActualizadaService } from '../../services/imagen-actualizada.service';
@Component({
  selector: 'app-usuario-perfil',
  standalone: false,
  templateUrl: './usuario-perfil.component.html',
  styleUrl: './usuario-perfil.component.css'
})


export class UsuarioPerfilComponent implements OnInit, OnDestroy {
  constructor(private readonly router: Router, private readonly breakpointObserver: BreakpointObserver, 
              private readonly authService: LoginService, 
              public sideNavService: SideNavService, 
              private modalService: ModalService,
              private imagenActualizada: ImagenActualizadaService) {

  }
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  isUserPanelVisible = false;
  baseUrl: string = environment.baseURL;
  rutaImgenDefault: string = this.baseUrl + 'Fotografia/persona_icono_principal.png';
  rutaImgen: string = this.baseUrl + '/Fotografia/';
  nombreUsuario: string = '';
  nombre: string = '';
  rol: string = '';
  tipoUsuario: string = '';
  isMobile: boolean = false;
  isExpanded = false;
  private modalSubscription: Subscription | null = null;

  onSidebarToggle(expanded: boolean) {
    this.isExpanded = expanded;
  }

  ngOnInit(): void {

    this.breakpointObserver
      .observe(['(max-width: 991.98px)'])
      .subscribe((result: any) => {
        this.isMobile = result.matches;
      });

      this.imagenActualizada.actualizarImagenPerfil(localStorage.getItem('imagenPerfil')!);

      this.imagenActualizada.imagenPerfil$.subscribe(nombreImagen => {
        if (nombreImagen) {
          this.rutaImgen = this.baseUrl + '/Fotografia/' + nombreImagen + '?t=' + new Date().getTime();
        }
        else {
          this.rutaImgen = this.rutaImgenDefault;
        }
    });
    if (this.authService.currentUser) {
      this.nombreUsuario = localStorage.getItem('username')!;
      this.nombre = localStorage.getItem('nombre')!;
      this.rol = localStorage.getItem('tipoUsuario')!;
      //let nombreImagen = localStorage.getItem('imagenPerfil')!;
      // if(nombreImagen !== null || nombreImagen !== ''){
      //   this.rutaImgen = this.rutaImgen + nombreImagen;
      // }
      // else {
      //   this.rutaImgen = this.rutaImgenDefault;
      // }
      
      if (this.rol == "Tenant") {
        this.tipoUsuario = "Usuario Master";
      }
      else {
        this.tipoUsuario = this.rol;
      }
    }

    this.modalSubscription = this.modalService.modalVisible$.subscribe((visible) => {
      this.visible = visible;
    });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const modalElement = document.getElementById('modalPerfil');
    if (this.visible && modalElement && !modalElement.contains(event.target as Node)) {
      this.modalService.closeModal(); 
    }
  }

  onModalClick(event: MouseEvent) {
    event.stopPropagation(); 
  }

  logout() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToMiCuenta() {
    this.visible = false;
    this.router.navigate(['/cambiar-contrasena']);
  }

  toggleUserPanel(event: Event): void {
    event.stopPropagation();
    this.isUserPanelVisible = !this.isUserPanelVisible;
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: Event): void {
  //   this.isUserPanelVisible = false;
  // }

  toggleSideNav(): void {
    this.sideNavService.toggle();
    this.sideNavService.toggleIconState();
  }
}
