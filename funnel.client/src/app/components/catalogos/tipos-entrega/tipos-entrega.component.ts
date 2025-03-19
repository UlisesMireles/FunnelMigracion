import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TipoEntrega} from '../../../interfaces/tipo-entrega';
import { TipoEntregaService } from '../../../services/tipo-entrega.service';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ColumnasDisponiblesComponent } from '../../shared/columnas-disponibles/columnas-disponibles.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';

import { LoginService } from '../../../services/login.service';
@Component({
  selector: 'app-tipos-entrega',
  standalone: false,
  templateUrl: './tipos-entrega.component.html',
  styleUrl: './tipos-entrega.component.css'
})
export class TiposEntregaComponent {
  @ViewChild('dt') dt!: Table;

  tiposEntrega: TipoEntrega[] = [];
  tiposEntregaOriginal: TipoEntrega[] = [];
  tiposEntregaSeleccionado!: TipoEntrega;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;
  insertar: boolean = false;
  modalVisible: boolean = false;

  anchoTabla = 100
  isDescargando = false;
  disabletiposEntrega = true;

  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [
    {key:'descripcion', isCheck: true, valor: 'Descripción', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'abreviatura', isCheck: true, valor: 'Abreviatura', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text'},
    {key: 'desEstatus', isCheck: true, valor: 'Estatus', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'estatus'},
  ];
  columnsAMostrarResp = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp = JSON.stringify(this.lsTodasColumnas);

  constructor(private tipoEntregaService: TipoEntregaService, private messageService: MessageService, private cdr: ChangeDetectorRef, private loginService:LoginService, public dialog: MatDialog) { }

ngOnInit(): void {
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.getTiposEntrega();
    document.documentElement.style.fontSize = 12 + 'px';
  }
 
  getTiposEntrega(idEmpresa: number = 1) {
    this.tipoEntregaService.getTiposEntrega(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: TipoEntrega[]) => {
        this.tiposEntregaOriginal = result;
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

  
  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue
      ? dt.filteredValue
      : this.tiposEntrega;
    if (campo === 'descripcion') {
      return registrosVisibles.length; 
    }
    return registrosVisibles.reduce(
      (acc: number, _tipoEntrega: TipoEntrega) =>
        acc + Number(_tipoEntrega[campo as keyof TipoEntrega] || 0),
      0
    );
  }
  FiltrarPorEstatus() {
    this.tiposEntrega = this.selectedEstatus === null
      ? [...this.tiposEntregaOriginal]
      : [...this.tiposEntregaOriginal.filter((x) => x.desEstatus.toString() === this.selectedEstatus)];
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
      this.getTiposEntrega();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }

  inserta() {
    this.tiposEntregaSeleccionado = {
      idTipoEntrega: 0,
      descripcion: '',
      estatus: 0,
      abreviatura: '',
      idEmpresa: 0,
      fechaModificacion: '',
      desEstatus: '',
    };
    this.insertar = true;
    this.modalVisible = true;
  }
 
  actualiza(licencia: TipoEntrega) {
    this.tiposEntregaSeleccionado = licencia;
    this.insertar = false;
    this.modalVisible = true;
  }


clear(table: Table) {
      table.clear();
      this.getTiposEntrega();
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
        xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Tipos Entrega");
        xlsx.writeFile(libro, "Tipos Entrega.xlsx");
      });
    }
  
    getTotalCostPrimeNg(table: Table, def: any) {
          if (def.key == 'nombre') {
            return '';
          }
      
          if (!def.isTotal) {
            return
          }
      
          if (table.filteredValue !== null && table.filteredValue !== undefined) {
            return sumBy(this.dt.filteredValue, def.key)
          }
      
          return sumBy(this.tiposEntrega, def.key)
        }
  
    obtenerArregloFiltros(data: any[], columna: string): any[] {
      const lsGroupBy = groupBy(data, columna);
      return sortBy(getKeys(lsGroupBy));
    }
  


}

