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
import { state } from '@angular/animations';
import { CatalogoService } from '../../../services/catalogo.service';

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
  desdeSector = false;
  seguimientoOportunidad: boolean = false;
  modalVisible: boolean = false;
  modalSeguimientoVisible: boolean = false;
  modalDocumentosVisible: boolean = false;
  licencia: string = '';
  cantidadOportunidades: number = 0;
  private modalSubscription!: Subscription;

  loading: boolean = true;

  titulo: string = 'Oportunidades Por Etapa';

  prospectoSeleccionado!: Prospectos;
  prospectoEdicion: Prospectos | null = null;
  mostrarLista = true;
  mostrarOportunidadesMes = true;
  mostrarOportunidadesEtapa = true;
  mostrarEstadisticas = true;
  lsColumnasAMostrar: any[] = [];
  titulos = [
    'Oportunidades En Proceso',
    'Oportunidades Por Mes',
    'Oportunidades Por Etapa',
    'Estadística Oportunidades por Etapa'
  ];
  totalOportunidades: number = 0;
  totalOportunidadesMes: number = 0;
  totalProspectosMes: number = 0;
  totalGanadasMes: number = 0;
  totalPerdidasMes: number = 0;
  fechaCierreSortOrder: number = 1;  
  lsTodasColumnas: any[] = [
    { key: 'idOportunidad', isCheck: false, valor: 'Id', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombre', isCheck: true, valor: 'Prospecto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreSector', isCheck: true, valor: 'Sector', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreOportunidad', isCheck: true, valor: 'Oportunidad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    //{ key: 'abreviatura', isCheck: false, valor: 'Tipo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'stage', isCheck: true, valor: 'Etapa', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'numberFilter' },
    { key: 'iniciales', isCheck: true, valor: 'Ejecutivo', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'nombreContacto', isCheck: true, valor: 'Contacto', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'entrega', isCheck: false, valor: 'Entrega', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'monto', isCheck: true, valor: 'Monto', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    // { key: 'probabilidadOriginal', isCheck: false, valor: '% Original', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    // { key: 'probabilidad', isCheck: true, valor: '% Actual', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'probabilidadOriginal', isCheck: false, valor: '% Orig', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'textNFilter' },
    { key: 'probabilidad', isCheck: false, valor: '% Act', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'textNFilter' },
    { key: 'montoNormalizado', isCheck: true, valor: 'Vta Esperada', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'currency' },
    { key: 'fechaRegistro', isCheck: true, valor: 'Fecha Alta', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'fechaEstimadaCierreOriginal', isCheck: true, valor: 'Cierre Est', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' },
    { key: 'diasFunnel', isCheck: true, valor: 'D. Alta', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'fechaModificacion', isCheck: true, valor: 'D. S/Act', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' }
  ];

  columnsAMostrarResp: string = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp: string = JSON.stringify(this.lsTodasColumnas);
  disabledPdf: boolean = false;

  constructor(private oportunidadService: OportunidadesService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService, public dialog: MatDialog, private modalOportunidadesService: ModalOportunidadesService,
    private readonly catalogoService: CatalogoService) {
    this.loading = true;
    this.catalogoService.cargarProspectos(this.loginService.obtenerIdEmpresa());
  }

  ngOnInit(): void {
    this.licencia = localStorage.getItem('licencia')!;
    this.cantidadOportunidades = Number(localStorage.getItem('cantidadOportunidades'));
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.getOportunidades();
    this.llenarEtiquetas();
    document.documentElement.style.fontSize = 12 + 'px';
    this.modalSubscription = this.modalOportunidadesService.modalState$.subscribe((state) => {
      if (!state.showModal) {
        this.oportunidadEdicion = null;
      }
      //Valida si se emite un result Exitoso desde modal
      if (state.result.id != -1 && state.result.result) {
        this.getOportunidades();
        this.llenarEtiquetas();
      }
    });
    this.modalSubscription = this.modalOportunidadesService.modalProspectoState$.subscribe(state => {
      this.desdeSector = state.desdeSector;
      this.insertar = state.insertarProspecto;
      if (!state.showModal) {
        this.prospectoEdicion = null;
      }
      if (state.result.id != -1 && state.result.result) {
        this.getOportunidades();
        this.llenarEtiquetas();
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
        this.oportunidades = [...result];
        this.oportunidadesOriginal = [...result];
        this.totalOportunidades = this.oportunidades.length;
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

  llenarEtiquetas(): void {
    this.catalogoService.cargarProspectos(this.loginService.obtenerIdEmpresa());
    this.totalOportunidades = this.oportunidades.length;
    const hoy = new Date();
    this.totalOportunidadesMes = this.oportunidades
      .filter(o => {
        if (!o.fechaRegistro) return false;
        const fecha = new Date(o.fechaRegistro);
        return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
      }).length;
    
    this.oportunidadService.consultarEtiquetasOportunidades(this.loginService.obtenerIdEmpresa(), this.loginService.obtenerIdUsuario()).subscribe({
      next: (result: any) => {
        this.totalOportunidadesMes = result.abiertasMes;
        this.totalProspectosMes = result.prospectosNuevos;
        this.totalGanadasMes = result.ganadasMes;
        this.totalPerdidasMes = result.perdidasMes;
      },
      error: (error:any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error al cargar las etiquetas.',
          detail: error.errorMessage,
        });
      }
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
    this.titulo = this.titulos[index] || 'Administración General';

    this.titulo = this.titulos[index];
    if (index === 0) { // Tab "lista"
      this.mostrarLista = false;
      this.getOportunidades();
      setTimeout(() => this.mostrarLista = true, 0);
    }
    if (index === 1) { // Tab "porMes"
      this.mostrarOportunidadesMes = false;
      this.llenarEtiquetas();
      setTimeout(() => this.mostrarOportunidadesMes = true, 0);
    }
    if (index === 2) { // Tab "porEtapa"
      this.mostrarOportunidadesEtapa = false;
      this.llenarEtiquetas();
      setTimeout(() => this.mostrarOportunidadesEtapa = true, 0);
    }
    if (index === 3) { // Tab "estadisticas"
      this.mostrarEstadisticas = false;
      setTimeout(() => this.mostrarEstadisticas = true, 0);
    }
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
  onSortFechaCierre() {
  if (this.dt.sortField === 'fechaEstimadaCierreOriginal') {
    this.fechaCierreSortOrder = -this.fechaCierreSortOrder;
  } else {
    this.fechaCierreSortOrder = 1;
  }
  
  this.dt.sortOrder = this.fechaCierreSortOrder;
  this.dt.sortField = 'fechaEstimadaCierreOriginal';
  this.dt.sortSingle();
}
}


