import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnasDisponiblesComponent } from '../../shared/columnas-disponibles/columnas-disponibles.component';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from "lodash-es";
import { OportunidadesPerdidasService } from '../../../services/oportunidades-perdidas.service';
import { OportunidadPerdida } from '../../../interfaces/oportunidades-perdidas';


@Component({
  selector: 'app-oportunidades-perdidas',
  standalone: false,
  templateUrl: './oportunidades-perdidas.component.html',
  styleUrl: './oportunidades-perdidas.component.css'
})
export class OportunidadesPerdidasComponent {
  @ViewChild('dt') dt!: Table;

  disableOportunidades = true;
  isDescargando = false;
  anchoTabla = 100;//porciento

  oportunidadesperdidas: OportunidadPerdida[] = [];
  oportunidadesperdidasOriginal: OportunidadPerdida[] = [];
  oportunidadperdidaSeleccionada!: OportunidadPerdida;

  idUsuario: number = 1;
  idEstatus: number = 1;

  insertar: boolean = false;
  modalVisible: boolean = false;

  loading: boolean = true;

  lsColumnasAMostrar: any[] = [
   
  ];

  lsTodasColumnas: any[] = [
    { key: 'idoportunidad', isCheck: true, valor: 'ID', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'prospecto', isCheck: true, valor: 'Prospecto', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'oportunidad', isCheck: true, valor: 'Oportunidad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'tipo', isCheck: true, valor: 'Tipo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'ejecutivo', isCheck: true, valor: 'Ejecutivo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'monto', isCheck: true, valor: 'Monto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    { key: 'fechainicio', isCheck: true, valor: 'Fecha de Inicio', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'cierrestimado', isCheck: true, valor: 'Cierre Estimado', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'fechadecierre', isCheck: true, valor: 'Fecha de Cierre', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'diasfunnel', isCheck: true, valor: 'Días en Funnel', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'ultimocomentario', isCheck: true, valor: 'Último Comentario', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' }
  ];

  columnsAMostrarResp: string = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp: string = JSON.stringify(this.lsTodasColumnas);

  constructor(private oportunidadService: OportunidadesService, private messageService: MessageService, private cdr: ChangeDetectorRef,
      private readonly loginService: LoginService, public dialog: MatDialog
    ) { }

    ngOnInit(): void {
      this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
      this.getOportunidadesPerdidas();

      document.documentElement.style.fontSize = 12 + 'px';
    }

    getOportunidadesPerdidas() {
      this.oportunidadService.getOportunidadesPerdidas(this.idUsuario, this.loginService.obtenerIdEmpresa(), this.idEstatus).subscribe({
        next: (result: OportunidadPerdida[]) => {
          this.oportunidadesperdidas = [...result];
          this.oportunidadesperdidasOriginal = result;
          this.cdr.detectChanges(); 
          this.loading = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: error.errorMessage,
          });
          this.loading = false;
        },
      });
    }

    actualiza(licencia: OportunidadPerdida) {
      this.oportunidadperdidaSeleccionada = licencia;
      this.insertar = false;
      this.modalVisible = true;
    }

    getVisibleTotal(campo: string, dt: any): number {
      const registrosVisibles = dt.filteredValue
        ? dt.filteredValue
        : this.oportunidadesperdidas;
      if (campo === 'nombre') {
        return registrosVisibles.length; 
      }
      return registrosVisibles.reduce(
        (acc: number, empresa: OportunidadPerdida) =>
          acc + Number(empresa[campo as keyof OportunidadPerdida] || 0),
        0
      );
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
        this.getOportunidadesPerdidas();
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
      this.getOportunidadesPerdidas();
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
  
      dialogRef.afterClosed().subscribe((r: any[]) => {

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
        xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Oportunidades Perdidas");
        xlsx.writeFile(libro, "Oportunidades Perdidas.xlsx");
      });
    }

    getTotalCostPrimeNg(table: Table, def: any) {
      if (def.key == 'nombreCompleto') {
        return 'Total';
      }
  
      if (!def.isTotal) {
        return
      }
  
      if (table.filteredValue !== null && table.filteredValue !== undefined) {
        return sumBy(this.dt.filteredValue, def.key)
      }
  
      return sumBy(this.oportunidadesperdidas, def.key)
    }
  
    obtenerArregloFiltros(data: any[], columna: string): any[] {
      const lsGroupBy = groupBy(data, columna);
      return sortBy(getKeys(lsGroupBy));
    }

}
