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
  serviciosExpandido = true;
  entregasExpandido = false;
  EnumPaginas = EnumPaginas;
  constructor(private readonly loginService:LoginService) { }
  ngOnInit() {
     this.consultarPermisosUsuario();
     console.log('permisoServicios', this.permisoServicios);
     console.log('permisoEntregas', this.permisoEntregas);
  }
  toggleServicios() {
    if (!this.permisoServicios) return;
    if (this.serviciosExpandido) {
      this.serviciosExpandido = false;
      this.entregasExpandido = true;
    } else {
      this.serviciosExpandido = true;
      this.entregasExpandido = false;
    }
  }
   toggleEntregas() {
    if (!this.permisoEntregas) return;
    if (this.entregasExpandido) {
      this.entregasExpandido = false;
      this.serviciosExpandido = true;
    } else {
      this.entregasExpandido = true;
      this.serviciosExpandido = false;
    }
  }
  consultarPermisosUsuario() {
    const permisos = this.loginService.obtenerPermisosUsuario();
    if (permisos && permisos.length > 0) {
      const permisoServicios = permisos.find(p => p.nombre === EnumMenus.CONFIGURACION);
      if(permisoServicios){
        this.permisoEntregas = permisoServicios.subMenu.some((p:any) => p.pagina === EnumPaginas.ENTREGAS);
        this.permisoServicios = permisoServicios.subMenu.some((p:any) => p.pagina === EnumPaginas.SERVICIOS);
        this.entregasExpandido = !this.permisoServicios;
      }
    }
  }
}

