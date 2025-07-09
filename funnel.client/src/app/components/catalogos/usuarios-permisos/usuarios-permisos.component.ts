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
  permisoUsuarios: boolean = false;
  permisoPermisos: boolean = false;
  EnumPaginas = EnumPaginas;
  seccionExpandida: 'usuarios' | 'permisos'  = 'usuarios';
  constructor(private readonly loginService:LoginService) { }
  ngOnInit() {
     this.consultarPermisosUsuario();
  }
  toggleSeccion(seccion: 'usuarios' | 'permisos') {
  const orden: ('usuarios' | 'permisos')[] = [
    'usuarios',
    'permisos'
  ];

  const permisos = {
    usuarios: this.permisoUsuarios,
    permisos: this.permisoPermisos,
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
      const permisoUsuarios = permisos.find(p => p.nombre === EnumMenus.USUARIOS);
      if(permisoUsuarios){
        this.permisoPermisos = permisoUsuarios.subMenu.some((p:any) => p.pagina === EnumPaginas.PERMISOS);
        this.permisoUsuarios = permisoUsuarios.subMenu.some((p:any) => p.pagina === EnumPaginas.USUARIOS);
        if (!this.permisoUsuarios && !this.permisoPermisos) {
          this.permisoUsuarios = true; 
        }
      }
    }
  }
}
