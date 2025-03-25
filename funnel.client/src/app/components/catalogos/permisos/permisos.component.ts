import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Permiso} from '../../../interfaces/permisos';
import { PermisoSeleccionado} from '../../../interfaces/permisos';
import { ContactosService } from '../../../services/contactos.service';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnasDisponiblesComponent } from '../../shared/columnas-disponibles/columnas-disponibles.component';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from "lodash-es";
import { PermisosService } from '../../../services/permisos.service';


@Component({
  selector: 'app-permisos',
  standalone: false,
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent {

  permisos: Permiso[] = [];
  permisosOriginal: Permiso[] = [];

  agrupadosPermisos: any[] = [];
  loading: boolean = true;

  constructor(
    private permisosService: PermisosService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getPermisos();
  }


  getPermisos() {
    this.permisosService.getPermisos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Permiso[]) => {
        console.log(result);
        this.permisos = result;
        this.agrupadosPermisos = this.obtenerMenusAgrupados(); 
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      },
    });
  }

  obtenerMenusAgrupados() {
    const agrupados: any = {};
  
    this.permisos.forEach((permiso) => {
      const menuKey = permiso.menu ?? 'Sin menú';
  
      if (!agrupados[menuKey]) {
        agrupados[menuKey] = { menu: menuKey, paginas: [], expanded: true };
      }
      agrupados[menuKey].paginas.push(permiso);
    });
  
    return Object.values(agrupados);
  }

  toggleMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }

  getSelectedPermisos(): PermisoSeleccionado[] {
    const selectedPages: PermisoSeleccionado[] = [];
    this.agrupadosPermisos.forEach(menu => {
      menu.paginas.forEach((permiso: Permiso) => {
        if (permiso.administrador !== undefined) {
          selectedPages.push({
            idEmpresa: this.loginService.obtenerIdEmpresa(),
            idPagina: permiso.idPagina,
            idRol: 1,  // 1 = Administrador
            estatus: permiso.administrador
          });
        }
        if (permiso.gerente !== undefined) {
          selectedPages.push({
            idEmpresa: this.loginService.obtenerIdEmpresa(),
            idPagina: permiso.idPagina,
            idRol: 2,  // 2 = Gerente
            estatus: permiso.gerente
          });
        }
        if (permiso.agente !== undefined) {
          selectedPages.push({
            idEmpresa: this.loginService.obtenerIdEmpresa(),
            idPagina: permiso.idPagina,
            idRol: 3,  // 3 = Agente
            estatus: permiso.agente
          });
        }
        if (permiso.invitado !== undefined) {
          selectedPages.push({
            idEmpresa: this.loginService.obtenerIdEmpresa(),
            idPagina: permiso.idPagina,
            idRol: 4,  // 4 = Invitado
            estatus: permiso.invitado
          });
        }
      });
    });

    return selectedPages;
  }

  guardarPermisos() {
    const permisosSeleccionados = this.getSelectedPermisos();
    this.permisosService.postPermisos(permisosSeleccionados).subscribe({
      next: (result: baseOut) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado exitoso.',
          detail: result.errorMessage,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });
  
  }
}
