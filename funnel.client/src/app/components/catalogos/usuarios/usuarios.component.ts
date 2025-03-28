import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Usuario } from '../../../interfaces/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { ColumnasDisponiblesComponent } from '../../shared/columnas-disponibles/columnas-disponibles.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  @ViewChild('dt') dt!: Table;

  disableUsuarios: boolean = true;
  isDescargando = false;
  anchoTabla = 100;

  usuarios: Usuario[] = [];
  usuariosOriginal: Usuario[] = [];
  usuarioSeleccionado!: Usuario;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;

  

  insertar: boolean = true;
  modalVisible: boolean = false;

  

  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [
    {key:'nombre', isCheck: true, valor: 'Nombre', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text'},
    {key:'apellidoPaterno', isCheck: true, valor: 'ApellidoPaterno', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key:'apellidoMaterno', isCheck: true, valor: 'ApellidoMaterno', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key:'usuario', isCheck: true, valor: 'Usuario', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'iniciales', isCheck: true, valor: 'Iniciales', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key:'correo', isCheck: true, valor: 'Correo Electrónico', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key:'tipoUsuario', isCheck: true, valor: 'Tipo Usuario', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key:'desEstatus', isCheck: true, valor: 'Estatus', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'estatus'},
  ];
  columnsAMostrarResp = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp = JSON.stringify(this.lsTodasColumnas);

  constructor(private UsuariosService: UsuariosService, private messageService: MessageService, private cdr: ChangeDetectorRef, private loginService:LoginService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.getUsuarios();
    document.documentElement.style.fontSize = 12 + 'px';
  }

  getUsuarios(idEmpresa: number = 1) {
      this.UsuariosService.getUsuarios(this.loginService.obtenerIdEmpresa()).subscribe({
      
        next: (result: Usuario[]) => {

          if (!result || result.length === 0) {
            console.warn("No hay usuarios en la respuesta.");}

          this.usuariosOriginal = result;
          this.selectedEstatus = 'Activo';  
          this.cdr.detectChanges();
          this.loading = false;
          this.FiltrarPorEstatus();   
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
      FiltrarPorEstatus() {
        this.usuarios = this.selectedEstatus === null
          ? [...this.usuariosOriginal]
          : [...this.usuariosOriginal.filter((x) => x.desEstatus.toString() === this.selectedEstatus)];
        if (this.dt) {
          this.dt.first = 0;
        }
      }
      
      onModalClose() {
        this.modalVisible = false;
      }
    
      manejarResultado(result: baseOut) {
        if (result.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'La operación se realizó con éxito.',
            detail: result.errorMessage,
          });
          this.getUsuarios();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: result.errorMessage,
          });
        }
      }

      inserta() {
          
          this.usuarioSeleccionado = {
            result: true,
            errorMessage: ' ',  
            idUsuario: 0, 
            usuario: '',
            password: '',
            tipoUsuario: '',
            nombre: '',
            correo: '',
            idEmpresa: 0,
            idTipoUsuario: 0,
            descripcion: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            fechaRegistro: '',  
            fechaModificacion: '',  
            estatus: 1,  
            desEstatus: 'Activo',
            archivoImagen: '',
            usuarioCreador: 0,  
            codigoAutenticacion: '',
            fechaInicio: '',
            fechaFin: '',
            iniciales: '',
            id: 0
          };
          this.insertar = true;
          this.modalVisible = true;
          
        }
       
        actualiza(licencia: Usuario) {
          this.usuarioSeleccionado = licencia;
          this.insertar = false;
          this.modalVisible = true;
        }

clear(table: Table) {
      table.clear();
      this.getUsuarios();
      this.lsColumnasAMostrar = JSON.parse(this.columnsAMostrarResp);
      this.lsTodasColumnas = JSON.parse(this.columnsTodasResp);
      this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
      this.anchoTabla = 100;
    }
  
    agregarColumna(event: any) {
      const targetAttr = event.target.getBoundingClientRect();
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.autoFocus = false;
      dialogConfig.backdropClass = 'popUpBackDropClass';
      dialogConfig.panelClass = 'popUpPanelAddColumnClass';
      dialogConfig.width = '50px';
  
      dialogConfig.data = {
        todosColumnas: this.lsTodasColumnas
      };
  
      dialogConfig.position = {
        top: targetAttr.y + targetAttr.height + 10 + "px",
        left: targetAttr.x - targetAttr.width - 240 + "px"
      };
      const dialogRef = this.dialog.open(ColumnasDisponiblesComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          this.lsColumnasAMostrar = JSON.parse(this.columnsAMostrarResp);
          const selectedColumns = r.filter((f: any) => f.isCheck);
  
          selectedColumns.forEach((element: any) => {
            this.lsColumnasAMostrar.push(element)
          });
          if (this.lsColumnasAMostrar.length > 5) {
            this.anchoTabla = 100
          }
        }
      });
    }
  
    exportExcel(table: Table) {
      let lsColumnasAMostrar = this.lsColumnasAMostrar.filter(col => col.isCheck);
      let columnasAMostrarKeys = lsColumnasAMostrar.map(col => col.key);
    
      let dataExport = (table.filteredValue || table.value || []).map(row => {
        return columnasAMostrarKeys.reduce((acc, key) => {
          acc[key] = row[key];
          return acc;
        }, {} as { [key: string]: any });
      });
    
      import('xlsx').then(xlsx => {
        const hojadeCalculo: import('xlsx').WorkSheet = xlsx.utils.json_to_sheet(dataExport);
        const libro: import('xlsx').WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Usuarios");
        xlsx.writeFile(libro, "Usuarios.xlsx");
      });
    }
  
    getTotalCostPrimeNg(table: Table, def: any) {
      if (!def.isTotal) {
        return;
      }
  
      const registrosVisibles = table.filteredValue ? table.filteredValue : this.usuarios;
    
      if (def.key === 'nombre') {
        return registrosVisibles.length;
      }
  
      return (
        registrosVisibles.reduce(
          (acc: number, empresa: Usuario) =>
            acc + (Number(empresa[def.key as keyof Usuario]) || 0),
          0
        ) / registrosVisibles.length
      );
    }
  
    getVisibleTotal(campo: string, dt: any): number {
      const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.usuarios;
    
      if (campo === 'nombre') {
        return registrosVisibles.length;
      }
    
      return registrosVisibles.reduce(
        (acc: number, empresa: Usuario) =>
          acc + (Number(empresa[campo as keyof Usuario] || 0)),
        0
      );
    }
  
    obtenerArregloFiltros(data: any[], columna: string): any[] {
      const lsGroupBy = groupBy(data, columna);
      return sortBy(getKeys(lsGroupBy));
    }
    
    getColumnWidth(key: string): object {
      const widths: { [key: string]: string } = {
          nombre: '100%',
          apellidoPaterno: '100%',
          apellidoMaterno: '100%',
          usuario: '100%',
          iniciales: '100%',
          correo: '100%',
          tipoUsuario: '100%',
          desEstatus: '100%',
      };
      return { width: widths[key] || 'auto' };
  }
  isSorted(columnKey: string): boolean {
    
    return this.dt?.sortField === columnKey;
}

}
