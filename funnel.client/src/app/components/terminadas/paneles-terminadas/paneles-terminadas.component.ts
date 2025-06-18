import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { EnumPaginas } from '../../../enums/enumPaginas';
import { EnumMenus } from '../../../enums/enumMenus';

@Component({
  selector: 'app-paneles-terminadas',
  standalone: false,
  templateUrl: './paneles-terminadas.component.html',
  styleUrl: './paneles-terminadas.component.css'
})
export class PanelesTerminadasComponent {
  permisoGanadas: boolean = false;
  permisoPerdidas: boolean = false;
  permisoCanceladas: boolean = false;
  permisoEliminadas: boolean = false;
  seccionExpandida: 'ganadas' | 'perdidas' | 'canceladas' | 'eliminadas' = 'ganadas';
  EnumPaginas = EnumPaginas;
  constructor(private readonly loginService:LoginService) { }
  ngOnInit() {
     this.consultarPermisosUsuario();
  }
  toggleSeccion(seccion: 'ganadas' | 'perdidas' | 'canceladas' | 'eliminadas') {
  const orden: ('ganadas' | 'perdidas' | 'canceladas' | 'eliminadas')[] = [
    'ganadas',
    'perdidas',
    'canceladas',
    'eliminadas'
  ];

  const permisos = {
    ganadas: this.permisoGanadas,
    perdidas: this.permisoPerdidas,
    canceladas: this.permisoCanceladas,
    eliminadas: this.permisoEliminadas,
  };

  if (!permisos[seccion]) return;

  // Si se hace clic en la sección ya abierta busca la siguiente
  if (this.seccionExpandida === seccion) {
    const index = orden.indexOf(seccion);

    for (let i = index + 1; i < orden.length; i++) {
      if (permisos[orden[i]]) {
        this.seccionExpandida = orden[i];
        return;
      }
    }

    // Si no hay ninguna después busca hacia arriba
    for (let i = 0; i < index; i++) {
      if (permisos[orden[i]]) {
        this.seccionExpandida = orden[i];
        return;
      }
    }

    this.seccionExpandida = seccion;

  } else {
    this.seccionExpandida = seccion;
  }
}
  consultarPermisosUsuario() {
    const permisos = this.loginService.obtenerPermisosUsuario();
    if (permisos && permisos.length > 0) {
      const permisoServicios = permisos.find(p => p.nombre === EnumMenus.TERMINADAS);
      if(permisoServicios){
        this.permisoPerdidas = permisoServicios.subMenu.some((p:any) => p.pagina === EnumPaginas.PERDIDAS);
        this.permisoGanadas = permisoServicios.subMenu.some((p:any) => p.pagina === EnumPaginas.GANADAS);
        this.permisoCanceladas = permisoServicios.subMenu.some((p:any) => p.pagina === EnumPaginas.CANCELADAS);
        this.permisoEliminadas = permisoServicios.subMenu.some((p:any) => p.pagina === EnumPaginas.ELIMINADAS);
        if (!this.permisoGanadas && !this.permisoPerdidas && !this.permisoCanceladas && !this.permisoEliminadas) {
          this.permisoGanadas = true; 
        }
        
      }
    }
  }
}


