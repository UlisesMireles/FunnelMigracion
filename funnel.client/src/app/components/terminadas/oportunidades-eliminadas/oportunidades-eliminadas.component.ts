import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { OportunidadesService } from '../../../services/oportunidades.service';
import { Oportunidad } from '../../../interfaces/oportunidades';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnasDisponiblesComponent } from '../../utils/tablas/columnas-disponibles/columnas-disponibles.component';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from "lodash-es";

@Component({
  selector: 'app-oportunidades-eliminadas',
  standalone: false,
  templateUrl: './oportunidades-eliminadas.component.html',
  styleUrl: './oportunidades-eliminadas.component.css'
})
export class OportunidadesEliminadasComponent {
  @ViewChild('dt') dt!: Table;

  disableOportunidades = true;
  isDescargando = false;
  anchoTabla = 100;

  oportunidades: Oportunidad[] = [];
  oportunidadesOriginal: Oportunidad[] = [];
  oportunidadSeleccionada!: Oportunidad;

  idEstatus: number = 5;

  insertar: boolean = false;
  modalVisible: boolean = false;
  modalSeguimientoVisible: boolean = false; 
  seguimientoOportunidad: boolean = false;
  modalDocumentosVisible: boolean = false;


  years: string[] = [];
  selectedYear: string = new Date().getFullYear().toString();

  loading: boolean = true;

  lsColumnasAMostrar: any[] = [
   
  ];

  lsTodasColumnas: any[] = [
    { key: 'idOportunidad', isCheck: false, valor: 'Id', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombre', isCheck: true, valor: 'Prospecto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreSector', isCheck: false, valor: 'Sector', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreOportunidad', isCheck: true, valor: 'Oportunidad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'abreviatura', isCheck: true, valor: 'Tipo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'stage', isCheck: false, valor: 'Etapa', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'iniciales', isCheck: true, valor: 'Ejecutivo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreEjecutivo', isCheck: false, valor: 'Ejecutivo', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'monto', isCheck: true, valor: 'Monto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    { key: 'probabilidad', isCheck: false, valor: 'Probabilidad', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'fechaRegistro', isCheck: true, valor: 'Fecha Inicio', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'fechaEstimadaCierre', isCheck: true, valor: 'Fecha Cierre', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'fechaEstimadaCierreOriginal', isCheck: false, valor: 'Cierre Estimado', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'diasFunnelOriginal', isCheck: true, valor: 'Días Funnel', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'comentario', isCheck: false, valor: 'Último Comentario', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'diasEtapa1', isCheck: true, valor: 'Etapa 1', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'number' },
    { key: 'diasEtapa2', isCheck: true, valor: 'Etapa 2', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'number' },
    { key: 'diasEtapa3', isCheck: true, valor: 'Etapa 3', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'number' },
    { key: 'diasEtapa4', isCheck: true, valor: 'Etapa 4', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'number' },
    { key: 'diasEtapa5', isCheck: true, valor: 'Etapa 5', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'number' },
  ];

  columnsAMostrarResp: string = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp: string = JSON.stringify(this.lsTodasColumnas);

  constructor(private oportunidadService: OportunidadesService, private messageService: MessageService, private cdr: ChangeDetectorRef,
      private readonly loginService: LoginService, public dialog: MatDialog
    ) { }

    ngOnInit(): void {
      this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
      this.getOportunidades();

      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= 2020; year--) {
        this.years.push(year.toString());
      }
      this.years.unshift("Todos los Años");

      document.documentElement.style.fontSize = 12 + 'px';
    }


    filterByYear() {
      if (this.oportunidadesOriginal) {
        this.oportunidades = this.oportunidadesOriginal.filter(oportunidad => {
          if(!this.esNumero(this.selectedYear))
            return true
          else if (oportunidad.fechaEstimadaCierre) {
            const fechaRegistro = new Date(oportunidad.fechaEstimadaCierre);
            return fechaRegistro.getFullYear().toString() === this.selectedYear;
          }
          else
            return false;
        });
      }
    }


    getOportunidades() {
      this.oportunidadService.getOportunidades(this.loginService.obtenerIdEmpresa(), this.loginService.obtenerIdUsuario(), this.idEstatus).subscribe({
        next: (result: Oportunidad[]) => {

          const oportunidadesOrdenadas = sortBy(result, (o) =>
            o.fechaEstimadaCierre ? new Date(o.fechaEstimadaCierre) : new Date('2100-01-01')
          ).reverse();
          
          this.oportunidades = [...oportunidadesOrdenadas];
          this.oportunidadesOriginal =  oportunidadesOrdenadas;
          this.filterByYear();
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
    actualiza(licencia: Oportunidad) {
      this.oportunidadSeleccionada = licencia;
      this.insertar = false;
      this.modalVisible = true;
    }

    seguimiento(licencia: Oportunidad) {
      this.oportunidadSeleccionada = licencia;
      this.seguimientoOportunidad = true;
      this.modalSeguimientoVisible = true;
    }

    documento(licencia: Oportunidad) {
      this.oportunidadSeleccionada = licencia;
      this.seguimientoOportunidad = true;
      this.modalDocumentosVisible = true;
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
        this.getOportunidades();
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
      this.getOportunidades();
      this.lsColumnasAMostrar = JSON.parse(this.columnsAMostrarResp);
      this.lsTodasColumnas = JSON.parse(this.columnsTodasResp);
      this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
      this.anchoTabla = 100;
      this.selectedYear = new Date().getFullYear().toString();
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
        xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Oportunidades Ganadas");
        xlsx.writeFile(libro, "Oportunidades ganadas.xlsx");
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
        datos: dataExport,
        anio: this.selectedYear
      }
  
      if (dataExport.length == 0)
        return
  
  
      this.oportunidadService.descargarReporteOportunidadesEliminadas(data).subscribe({
        next: (result: Blob) => {
          const url = window.URL.createObjectURL(result);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'OportunidadesEliminadas.pdf';
          link.click();
          URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error al generar reporte',
            detail: error.errorMessage,
          });
          this.loading = false;
        },
      });
  
    }
  
    getTotalCostPrimeNg(table: Table, def: any) {
      if (def.key == 'nombreCompleto') {
        return 'Total';
      }
  
      if (!def.isTotal) {
        return;
      }

      const registrosVisibles = table.filteredValue ? table.filteredValue : this.oportunidades;
    
      if (def.key === 'nombre' || def.key === 'idOportunidad') {
        return registrosVisibles.length;
      }
    
      if (def.tipoFormato === 'currency') {
        return registrosVisibles.reduce(
          (acc: number, empresa: Oportunidad) =>
            acc + (Number(empresa[def.key as keyof Oportunidad]) || 0),
          0
        );
      }

      return (
        registrosVisibles.reduce(
          (acc: number, empresa: Oportunidad) =>
            acc + (Number(empresa[def.key as keyof Oportunidad]) || 0),
          0
        ) / registrosVisibles.length
      );
    }

    getVisibleTotal(campo: string, dt: any): number {
      const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.oportunidades;
    
      if (campo === 'nombre') {
        return registrosVisibles.length;
      }
    
      return registrosVisibles.reduce(
        (acc: number, empresa: Oportunidad) =>
          acc + (Number(empresa[campo as keyof Oportunidad] || 0)),
        0
      );
    }
  
    obtenerArregloFiltros(data: any[], columna: string): any[] {
      const lsGroupBy = groupBy(data, columna);
      return sortBy(getKeys(lsGroupBy));
    }

    getColumnWidth(key: string): object {
      const widths: { [key: string]: string } = {
          idOportunidad: '100%',
          nombre: '100%',
          
          nombreSector: '100%',
          nombreOportunidad: '100%',
          abreviatura: '100%',
          stage: '100%',
          iniciales: '100%',
          monto: '100%',
          probabilidad: '100%',
          fechaRegistro: '100%',
          diasFunnel: '100%',
          fechaEstimadaCierreOriginal: '100%',
          comentario: '100%',
      };
      return { width: widths[key] || 'auto' };
  }
  isSorted(columnKey: string): boolean {
    
    return this.dt?.sortField === columnKey;
}
  esNumero(cadena: string): boolean {
    return !isNaN(Number(cadena)) && cadena.trim() !== '';
  }
}
