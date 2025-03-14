import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
//PrimeNG
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ColumnasDisponiblesComponent } from '../../shared/columnas-disponibles/columnas-disponibles.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';
import{ ProspectoService } from '../../../services/prospecto.service';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { Prospectos } from '../../../interfaces/prospecto';
import { LoginService } from '../../../services/login.service';
@Component({
  selector: 'app-prospectos',
  standalone: false,
  templateUrl: './prospectos.component.html',
  styleUrl: './prospectos.component.css'
})
export class ProspectosComponent {
  @ViewChild('dt')
  dt!: Table ;


  disableProspectos = true;
  isDescargando = false;
  anchoTabla = 100;
  prospectos: Prospectos[] = [];
  prospectosOriginal: Prospectos[] = [];
  prospectoSeleccionado!: Prospectos;


  loading: boolean = true;
  insertar: boolean = false;
  modalVisible: boolean = false;
  selectedEstatus: any = null;

EstatusDropdown = [
  { label: 'Todo', value: null },
  { label: 'Activo', value: 'Activo' },
  { label: 'Inactivo', value: 'Inactivo' },
];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [
    {key:'nombre', isCheck: true, valor: 'Nombre', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'nombreSector', isCheck: true, valor: 'Sector de la industria', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'ubicacionFisica', isCheck: true, valor: 'Ubicación Física', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'totalOportunidades', isCheck: true, valor: 'Todas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'proceso', isCheck: true, valor: 'En Proceso', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'ganadas', isCheck: true, valor: 'Ganadas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'perdidas', isCheck: true, valor: 'Perdidas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'canceladas', isCheck: true, valor: 'Canceladas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'eliminadas', isCheck: true, valor: 'Eliminadas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'desEstatus', isCheck: true, valor: 'Estatus', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'estatus'}
  ];

  columnsAMostrarResp = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp = JSON.stringify(this.lsTodasColumnas);

  constructor( private messageService: MessageService, private cdr: ChangeDetectorRef, private prospectoService: ProspectoService, private loginService: LoginService, public dialog: MatDialog) { }

ngOnInit(): void {
this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
this.getProspectos();
document.documentElement.style.fontSize = 12 + 'px';
}
  
getProspectos() {
  this.prospectoService.getProspectos(this.loginService.obtenerIdEmpresa()).subscribe({
    next: (result: Prospectos[]) => {
      this.prospectosOriginal = result;
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
  
  this.prospectos = this.selectedEstatus === null
    ? [...this.prospectosOriginal]
    : [...this.prospectosOriginal.filter((x) => x.desEstatus === this.selectedEstatus)];
  if (this.dt) {
    this.dt.first = 0;
  }
}
// eventosBotones
inserta() {
  this.prospectoSeleccionado = {
    //bandera: '',
    idProspecto: 0,
    nombre: '',
    ubicacionFisica: '',
    estatus: 0,
    desEstatus: '',
    nombreSector: '',
    idSector: 0,
    totalOportunidades: 0,
    proceso:0,
    ganadas: 0,
    perdidas: 0,
    canceladas: 0,
    eliminadas: 0,
    idEmpresa: 0,
    };
  this.insertar = true;
  this.modalVisible = true;
}
actualiza(licencia: Prospectos) {
  this.prospectoSeleccionado = licencia;
  this.insertar = false;
  this.modalVisible = true;
}
getVisibleTotal(campo: string, dt: any): number {
  const registrosVisibles = dt.filteredValue
    ? dt.filteredValue
    : this.prospectos;
  if (campo === 'nombreSector') {
    return registrosVisibles.length; // Retorna el número de registros visibles
  }
  return registrosVisibles.reduce(
    (acc: number, empresa: Prospectos) =>
      acc + Number(empresa[campo as keyof Prospectos] || 0),
    0
  );
}
// metodos moda
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
    this.getProspectos();
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Se ha producido un error.',
      detail: result.errorMessage,
    });
  }
}
clear(table: Table) {
      table.clear();
      this.getProspectos();
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
      dialogConfig.width = '350px';
  
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
      let colsIgnorar: any[] = [];
    
      let dataExport = (table.filteredValue || table.value || []);

      let lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
      let columnasAMostrarKeys = lsColumnasAMostrar.map(col => col.key);
    
      dataExport = dataExport.map(row => {
        return columnasAMostrarKeys.reduce((acc, key) => {
          acc[key] = row[key];
          return acc;
        }, {});
      });
    
      import('xlsx').then(xlsx => {
        const hojadeCalculo: import('xlsx').WorkSheet = xlsx.utils.json_to_sheet(dataExport);
        const libro: import('xlsx').WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Prospectos");
        xlsx.writeFile(libro, "Prospectos.xlsx");
      });
    }
  
    getTotalCostPrimeNg(table: Table, def: any) {
      if (def.key == 'nombre') {
        return 'Total';
      }
  
      if (!def.isTotal) {
        return
      }
  
      if (table.filteredValue !== null && table.filteredValue !== undefined) {
        return sumBy(this.dt.filteredValue, def.key)
      }
  
      return sumBy(this.prospectos, def.key)
    }
  
    obtenerArregloFiltros(data: any[], columna: string): any[] {
      const lsGroupBy = groupBy(data, columna);
      return sortBy(getKeys(lsGroupBy));
    }
  


}
