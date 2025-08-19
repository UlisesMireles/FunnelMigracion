import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { EnumPaginas } from '../../../enums/enumPaginas';
import { EnumMenus } from '../../../enums/enumMenus';
@Component({
  selector: 'app-servicios-entregas',
  standalone: false,
  templateUrl: './servicios-entregas.component.html',
  styleUrl: './servicios-entregas.component.css'
})
export class ServiciosEntregasComponent {
  permisoServicios: boolean = false;
  permisoEntregas: boolean = false;
  EnumPaginas = EnumPaginas;
  seccionExpandida: 'servicios' | 'entregas'  = 'servicios';
  constructor(private readonly loginService:LoginService) { }
  ngOnInit() {
     this.consultarPermisosUsuario();
  }
  toggleSeccion(seccion: 'servicios' | 'entregas') {
  const orden: ('servicios' | 'entregas')[] = [
    'servicios',
    'entregas'
  ];

  const permisos = {
    servicios: this.permisoServicios,
    entregas: this.permisoEntregas,
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
      const permisoServicios = permisos.find(p => p.nombre === EnumMenus.CONFIGURACION);
      if(permisoServicios){
        this.permisoEntregas = permisoServicios.subMenu.some((p:any) => p.pagina === EnumPaginas.ENTREGAS);
        this.permisoServicios = permisoServicios.subMenu.some((p:any) => p.pagina === EnumPaginas.SERVICIOS);
        if (!this.permisoServicios && !this.permisoEntregas) {
          this.permisoServicios = true; 
        }
      }
    }
  }
}

