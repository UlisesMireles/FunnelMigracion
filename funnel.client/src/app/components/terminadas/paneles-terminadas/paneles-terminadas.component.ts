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
  ganadasExpandido = true;
  perdidasExpandido = false;
  canceladasExpandido = false;
  eliminadasExpandido = false;
  EnumPaginas = EnumPaginas;
  constructor(private readonly loginService:LoginService) { }
  ngOnInit() {
     this.consultarPermisosUsuario();
  }
  toggleGanadas() {
    if (!this.permisoGanadas) return;
    if (this.ganadasExpandido) {
      this.ganadasExpandido = false;
      this.perdidasExpandido = true;
    } else {
      this.ganadasExpandido = true;
      this.perdidasExpandido = false;
    }
  }
   togglePerdidas() {
    if (!this.permisoPerdidas) return;
    if (this.perdidasExpandido) {
      this.perdidasExpandido = false;
      this.canceladasExpandido = true;
    } else {
      this.perdidasExpandido = true;
      this.canceladasExpandido = false;
    }
  }
   toggleCanceladas() {
    if (!this.permisoCanceladas) return;
    if (this.canceladasExpandido) {
      this.canceladasExpandido = false;
      this.eliminadasExpandido = true;
    } else {
      this.canceladasExpandido = true;
      this.eliminadasExpandido = false;
    }
  }
  toggleEliminadas() {
    if (!this.permisoEliminadas) return;
    if (this.eliminadasExpandido) {
      this.eliminadasExpandido = false;
      this.ganadasExpandido = true;
    } else {
      this.eliminadasExpandido = true;
      this.ganadasExpandido = false;
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
        this.perdidasExpandido = !this.permisoGanadas;
      }
    }
  }
}


