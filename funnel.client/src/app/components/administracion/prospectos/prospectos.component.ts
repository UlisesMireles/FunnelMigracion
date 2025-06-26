import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
//PrimeNG
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ColumnasDisponiblesComponent } from '../../utils/tablas/columnas-disponibles/columnas-disponibles.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';
import{ ProspectoService } from '../../../services/prospecto.service';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { Prospectos } from '../../../interfaces/prospecto';
import { LoginService } from '../../../services/login.service';
import { ModalOportunidadesService } from '../../../services/modalOportunidades.service';
import { Subscription } from 'rxjs';
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
  prospectoEdicion: Prospectos | null = null;

  loading: boolean = true;
  insertar: boolean = false;
  modalVisible: boolean = false;
  selectedEstatus: any = null;
  desdeSector = false;

EstatusDropdown = [
  { label: 'Todo', value: null },
  { label: 'Activo', value: 'Activo' },
  { label: 'Inactivo', value: 'Inactivo' },
];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [
    {key:'nombre', isCheck: true, valor: 'Prospecto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text'},
    {key: 'nombreSector', isCheck: true, valor: 'Sector', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'ubicacionFisica', isCheck: true, valor: 'Ubicación Física', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'totalOportunidades', isCheck: true, valor: 'Op/todas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number'},
    {key: 'ganadas', isCheck: true, valor: 'Ganadas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number'},
    {key: 'porcEfectividad', isCheck: true, valor: '% Efectividad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'decimal'},
    {key: 'proceso', isCheck: false, valor: 'En Proceso', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number'},
    {key: 'perdidas', isCheck: false, valor: 'Perdidas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number'},
    {key: 'canceladas', isCheck: false, valor: 'Canceladas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number'},
    {key: 'eliminadas', isCheck: false, valor: 'Eliminadas', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number'},
    {key: 'desEstatus', isCheck: true, valor: 'Estatus', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'estatus'}
  ];

  columnsAMostrarResp = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp = JSON.stringify(this.lsTodasColumnas);
  private modalSubscription!: Subscription;
  disabledPdf: boolean = false;

  constructor( private messageService: MessageService, private cdr: ChangeDetectorRef, private prospectoService: ProspectoService, private loginService: LoginService, public dialog: MatDialog, private modalOportunidadesService: ModalOportunidadesService) { }

ngOnInit(): void {
  this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
  this.getProspectos();
  document.documentElement.style.fontSize = 12 + 'px';
  this.modalSubscription = this.modalOportunidadesService.modalProspectoState$.subscribe((state) => {
    this.desdeSector = state.desdeSector;
    this.insertar = state.insertar;
    if (!state.showModal) {
      this.prospectoEdicion = null;
    }
    //Valida si se emite un result Exitoso desde modal
    if (state.result.id != -1 && state.result.result) {
      this.getProspectos();
    }
  });
}

ngOnDestroy(): void {
  if (this.modalSubscription) {
    this.modalSubscription.unsubscribe();  // Desuscribimos al destruir el componente
  }
}
  
getProspectos() {
  this.prospectoService.getProspectos(this.loginService.obtenerIdEmpresa()).subscribe({
    next: (result: Prospectos[]) => {
      this.prospectosOriginal = result.sort((a, b) => b.totalOportunidades - a.totalOportunidades);
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
  
  this.prospectos.sort((a, b) => b.totalOportunidades - a.totalOportunidades);
  
  if (this.dt) {
    this.dt.first = 0;
    this.dt.sortField = 'totalOportunidades';
    this.dt.sortOrder = -1; 
    this.dt.reset(); 
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
    porcEfectividad: 0,};
  this.modalOportunidadesService.openModalProspecto(true, true, [], this.prospectoSeleccionado)
  this.insertar = true;
  this.modalVisible = true;
}
actualiza(licencia: Prospectos) {
  this.modalOportunidadesService.openModalProspecto(true, false, [], licencia, { errorMessage: '', result: false, id: -1 }, false);
  this.prospectoSeleccionado = licencia;
  this.prospectoEdicion = { ...licencia };
  this.insertar = false;
  this.modalVisible = true;
}

// metodos moda
onModalClose() {
  this.modalVisible = false;
  this.prospectoEdicion = null;
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
      dialogConfig.width = '50px';
  
      dialogConfig.data = {
        todosColumnas: this.lsTodasColumnas,
        vista: 'prospectos-contactos',
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
        xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Prospectos");
        xlsx.writeFile(libro, "Prospectos.xlsx");
      });
    }

    exportPdf(table: Table) {
      let lsColumnasAMostrar = this.lsColumnasAMostrar.filter(col => col.isCheck);
      let columnasAMostrarKeys = lsColumnasAMostrar.map(col => col.key);
  
      let dataExport = (table.filteredValue || table.value || []).map(row => {
        return columnasAMostrarKeys.reduce((acc, key) => {
          acc[key] = row[key];
          return acc;
        }, {} as { [key: string]: any });
      });
  
      let data = {
        columnas: lsColumnasAMostrar,
        datos: dataExport
      }
  
      if (dataExport.length == 0)
        return

      this.disabledPdf = true;
  
  
      this.prospectoService.descargarReporteProspectos(data, this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result: Blob) => {
          const url = window.URL.createObjectURL(result);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Prospectos.pdf';
          link.click();
          URL.revokeObjectURL(url);
          this.disabledPdf = false;
  
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error al generar reporte',
            detail: error.errorMessage,
          });
          this.disabledPdf = false;
        },
      });
  
    }
  
    getTotalCostPrimeNg(table: Table, def: any) {
          if (!def.isTotal) {
            return;
          }
      
          const registrosVisibles = table.filteredValue ? table.filteredValue : this.prospectos;
        
          if (def.key === 'nombre') {
            return registrosVisibles.length;
          }
      
          return (
            registrosVisibles.reduce(
              (acc: number, empresa: Prospectos) =>
                acc + (Number(empresa[def.key as keyof Prospectos]) || 0),
              0
            ) / registrosVisibles.length
          );
        }
      
        getVisibleTotal(campo: string, dt: any): number {
          const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.prospectos;
        
          if (campo === 'nombre') {
            return registrosVisibles.length;
          }
        
          return registrosVisibles.reduce(
            (acc: number, empresa: Prospectos) =>
              acc + (Number(empresa[campo as keyof Prospectos] || 0)),
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
          nombreSector: '100%',
          ubicacionFisica: '100%',
          totalOportunidades: '100%',
          proceso: '100%',
          ganadas: '100%',
          perdidas: '100%',
          canceladas: '100%',
          eliminadas: '100%',
          desEstatus: '100%',
      };
      return { width: widths[key] || 'auto' };
  }
  isSorted(columnKey: string): boolean {
    
    return this.dt?.sortField === columnKey;
}
abrirModalSector(rowData: any) {
    this.prospectoSeleccionado = rowData;
    this.prospectoEdicion = { ...rowData };
    this.insertar = false;
    this.modalVisible = true;
    this.desdeSector = true;
    this.modalOportunidadesService
      .openModalProspecto(true, false, [], rowData, { errorMessage: '', result: false, id: -1 }, true)
      .subscribe((modalResult) => {
        if (modalResult?.result.result === true) {
          this.ngOnInit();
        }
      });
  }
}
