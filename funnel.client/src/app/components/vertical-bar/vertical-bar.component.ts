import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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
  ListaMenu = [
    {
      nombre: 'EN PROCESO',
      path: '/oportunidades',
      icono: 'bi bi-hourglass-split',  // Icono de una persona, ya que es un estado de proceso
      tooltip: 'Ir a en Proceso',
      subMenu: []
    },
    {
      nombre: 'TERMINADAS',
      path: '',
      icono: 'bi bi-fonts',  // Icono de marca de verificación, indicando que está terminado
      tooltip: 'Ir a Terminadas',
      subMenu: [
        { nombre: 'GANADAS', path: '/oportunidades-ganadas' , hasIcon: false, tooltipMessage:'' },
        { nombre: 'PERDIDAS', path: '/oportunidades-perdidas' , hasIcon: false ,tooltipMessage:'' },
        { nombre: 'CANCELADAS', path: '/oportunidades-canceladas' , hasIcon: false ,tooltipMessage:'' },
        { nombre: 'ELIMINADAS', path: '/oportunidades-eliminadas' , hasIcon: false,tooltipMessage:''  },
      ]
    },
    {
      nombre: 'DASHBOARD',
      path: '',
      icono: 'bi bi-bar-chart',  // Icono relacionado con un dashboard (pantalla de inicio)
      tooltip: 'Ir a DASHBOARD',
      subMenu: [
        { nombre: 'OPORTUNIDADES GENERAL', path: '/oportunidades54'
          ,hasIcon: false, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'}, // Mensaje del globo
        { nombre: 'OPORTUNIDADES POR AGENTE', path: '/oportunidades/subopcion2'   ,hasIcon: false, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'}, // Mensaje del globo
        { nombre: 'CLIENTES TOP 20', path: '/oportunidades/subopcion3'    ,hasIcon: false, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'} // Mensaje del globo
      ]
    },
    {
      nombre: 'ADMINISTRACIÓN',
      path: '',
      icono: 'bi bi-briefcase',  // Icono de engranaje, representando administración o configuración
      tooltip: 'Ir a administración',
      subMenu: [
        { nombre: 'PROSPECTOS', path: '/prospectos' ,hasIcon: false, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'} ,// Mensaje del globo
        { nombre: 'CONTACTOS', path: '/contactos' ,hasIcon: false, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'} // Mensaje del globo
      ]
    },
    {
      nombre: 'CATÁLOGOS',
      path: '',
      icono: 'bi-list-ul',  // Icono de lista, adecuado para catálogos
      tooltip: 'Ir a Catálogos',
      subMenu: [
        { nombre: 'USUARIOS', path: '/usuarios', hasIcon: false, tooltipMessage:'' },
        { nombre: 'PERMISOS', path: '/permisos' , hasIcon: false , tooltipMessage:''},
        { nombre: 'TIPO SERVICIO', path: '/tipos-servicios' , hasIcon: false, tooltipMessage:'' },
        { nombre: 'TIPO ENTREGA', path: '/tipos-entrega' , hasIcon: false , tooltipMessage:''}
      ]
    },
    {
      nombre: 'HERRAMIENTAS',
      path: '/herramientas',
      icono: 'bi-wrench',  // Icono de llave inglesa, representando herramientas
      tooltip: 'Ir a Herramientas',
      subMenu: []
    },
    {
      nombre: 'SALIR',
      path: '/login',
      icono: 'bi-box-arrow-right',  // Icono de salir o cerrar sesión
      tooltip: 'Cerrar sesión',
      subMenu: []  // Sin submenú
    }
  ];


  constructor(private router: Router) {}

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