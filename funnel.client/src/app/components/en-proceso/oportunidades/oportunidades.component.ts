import { Component, ChangeDetectorRef, OnInit, ViewChild, } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { ModalOportunidadesService } from '../../../services/modalOportunidades.service';
import { map } from 'rxjs/operators';
import { Prospectos } from '../../../interfaces/prospecto';

@Component({
  selector: 'app-oportunidades',
  standalone: false,
  templateUrl: './oportunidades.component.html',
  styleUrl: './oportunidades.component.css',
})
export class OportunidadesComponent {

  @ViewChild('dt') dt!: Table;

  disableOportunidades = true;
  isDescargando = false;
  anchoTabla = 100;//porciento

  oportunidades: Oportunidad[] = [];
  oportunidadesOriginal: Oportunidad[] = [];
  oportunidadSeleccionada!: Oportunidad;
  oportunidadEdicion: Oportunidad | null = null;

  idEstatus: number = 1;

  insertar: boolean = false;
  seguimientoOportunidad: boolean = false;
  modalVisible: boolean = false;
  modalSeguimientoVisible: boolean = false;
  modalDocumentosVisible: boolean = false;
  licencia: string = '';
  cantidadOportunidades: number = 0;
  private modalSubscription!: Subscription;

  loading: boolean = true;

  titulo: string = 'Oportunidades en Proceso';

  prospectoSeleccionado!: Prospectos;
  prospectoEdicion: Prospectos | null = null;


  lsColumnasAMostrar: any[] = [

  ];

  lsTodasColumnas: any[] = [
    { key: 'idOportunidad', isCheck: false, valor: 'Id', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombre', isCheck: true, valor: 'Prospecto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreSector', isCheck: true, valor: 'Sector', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreOportunidad', isCheck: true, valor: 'Oportunidad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'abreviatura', isCheck: true, valor: 'Tipo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'stage', isCheck: true, valor: 'Etapa', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'numberFilter' },
    { key: 'iniciales', isCheck: true, valor: 'Ejecutivo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreContacto', isCheck: true, valor: 'Contacto', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'entrega', isCheck: false, valor: 'Entrega', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'monto', isCheck: true, valor: 'Monto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    // { key: 'probabilidadOriginal', isCheck: false, valor: '% Original', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    // { key: 'probabilidad', isCheck: true, valor: '% Actual', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'probabilidadOriginal', isCheck: false, valor: '% Orig', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'textNFilter' },
    { key: 'probabilidad', isCheck: true, valor: '% Act', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'textNFilter' },
    { key: 'montoNormalizado', isCheck: true, valor: 'Vta Esperada', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    { key: 'fechaRegistro', isCheck: true, valor: 'Fecha Alta', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'diasFunnel', isCheck: true, valor: 'D. Alta', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'fechaEstimadaCierreOriginal', isCheck: true, valor: 'Cierre Est', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'fechaModificacion', isCheck: true, valor: 'D. S/Act', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' }
  ];

  columnsAMostrarResp: string = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp: string = JSON.stringify(this.lsTodasColumnas);
  disabledPdf: boolean = false;

  constructor(private oportunidadService: OportunidadesService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService, public dialog: MatDialog, private modalOportunidadesService: ModalOportunidadesService
  ) { }

  ngOnInit(): void {
    this.licencia = localStorage.getItem('licencia')!;
    this.cantidadOportunidades = Number(localStorage.getItem('cantidadOportunidades'));
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.getOportunidades();
    document.documentElement.style.fontSize = 12 + 'px';
    this.modalSubscription = this.modalOportunidadesService.modalState$.subscribe((state) => {
      if (!state.showModal) {
        this.oportunidadEdicion = null;
      }
      //Valida si se emite un result Exitoso desde modal
      if (state.result.id != -1 && state.result.result) {
        this.getOportunidades();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();  // Desuscribimos al destruir el componente
    }
  }

  getOportunidades() {
    this.oportunidadService.getOportunidades(this.loginService.obtenerIdEmpresa(), this.loginService.obtenerIdUsuario(), this.idEstatus).subscribe({
      next: (result: Oportunidad[]) => {
        // Ordenar por fechaEstimadaCierreOriginal (de más reciente a más antigua)
        const oportunidadesOrdenadas = sortBy(result, (o) =>
          o.fechaEstimadaCierreOriginal ? new Date(o.fechaEstimadaCierreOriginal).getTime() : 0
        ).reverse(); // reverse para orden descendente

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

  inserta() {
      const limite = this.cantidadOportunidades;
      const totalOportunidades = this.oportunidades.length;
      if (totalOportunidades >= limite) {
        this.messageService.add({
          severity: 'error',
          summary: 'Límite de oportunidades alcanzado',
          detail: `El límite de ${limite} oportunidades de la licencia ${this.licencia} ha sido alcanzado. Para agregar más oportunidades, considere actualizar su licencia.`,
        })
        return;
      }
      this.modalOportunidadesService.openModal(true, true, [], {})
      this.oportunidadSeleccionada = {

      };
      this.insertar = true;
      this.modalVisible = true;
  }

  seguimiento(licencia: Oportunidad) {
    this.oportunidadSeleccionada = licencia;
    this.seguimientoOportunidad = true;
    this.modalSeguimientoVisible = true;
  }

  actualiza(licencia: Oportunidad) {
    this.modalOportunidadesService.openModal(true, false, [], licencia);
    this.oportunidadSeleccionada = licencia;
    this.oportunidadEdicion = { ...licencia };
    this.insertar = false;
    this.modalVisible = true;
  }

  documento(licencia: Oportunidad) {
    this.oportunidadSeleccionada = licencia;
    this.seguimientoOportunidad = true;
    this.modalDocumentosVisible = true;
  }

  onModalClose() {
    this.modalVisible = false;
    this.oportunidadEdicion = null;
    this.modalOportunidadesService.closeModal();
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

    console.log("columnas y datos", lsColumnasAMostrar, columnasAMostrarKeys, dataExport)

    import('xlsx').then(xlsx => {
      const hojadeCalculo: import('xlsx').WorkSheet = xlsx.utils.json_to_sheet(dataExport);
      const libro: import('xlsx').WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Oportunidades en proceso");
      xlsx.writeFile(libro, "Oportunidades en proceso.xlsx");
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

    this.oportunidadService.descargarReporteOportunidadesEnProceso(data, this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'OportunidadesEnProceso.pdf';
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
      nombreOportunidad: '100%',
      abreviatura: '100%',
      stage: '100%',
      iniciales: '100%',
      nombreContacto: '100%',
      entrega: '100%',
      monto: '100%',
      probabilidadOriginal: '100%',
      probabilidad: '100%',
      montoNormalizado: '100%',
      fechaRegistro: '100%',
      diasFunnel: '100%',
      fechaEstimadaCierreOriginal: '100%',
      fechaModificacion: '100%',
    };
    return { width: widths[key] || 'auto' };
  }
  camTitulo(index: number) {
    const titulos = [
      'Oportunidades En Proceso',
      'Oportunidades Por Mes',
      'Oportunidades Por Etapa',
      'Estadística Oportunidades por Etapa'
    ];
    this.titulo = titulos[index] || 'Administración General';
  }
  isSorted(columnKey: string): boolean {

    return this.dt?.sortField === columnKey;
  }
  getFilterValue(field: string): any {
    const filter = this.dt?.filters[field];
    if (Array.isArray(filter)) {
      // If it's an array, return an empty string or a default value
      return '';
    } else {
      // If it's a single FilterMetadata object, return its value
      return filter?.value || '';
    }
  }

  onFilterChange(field: string, value: any): void {
    if (this.dt) {
      this.dt.filter(value, field, 'contains');
    }
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

  abrirModalSector(rowData: any) {
    this.prospectoSeleccionado = rowData;
    this.prospectoEdicion = { ... rowData };
    this.insertar = false;
    this.modalVisible = true;
    this.modalOportunidadesService
    .openModalProspecto(true, false, [], rowData)
    .subscribe((modalResult) => {
      if (modalResult?.result.result === true) {
        this.ngOnInit();
      }
    });
  }
}


