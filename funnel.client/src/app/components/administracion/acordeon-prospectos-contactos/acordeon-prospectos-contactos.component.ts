import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { EnumPaginas } from '../../../enums/enumPaginas';
import { EnumMenus } from '../../../enums/enumMenus';


@Component({
  selector: 'app-acordeon-prospectos-contactos',
  standalone: false,
  templateUrl: './acordeon-prospectos-contactos.component.html',
  styleUrl: './acordeon-prospectos-contactos.component.css'
})
export class AcordeonProspectosContactosComponent {
  permisoProspectos: boolean = false;
  permisoContactos: boolean = false;
  prospectosExpandido = true;
  contactosExpandido = false;
  EnumPaginas = EnumPaginas;
  constructor(private readonly loginService:LoginService) { }
  ngOnInit() {
     this.consultarPermisosUsuario();
  }
  toggleProspectos() {
    if (!this.permisoProspectos) return;
    if (this.prospectosExpandido) {
      this.prospectosExpandido = false;
      this.contactosExpandido = true;
    } else {
      this.prospectosExpandido = true;
      this.contactosExpandido = false;
    }
  }
   toggleContactos() {
    if (!this.permisoContactos) return;
    if (this.contactosExpandido) {
      this.contactosExpandido = false;
      this.prospectosExpandido = true;
    } else {
      this.contactosExpandido = true;
      this.prospectosExpandido = false;
    }
  }
  consultarPermisosUsuario() {
    const permisos = this.loginService.obtenerPermisosUsuario();
    console.log('permisos', permisos);
    if (permisos && permisos.length > 0) {
      const permisoProspectos = permisos.find(p => p.nombre === EnumMenus.ADMINISTRACION);
      console.log('permisoProspectos', permisoProspectos);
      if(permisoProspectos){
        this.permisoContactos = permisoProspectos.subMenu.some((p:any) => p.pagina === EnumPaginas.CONTACTOS);
        this.permisoProspectos = permisoProspectos.subMenu.some((p:any) => p.pagina === EnumPaginas.PROSPECTOS);
        this.contactosExpandido = !this.permisoProspectos;
      }
    }
  }
}
