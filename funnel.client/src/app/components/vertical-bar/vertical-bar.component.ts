import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';


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
  isScrollable: boolean = false;
  scrollInterval: any = null;
  ListaMenu = [
    {
      nombre: 'DASHBOARD',
      path: '',
      icono: 'bi-house-door',  // Icono relacionado con un dashboard (pantalla de inicio)
      tooltip: 'Ir a DASHBOARD',
      subMenu: [
        { nombre: 'OPORTUNIDADES GENERAL', path: '/DASHBOARD/subopcion1'
          ,hasIcon: true, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'}, // Mensaje del globo
        { nombre: 'OPORTUNIDADES POR AGENTE', path: '/oportunidades/subopcion2'   ,hasIcon: true, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'}, // Mensaje del globo
        { nombre: 'CLIENTES TOP 20', path: '/oportunidades/subopcion3'    ,hasIcon: true, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'} // Mensaje del globo
      ]
    },
    {
      nombre: 'EN PROCESO',
      path: '/proceso',
      icono: 'bi-person-fill',  // Icono de una persona, ya que es un estado de proceso
      tooltip: 'Ir a en Proceso',
      subMenu: []
    },
    {
      nombre: 'TERMINADAS',
      path: '',
      icono: 'bi-check-circle',  // Icono de marca de verificación, indicando que está terminado
      tooltip: 'Ir a Terminadas',
      subMenu: [
        { nombre: 'GANADAS', path: '/TERMINADAS/GANADAS' , hasIcon: false, tooltipMessage:'' },
        { nombre: 'PERDIDAS', path: '/TERMINADAS/PERDIDAS' , hasIcon: false ,tooltipMessage:'' },
        { nombre: 'CANCELADAS', path: '/TERMINADAS/CANCELADAS' , hasIcon: false ,tooltipMessage:'' },
        { nombre: 'ELIMINADAS', path: '/TERMINADAS/ELIMINADAS' , hasIcon: false,tooltipMessage:''  },
      ]
    },
    {
      nombre: 'ADMINISTRACIÓN',
      path: '',
      icono: 'bi-gear',  // Icono de engranaje, representando administración o configuración
      tooltip: 'Ir a administración',
      subMenu: [
        { nombre: 'PROSPECTOS', path: '/prospectos' ,hasIcon: true, // 🟠 Indica si tiene icono adicional
          tooltipMessage: 'Esta característica está incluida'} ,// Mensaje del globo
        { nombre: 'CONTACTOS', path: '/contactos' ,hasIcon: true, // 🟠 Indica si tiene icono adicional
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
        { nombre: 'TIPO SERVICIO', path: '/tipo-servicios' , hasIcon: false, tooltipMessage:'' },
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
      path: '/',
      icono: 'bi-box-arrow-right',  // Icono de salir o cerrar sesión
      tooltip: 'Cerrar sesión',
      subMenu: []  // Sin submenú
    }
  ];



  showSubmenu(menuIndex: number) {
    this.hoveredMenu = menuIndex;
  }

  hideSubmenu() {
    this.hoveredMenu = null;
  }



  toggleMenu() {
    this.isExpanded = !this.isExpanded;
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
