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
  EnumPaginas = EnumPaginas;
  seccionExpandida: 'prospectos' | 'contactos'  = 'prospectos';
  constructor(private readonly loginService:LoginService) { }
  ngOnInit() {
     this.consultarPermisosUsuario();
  }
 toggleSeccion(seccion: 'prospectos' | 'contactos') {
  const orden: ('prospectos' | 'contactos')[] = [
    'prospectos',
    'contactos'
  ];

  const permisos = {
    prospectos: this.permisoProspectos,
    contactos: this.permisoContactos,
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
      const permisoProspectos = permisos.find(p => p.nombre === EnumMenus.ADMINISTRACION);
      if(permisoProspectos){
        this.permisoContactos = permisoProspectos.subMenu.some((p:any) => p.pagina === EnumPaginas.CONTACTOS);
        this.permisoProspectos = permisoProspectos.subMenu.some((p:any) => p.pagina === EnumPaginas.PROSPECTOS);
        if (!this.permisoProspectos && !this.permisoContactos) {
          this.permisoProspectos = true; 
        }
      }
    }
  }
}
