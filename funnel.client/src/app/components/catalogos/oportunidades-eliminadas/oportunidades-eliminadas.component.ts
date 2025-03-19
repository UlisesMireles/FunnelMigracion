import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { OportunidadesService } from '../../../services/oportunidades.service';
import { Oportunidad } from '../../../interfaces/oportunidades';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnasDisponiblesComponent } from '../../shared/columnas-disponibles/columnas-disponibles.component';
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
  anchoTabla = 100;//porciento

  oportunidades: Oportunidad[] = [];
  oportunidadesOriginal: Oportunidad[] = [];
  oportunidadSeleccionada!: Oportunidad;

  idEstatus: number = 5;

  insertar: boolean = false;
  modalVisible: boolean = false;
  modalSeguimientoVisible: boolean = false; 
  seguimientoOportunidad: boolean = false;

  loading: boolean = true;

  lsColumnasAMostrar: any[] = [
   
  ];

  lsTodasColumnas: any[] = [
    { key: 'idOportunidad', isCheck: true, valor: 'Id', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombre', isCheck: true, valor: 'Nombre', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreSector', isCheck: false, valor: 'Sector', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreOportunidad', isCheck: true, valor: 'Oportunidad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'abreviatura', isCheck: true, valor: 'Abreviatura', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'stage', isCheck: false, valor: 'Etapa', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreEjecutivo', isCheck: true, valor: 'Ejecutivo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'monto', isCheck: true, valor: 'Monto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    { key: 'probabilidad', isCheck: false, valor: 'Probabilidad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'fechaRegistro', isCheck: true, valor: 'Fecha Registro', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'diasFunnel', isCheck: true, valor: 'Días en Funnel', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'fechaEstimadaCierreOriginal', isCheck: true, valor: 'Fecha Cierre', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'comentario', isCheck: true, valor: 'Comentario', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
  ];

  columnsAMostrarResp: string = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp: string = JSON.stringify(this.lsTodasColumnas);

  constructor(private oportunidadService: OportunidadesService, private messageService: MessageService, private cdr: ChangeDetectorRef,
      private readonly loginService: LoginService, public dialog: MatDialog
    ) { }

    ngOnInit(): void {
      this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
      this.getOportunidades();

      document.documentElement.style.fontSize = 12 + 'px';
    }


    getOportunidades() {
      this.oportunidadService.getOportunidades(this.loginService.obtenerIdEmpresa(), this.loginService.obtenerIdUsuario(), this.idEstatus).subscribe({
        next: (result: Oportunidad[]) => {
          this.oportunidades = [...result];
          this.oportunidadesOriginal = result;
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
        xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Oportunidades Ganadas");
        xlsx.writeFile(libro, "Oportunidades ganadas.xlsx");
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
}
