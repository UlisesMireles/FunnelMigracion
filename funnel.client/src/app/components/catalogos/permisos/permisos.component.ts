import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Permiso } from '../../../interfaces/permisos';
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
  permisoSeleccionado!: Permiso;

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


}
