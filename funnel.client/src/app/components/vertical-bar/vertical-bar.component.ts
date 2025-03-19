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
        { nombre: 'OPORTUNIDADES GENERAL', path: '/DASHBOARD/subopcion1' },
        { nombre: 'OPORTUNIDADES POR AGENTE', path: '/oportunidades/subopcion2' },
        { nombre: 'CLIENTES TOP 20', path: '/oportunidades/subopcion3' }
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
        { nombre: 'GANADAS', path: '/TERMINADAS/GANADAS' },
        { nombre: 'PERDIDAS', path: '/TERMINADAS/PERDIDAS' },
        { nombre: 'CANCELADAS', path: '/TERMINADAS/CANCELADAS' },
        { nombre: 'ELIMINADAS', path: '/TERMINADAS/ELIMINADAS' }
      ]
    },
    {
      nombre: 'ADMINISTRACIÓN',
      path: '',
      icono: 'bi-gear',  // Icono de engranaje, representando administración o configuración
      tooltip: 'Ir a administración',
      subMenu: [
        { nombre: 'PROSPECTOS', path: 'Catalogos/prospectos' },
        { nombre: 'CONTACTOS', path: 'Catalogos/contactos' },
      ]
    },
    {
      nombre: 'CATÁLOGOS',
      path: '',
      icono: 'bi-list-ul',  // Icono de lista, adecuado para catálogos
      tooltip: 'Ir a Catálogos',
      subMenu: [
        { nombre: 'USUARIOS', path: 'Catalogos/usuarios' },
        { nombre: 'PERMISOS', path: 'Catalogos/permisos' },
        { nombre: 'TIPO SERVICIO', path: 'Catalogos/tipo-servicios' },
        { nombre: 'TIPO ENTREGA', path: 'Catalogos/tipop-entrega' }
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
      path: '/salir',
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
