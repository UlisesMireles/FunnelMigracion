import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';
import{ ProspectoService } from '../../../services/prospecto.service';
import { ClientesTopVeinte } from '../../../interfaces/prospecto';
import { LoginService } from '../../../services/login.service';
import { ColumnasDisponiblesComponent } from '../../utils/tablas/columnas-disponibles/columnas-disponibles.component';

@Component({
  selector: 'app-top-veinte',
  standalone: false,
  templateUrl: './top-veinte.component.html',
  styleUrl: './top-veinte.component.css'
})
export class TopVeinteComponent {
  @ViewChild('dt')
  dt!: Table ;


  disableProspectos = true;
  isDescargando = false;
  anchoTabla = 100;
  topveinte: ClientesTopVeinte[] = [];
  TopVeinteOriginal: ClientesTopVeinte[] = [];
  TopVeinteSeleccionado!: ClientesTopVeinte;


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
    { key: 'nombre', isCheck: true, valor: 'Nombre', groupHeader: '', isIgnore: false, tipoFormato: 'text' },
    { key: 'nombreSector', isCheck: true, valor: 'Sector de la industria', groupHeader: '', isIgnore: false, tipoFormato: 'text' },
    { key: 'ubicacionFisica', isCheck: true, valor: 'Ubicación Física', groupHeader: '', isIgnore: false, tipoFormato: 'text' },
    { key: 'totalOportunidades', isCheck: true, valor: 'Oportunidades Totales', groupHeader: '', isIgnore: false, tipoFormato: 'number' },
    { key: 'ganadas', isCheck: true, valor: 'Total Ganadas', groupHeader: 'Ganadas', isIgnore: false, tipoFormato: 'number', colspan: 1, isSubHeader: true },
    { key: 'porcGanadas', isCheck: true, valor: '% Ganadas', groupHeader: 'Ganadas', isIgnore: false, tipoFormato: 'percent', colspan: 1, isSubHeader: true },
    { key: 'perdidas', isCheck: true, valor: 'Total Perdidas', groupHeader: 'Perdidas', isIgnore: false, tipoFormato: 'number', colspan: 1, isSubHeader: true },
    { key: 'porcPerdidas', isCheck: true, valor: '% Perdidas', groupHeader: 'Perdidas', isIgnore: false, tipoFormato: 'percent', colspan: 1, isSubHeader: true },
    { key: 'canceladas', isCheck: true, valor: 'Total Canceladas', groupHeader: 'Canceladas', isIgnore: false, tipoFormato: 'number', colspan: 1, isSubHeader: true },
    { key: 'porcCanceladas', isCheck: true, valor: '% Canceladas', groupHeader: 'Canceladas', isIgnore: false, tipoFormato: 'percent', colspan: 1, isSubHeader: true },
    { key: 'eliminadas', isCheck: true, valor: 'Total Eliminadas', groupHeader: 'Eliminadas', isIgnore: false, tipoFormato: 'number', colspan: 1, isSubHeader: true },
    { key: 'porcEliminadas', isCheck: true, valor: '% Eliminadas', groupHeader: 'Eliminadas', isIgnore: false, tipoFormato: 'percent', colspan: 1, isSubHeader: true },
    { key: 'proceso', isCheck: true, valor: 'En Proceso', groupHeader: '', isIgnore: false, tipoFormato: 'number' },
    { key: 'desEstatus', isCheck: true, valor: 'Estatus', groupHeader: '', isIgnore: false, tipoFormato: 'estatus' }
  ];
  

  columnsAMostrarResp = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp = JSON.stringify(this.lsTodasColumnas);

  constructor( private messageService: MessageService, private cdr: ChangeDetectorRef, private prospectoService: ProspectoService, private loginService: LoginService, public dialog: MatDialog) { }

  ngOnInit(): void {
  this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
  this.getTopVeinte();
  document.documentElement.style.fontSize = 12 + 'px';
  }
    
  getTopVeinte() {
    this.prospectoService.getTopVeinte(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: ClientesTopVeinte[]) => {
        this.TopVeinteOriginal = result;
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
  
    this.topveinte = this.selectedEstatus === null
      ? [...this.TopVeinteOriginal]
      : [...this.TopVeinteOriginal.filter((x) => x.desEstatus === this.selectedEstatus)];
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
      this.getTopVeinte();
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
        this.getTopVeinte();
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
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Clientes Top 20");
      xlsx.writeFile(libro, "Clientes Top 20.xlsx");
    });
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
        porcGanadas: '100%',
        perdidas: '100%',
        porcPerdidas: '100%',
        canceladas: '100%',
        porcCanceladas: '100%',
        eliminadas: '100%',
        porcEliminadas: '100%',
        desEstatus: '100%'
    };
    return { width: widths[key] || 'auto' }; 
  }

}