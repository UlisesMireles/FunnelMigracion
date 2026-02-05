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
import { EnumTablas } from '../../../enums/enumTablas';
import { ConfiguracionTablaService } from '../../../services/configuracion-tabla.service';

@Component({
  selector: 'app-estadisticas-por-etapa',
  standalone: false,
  templateUrl: './estadisticas-por-etapa.component.html',
  styleUrl: './estadisticas-por-etapa.component.css'
})
export class EstadisticasPorEtapaComponent {
  @ViewChild('dt') dt!: Table;

  disableOportunidades = true;
  isDescargando = false;
  anchoTabla = 100;//porciento

  oportunidades: Oportunidad[] = [];
  oportunidadesOriginal: Oportunidad[] = [];
  oportunidadSeleccionada!: Oportunidad;

  idEstatus: number = 1;

  loading: boolean = true;

  columnsToAverage = ['diasFunnel', 'diasEtapa1', 'diasEtapa2', 'diasEtapa3', 'diasEtapa4', 'diasEtapa5'];

  lsColumnasAMostrar: any[] = [

  ];

  lsTodasColumnas: any[] = [];

  columnsAMostrarResp: string = '';
  columnsTodasResp: string = '';
  disabledPdf: boolean = false;

  constructor(private oportunidadService: OportunidadesService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService, public dialog: MatDialog, private readonly configuracionColumnasService: ConfiguracionTablaService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);

    this.configuracionColumnasService.obtenerColumnasAMostrar(EnumTablas.EstadisticasPorEtapa).subscribe({
      next: ({ todas, mostrar }) => {
        this.lsTodasColumnas = todas;
        this.lsColumnasAMostrar = mostrar;
        this.columnsAMostrarResp = JSON.stringify(this.lsColumnasAMostrar);
        this.columnsTodasResp = JSON.stringify(this.lsTodasColumnas);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar configuración de columnas',
          detail: error.errorMessage,
        });
      }
    });
    this.getOportunidades();
    document.documentElement.style.fontSize = 12 + 'px';
  }

  getOportunidades() {
    const idProceso = Number(localStorage.getItem('idProceso'));
    this.oportunidadService.getOportunidades(this.loginService.obtenerIdEmpresa(), this.loginService.obtenerIdUsuario(), this.idEstatus, idProceso).subscribe({
      next: (result: Oportunidad[]) => {
        // Ordenar por fechaRegistro (de más reciente a más antigua)
        const oportunidadesOrdenadas = result.sort((a, b) => {
          // Manejar casos donde las fechas podrían ser null/undefined
          const fechaA = a.fechaRegistro ? new Date(a.fechaRegistro).getTime() : 0;
          const fechaB = b.fechaRegistro ? new Date(b.fechaRegistro).getTime() : 0;

          // Orden descendente (más reciente primero)
          return fechaB - fechaA;
        });

        this.oportunidades = [...oportunidadesOrdenadas];
        this.oportunidadesOriginal = [...oportunidadesOrdenadas];
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
    dialogConfig.width = '50px';

    dialogConfig.data = {
      todosColumnas: this.lsTodasColumnas
    };

    dialogConfig.position = {
      top: targetAttr.y + targetAttr.height + 10 + "px",
      left: targetAttr.x - targetAttr.width - 250 + "px"
    };
    const dialogRef = this.dialog.open(ColumnasDisponiblesComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.lsColumnasAMostrar = r.filter((f: any) => f.isCheck);
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
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Estadísticas Por Etapa");
      xlsx.writeFile(libro, "Estadísticas Por Etapa.xlsx");
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
      empresa: this.loginService.obtenerEmpresa()
    }

    if (dataExport.length == 0)
      return

    this.disabledPdf = true;

    this.oportunidadService.descargarReporteOportunidadesPorEtapa(data, this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'EstadisticasPorEtapa.pdf';
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
        this.loading = false;
        this.disabledPdf = false;
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

  getColorForFechaEstimadaCierre(fechaEstimadaCierreOriginal: string): string {
    const hoy = new Date();
    const fechaCierre = new Date(fechaEstimadaCierreOriginal);

    const diferencia = fechaCierre.getTime() - hoy.getTime();
    const diasDiferencia = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

    if (diasDiferencia < 0) {
      return 'red';
    } else if (diasDiferencia <= 30) {
      return 'orange';
    } else if (diasDiferencia <= 60) {
      return 'green';
    } else {
      return 'black';
    }
  }

  getColorForDiasSinActividad(dias: number): string {
    if (dias >= 0 && dias <= 5) {
      return 'green';
    } else if (dias >= 6 && dias <= 10) {
      return 'orange';
    } else if (dias >= 11) {
      return 'red';
    } else {
      return 'black';
    }
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
      nombreEjecutivo: '100%',
      nombreContacto: '100%',
      fechaRegistro: '100%',
      diasFunnel: '100%',
      fechaModificacion: '100%',
      diasEtapa1: '100%',
      diasEtapa2: '100%',
      diasEtapa3: '100%',
      diasEtapa4: '100%',
      diasEtapa5: '100%',
    };
    return { width: widths[key] || 'auto' };
  }

  getAverage(columnKey: 'diasFunnel' | 'diasEtapa1' | 'diasEtapa2' | 'diasEtapa3' | 'diasEtapa4' | 'diasEtapa5'): number {
    if (!this.oportunidades || this.oportunidades.length === 0) return 0;

    const sum = this.oportunidades.reduce((acc, curr) => {
      return acc + (curr[columnKey] || 0);
    }, 0);

    return sum / this.oportunidades.length;
  }

  isSorted(columnKey: string): boolean {
    return this.dt?.sortField === columnKey;
  }

  getNombreEtapa(numeroEtapa: number): string {
    const etapas: { [key: number]: string } = {
      1: 'Calificación de Prospectos',
      2: 'Investigación de Necesidades',
      3: 'Elaboración de Propuestas',
      4: 'Presentación de Propuestas',
      5: 'Negociación'
    };
    return etapas[numeroEtapa] || 'Etapa desconocida';
  }
}