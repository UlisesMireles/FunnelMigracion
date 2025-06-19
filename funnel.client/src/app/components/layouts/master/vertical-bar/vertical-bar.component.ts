import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PermisosService } from '../../../../services/permisos.service';
import { LoginService } from '../../../../services/login.service';
import { Permiso } from '../../../../interfaces/permisos';
import { ModalService } from '../../../../services/modal-perfil.service';
import { EnumPaginas } from '../../../../enums/enumPaginas';
import { EnumMenus } from '../../../../enums/enumMenus';

@Component({
  selector: 'app-vertical-bar',
  standalone: false,
  templateUrl: './vertical-bar.component.html',
  styleUrl: './vertical-bar.component.css'
})
export class VerticalBarComponent {

  modalVisible: boolean = false;
  isExpanded: boolean = false;
  hoveredMenu: number | null = null;
  showTooltip: boolean = false;
  @ViewChild('menuList', { static: false }) menuList!: ElementRef;
  @Output() toggleSidebar = new EventEmitter<boolean>();
  isScrollable: boolean = false;
  scrollInterval: any = null;
  ListaMenu: any[] = [];
  isClickInsideModal: boolean = false;

  constructor(private router: Router,
    private messageService: MessageService,
    private permisosService: PermisosService,
    private readonly loginService: LoginService, private modalService: ModalService) { }


  ngOnInit(): void {
    this.consultarMenu();
  }

  consultarMenu(): void {

    this.permisosService.getPermisosPorRol(this.loginService.obtenerRolUsuario(), this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Permiso[]) => {
        const perfil = {
          nombre: localStorage.getItem('username')!,//'Perfil',
          ruta: '/perfil',
          icono: 'bi bi-person-circle',
          tooltip: 'Perfil',
          subMenu: []
        };

        const salir = {
          nombre: 'SALIR',
          ruta: '/login',
          icono: 'bi-box-arrow-right',
          colorIcono: '#ffffff',
          tooltip: 'Cerrar sesión',
          subMenu: []
        };

        // Combinar: primero "Perfil", luego los permisos, luego "SALIR"
        this.ListaMenu = [perfil, ...result, salir];
        this.ListaMenu = this.ListaMenu.map(menu =>
          menu.nombre === EnumMenus.TERMINADAS
            ? { ...menu, ruta: "/oportunidades-terminadas" , subMenu: [
              { idPagina: 5, pagina: EnumPaginas.TERMINADAS, ruta: "/oportunidades-terminadas" }
            ] }
            : menu
        );
        this.ListaMenu = this.ListaMenu.map(menu =>
          menu.nombre === EnumMenus.DASHBOARD
            ? { ...menu, subMenu: [], ruta: '/dashboard' }
            : menu
        );
        this.ListaMenu = this.ListaMenu.map(menu =>
          menu.nombre === EnumMenus.ADMINISTRACION
            ? { ...menu, ruta: "/prospectos-contactos", subMenu: [
              { idPagina: 9, pagina: EnumPaginas.PROSPECTOS_CONTACTOS, ruta: "/prospectos-contactos" }
            ] }
            : menu
        );
        this.ListaMenu = this.ListaMenu.map(menu =>
           menu.nombre === EnumMenus.USUARIOS
            ? { ...menu, ruta: "/usuarios-permisos", subMenu: [
              { idPagina: 11, pagina: EnumPaginas.USUARIOS_PERMISOS, ruta: "/usuarios-permisos" }
            ] }
            : menu
        );
        this.ListaMenu = this.ListaMenu.map(menu =>
          menu.nombre === EnumMenus.CONFIGURACION
            ? { ...menu, ruta: "/servicios-entregas", subMenu: [
              { idPagina: 13, pagina: EnumPaginas.SERVICIOS_ENTREGAS, ruta: "/servicios-entregas" }
            ] }
            : menu
        );
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error al consultar los permisos.',
          detail: error.errorMessage,
        });
      },
    });
  }

  navigateTo(path: string) {
    if (path === '/perfil') {
      if(this.modalVisible)
        this.modalService.closeModal();
      else
        this.modalService.toggleModal();
        
    //  console.log('this.modalVisible ' + this.modalVisible);
    } else {
      this.modalService.closeModal();
      this.router.navigate([path]);
    }
  }

  // Método para cuando el clic es dentro de la modal
  onModalClick(event: MouseEvent) {
    this.isClickInsideModal = true;
    setTimeout(() => {
      this.isClickInsideModal = false;
    });
  }
  
  showSubmenu(menuIndex: number) {
    this.hoveredMenu = menuIndex;
  }

  hideSubmenu() {
    this.hoveredMenu = null;
  }



  toggleMenu() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidebar.emit(this.isExpanded); // Emitimos el nuevo estado
  }

  ngAfterViewInit() {
    this.checkScroll();
  }
  @HostListener('window:resize')
  checkScroll() {
    if (this.menuList) {
      const menuEl = this.menuList.nativeElement;
      this.isScrollable = menuEl.scrollHeight > menuEl.clientHeight;
    }
  }

  scrollUp() {
    if (this.isScrollable && this.menuList) {
      this.scrollInterval = setInterval(() => {
        this.menuList.nativeElement.scrollBy({ top: -5, behavior: 'smooth' });
      }, 10);
    }
  }

  scrollDown() {
    if (this.isScrollable && this.menuList) {
      this.scrollInterval = setInterval(() => {
        this.menuList.nativeElement.scrollBy({ top: 5, behavior: 'smooth' });
      }, 10);
    }
  }

  stopScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }
}
