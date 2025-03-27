import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Permiso } from '../../interfaces/permisos';
import { LoginService } from '../../services/login.service';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-vertical-bar',
  standalone: false,
  templateUrl: './vertical-bar.component.html',
  styleUrl: './vertical-bar.component.css'
})
export class VerticalBarComponent {


  isExpanded: boolean = false;
  hoveredMenu: number | null = null;
  showTooltip: boolean = false;
  @ViewChild('menuList', { static: false }) menuList!: ElementRef;
  @Output() toggleSidebar = new EventEmitter<boolean>();
  isScrollable: boolean = false;
  scrollInterval: any = null;

  ListaMenu: any[] = [];

  constructor(private router: Router,
    private messageService: MessageService,
    private permisosService: PermisosService,
    private readonly loginService: LoginService) {}


  ngOnInit(): void {
    this.consultarMenu();
  }

  consultarMenu(): void {

    this.permisosService.getPermisosPorRol(this.loginService.obtenerRolUsuario(), this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Permiso[]) => {
        const perfil = {
          nombre: 'Perfil',
          ruta: '/login',
          icono: 'bi bi-person-circle',
          tooltip: 'Perfil',
          subMenu: []
        };

        const salir = {
          nombre: 'SALIR',
          ruta: '/login',
          icono: 'bi-box-arrow-right',
          tooltip: 'Cerrar sesión',
          subMenu: []
        };

        // Combinar: primero "Perfil", luego los permisos, luego "SALIR"
        this.ListaMenu = [perfil, ...result, salir];
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
    if (path) {
      this.router.navigate([path]);
    }
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
