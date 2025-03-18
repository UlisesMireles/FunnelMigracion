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
  selector: 'app-oportunidades',
  standalone: false,
  templateUrl: './oportunidades.component.html',
  styleUrl: './oportunidades.component.css'
})
export class OportunidadesComponent {

  @ViewChild('dt') dt!: Table;

  disableOportunidades = true;
  isDescargando = false;
  anchoTabla = 100;//porciento

  oportunidades: Oportunidad[] = [];
  oportunidadesOriginal: Oportunidad[] = [];
  oportunidadSeleccionada!: Oportunidad;

  idUsuario: number = 1;
  idEstatus: number = 1;

  insertar: boolean = false;
  modalVisible: boolean = false;

  loading: boolean = true;

  lsColumnasAMostrar: any[] = [
   
  ];

  lsTodasColumnas: any[] = [
    { key: 'nombre', isCheck: true, valor: 'Nombre', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreSector', isCheck: true, valor: 'Sector', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreOportunidad', isCheck: true, valor: 'Oportunidad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'abreviatura', isCheck: true, valor: 'Abreviatura', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'stage', isCheck: true, valor: 'Etapa', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreEjecutivo', isCheck: true, valor: 'Ejecutivo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreContacto', isCheck: true, valor: 'Contacto', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'entrega', isCheck: true, valor: 'Entrega', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'monto', isCheck: true, valor: 'Monto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    { key: 'probabilidadOriginal', isCheck: false, valor: 'Prob Original', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'probabilidad', isCheck: true, valor: 'Prob', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'montoNormalizado', isCheck: true, valor: 'Monto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    { key: 'fechaRegistro', isCheck: true, valor: 'Fecha Registro', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'diasFunnel', isCheck: false, valor: 'Días en Funnel', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'fechaEstimadaCierreOriginal', isCheck: false, valor: 'Fecha Estimada de Cierre', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'fechaModificacion', isCheck: false, valor: 'Fecha de Modificación', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' }
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
      this.oportunidadService.getOportunidades(this.idUsuario, this.loginService.obtenerIdEmpresa(), this.idEstatus).subscribe({
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

    inserta() {
      this.oportunidadSeleccionada = {
        
      };
      this.insertar = true;
      this.modalVisible = true;
    }
    
    actualiza(licencia: Oportunidad) {
      this.oportunidadSeleccionada = licencia;
      this.insertar = false;
      this.modalVisible = true;
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
        xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Oportunidades en proceso");
        xlsx.writeFile(libro, "Oportunidades en proceso.xlsx");
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
