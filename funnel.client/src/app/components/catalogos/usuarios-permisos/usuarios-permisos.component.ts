import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { EnumPaginas } from '../../../enums/enumPaginas';
import { EnumMenus } from '../../../enums/enumMenus';
@Component({
  selector: 'app-usuarios-permisos',
  standalone: false,
  templateUrl: './usuarios-permisos.component.html',
  styleUrl: './usuarios-permisos.component.css'
})
export class UsuariosPermisosComponent {
  permisoUsuarios: boolean = true;
  permisoPermisos: boolean = true;
  usuariosExpandido = true;
  permisosExpandido = false;
  EnumPaginas = EnumPaginas;
  constructor(private readonly loginService:LoginService) { }
  ngOnInit() {
     this.consultarPermisosUsuario();
  }
  toggleUsuarios() {
    if (!this.permisoUsuarios) return;
    if (this.usuariosExpandido) {
      this.usuariosExpandido = false;
      this.permisosExpandido = true;
    } else {
      this.usuariosExpandido = true;
      this.permisosExpandido = false;
    }
  }
   togglePermisos() {
    if (!this.permisoPermisos) return;
    if (this.permisosExpandido) {
      this.permisosExpandido = false;
      this.usuariosExpandido = true;
    } else {
      this.permisosExpandido = true;
      this.usuariosExpandido = false;
    }
  }
  consultarPermisosUsuario() {
    const permisos = this.loginService.obtenerPermisosUsuario();
    if (permisos && permisos.length > 0) {
      const permisoUsuarios = permisos.find(p => p.nombre === EnumMenus.USUARIOS);
      if(permisoUsuarios){
        this.permisoPermisos = permisoUsuarios.subMenu.some((p:any) => p.pagina === EnumPaginas.PERMISOS);
        this.permisoUsuarios = permisoUsuarios.subMenu.some((p:any) => p.pagina === EnumPaginas.USUARIOS);
        this.permisosExpandido = !this.permisoUsuarios;
      }
    }
  }
}
