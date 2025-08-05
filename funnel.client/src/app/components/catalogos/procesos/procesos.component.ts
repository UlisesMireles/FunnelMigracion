import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Procesos } from '../../../interfaces/procesos';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../../services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfiguracionTablaService } from '../../../services/configuracion-tabla.service';
import { EnumTablas } from '../../../enums/enumTablas';
import { ModalEtapasService } from '../../../services/modalEtapas.service';
import { ProcesosService } from '../../../services/procesos.service';
import { ColumnasDisponiblesComponent } from '../../utils/tablas/columnas-disponibles/columnas-disponibles.component';
import { OportunidadesPorEtapa } from '../../../interfaces/oportunidades';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';
import { PlantillasProcesos } from '../../../interfaces/plantillas-procesos';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';

@Component({
  selector: 'app-procesos',
  standalone: false,
  templateUrl: './procesos.component.html',
  styleUrl: './procesos.component.css'
})
export class ProcesosComponent {
  @ViewChild('dt')
  dt!: Table;


  disableProcesos = true;
  isDescargando = false;
  anchoTabla = 100;
  procesos: Procesos[] = [];
  procesosOriginal: Procesos[] = [];
  procesoSeleccionado!: Procesos;
  procesoEdicion: Procesos | null = null;

  loading: boolean = true;
  insertar: boolean = false;
  modalVisible: boolean = false;
  selectedEstatus: any = null;
  desdeSector = false;
  @Output() headerClicked = new EventEmitter<void>();
  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [];

  columnsAMostrarResp = '';
  columnsTodasResp = '';
  private modalSubscription!: Subscription;
  disabledPdf: boolean = false;
  etapas: OportunidadesPorEtapa[] = [];
  etapasCombo: OportunidadesPorEtapa[] = [];
  plantillas: PlantillasProcesos[] = [];
  modalVisibleEtapas: boolean = false;
  cantidadProcesosPermitidos: number = 0;
  constructor(private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    public dialog: MatDialog,
    private readonly configuracionColumnasService: ConfiguracionTablaService,
    private modalEtapasService: ModalEtapasService,
    private procesosService: ProcesosService
  ) { }

  ngOnInit(): void {
    this.cantidadProcesosPermitidos = localStorage.getItem('cantidadProcesosPermitidos') ? parseInt(localStorage.getItem('cantidadProcesosPermitidos')!) : 0;
    this.configuracionColumnasService.obtenerColumnasAMostrar(EnumTablas.Procesos).subscribe({
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
    this.getProcesos();
    this.getComboEtapas();
    this.consultaPlantillas();
    document.documentElement.style.fontSize = 12 + 'px';
    this.modalSubscription = this.modalEtapasService.modalState$.subscribe((state) => {
      this.modalVisibleEtapas = state.showModal;
      this.insertar = state.insertarEtapas;
      if (!state.showModal) {
        this.procesoEdicion = null;
      }
      //Valida si se emite un result Exitoso desde modal
      if (state.result.id != -1 && state.result.result) {
        this.getProcesos();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();  // Desuscribimos al destruir el componente
    }
  }



  getProcesos() {
    this.procesosService.getProcesos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Procesos[]) => {

        if (!result || result.length === 0) {
          console.warn("No hay procesos en la respuesta.");
        }
        this.procesosOriginal = result;
        this.selectedEstatus = 'Activo';
        this.cdr.detectChanges();
        this.loading = false;
        this.filtrarPorEstatus();
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

  filtrarPorEstatus() {
    this.procesos = this.selectedEstatus === null
      ? [...this.procesosOriginal]
      : [...this.procesosOriginal.filter((x) => x.desEstatus.toString() === this.selectedEstatus)];
    if (this.dt) {
      this.dt.first = 0;
    }
  }

  getComboEtapas() {

    const idUsuario = this.loginService.obtenerIdUsuario();
    const idEmpresa = this.loginService.obtenerIdEmpresa();

    this.procesosService.getComboEtapas(idEmpresa, idUsuario).subscribe({
      next: (result: OportunidadesPorEtapa[]) => {

        this.etapasCombo = result.map(etapa => ({
          ...etapa,
          expandido: true, // Expandir todas las etapas por defecto
          editandoNombre: false,
          tarjetas: etapa.tarjetas || [],
          orden: etapa.orden,
          probabilidad: etapa.probabilidad,
          idEmpresa: idUsuario,
          idUsuario: idUsuario,
          idStage: etapa.idStage
        }));
      },
      error: (error) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar oportunidades por etapa'
        });
      }
    });
  }

  consultaPlantillas() {

    const idUsuario = this.loginService.obtenerIdUsuario();
    const idEmpresa = this.loginService.obtenerIdEmpresa();

    this.procesosService.getPlantillasProcesos().subscribe({
      next: (result: PlantillasProcesos[]) => {

        this.plantillas = result;
      },
      error: (error) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al consultar plantillas para procesos'
        });
      }
    });
  }

  clear(table: Table) {
    table.clear();
    this.getProcesos();
    this.lsColumnasAMostrar = JSON.parse(this.columnsAMostrarResp);
    this.lsTodasColumnas = JSON.parse(this.columnsTodasResp);
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.anchoTabla = 100;
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

    this.procesosService.descargarReporteProcesos(data, this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Procesos.pdf';
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
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Procesos");
      xlsx.writeFile(libro, "Procesos.xlsx");
    });
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
      vista: 'procesos',
    };

    dialogConfig.position = {
      top: targetAttr.y + targetAttr.height + 10 + "px",
      left: targetAttr.x - targetAttr.width - 240 + "px"
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

  inserta() {
    if (this.procesos.length >= this.cantidadProcesosPermitidos) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Límite alcanzado',
        detail: 'Tu licencia actual no permite agregar más procesos.'
      });
      return;
    }
    const idUsuario = this.loginService.obtenerIdUsuario();
    const idEmpresa = this.loginService.obtenerIdEmpresa();

    const nuevaEtapa: OportunidadesPorEtapa = Object.assign({
      expandido: true,
      editandoNombre: false,
      tarjetas: [],
      orden: '0',
      probabilidad: '0',
      idEmpresa: idUsuario,
      idUsuario: idUsuario,
      idStage: 0,
      idProceso: 0,
      nombreProceso: ''
    });

    this.etapas.push(nuevaEtapa);

    this.procesoSeleccionado = {
      //bandera: '',
      idProceso: 0,
      idEmpresa: 0,
      idUsuario: 0,
      nombre: '',
      estatus: false,
      desEstatus: '',
      oportunidades: 0,
      oportunidadesGanadas: 0,
      oportunidadesPerdidas: 0,
      oportunidadesEliminadas: 0,
      oportunidadesCanceladas: 0,
      etapas: []
    };
    this.modalEtapasService.openModal(true, true, this.etapas, this.etapasCombo, this.plantillas);
    this.insertar = true;
    this.modalVisible = true;

  }

  getOportunidadesPorEtapa(proceso: Procesos) {

    const idUsuario = this.loginService.obtenerIdUsuario();
    const idEmpresa = this.loginService.obtenerIdEmpresa();

    this.procesosService.getOportunidadesPorEtapa(proceso.idProceso).subscribe({
      next: (result: Procesos) => {

        this.etapas = result.etapas.map(etapa => ({
          ...etapa,
          expandido: true, // Expandir todas las etapas por defecto
          editandoNombre: false,
          tarjetas: etapa.tarjetas || [],
          orden: etapa.orden,
          probabilidad: etapa.probabilidad,
          idEmpresa: idUsuario,
          idUsuario: idUsuario,
          idStage: etapa.idStage,
          idProceso: proceso.idProceso,
          nombreProceso: proceso.nombre
        }));
        this.modalEtapasService.openModal(true, false, this.etapas, this.etapasCombo, this.plantillas);
        this.procesoSeleccionado = proceso;
        this.procesoEdicion = { ...proceso };
        this.insertar = false;
        //this.modalVisible = true;
        //this.modalEtapasService.openModal(true, false, this.etapas)
      },
      error: (error) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar oportunidades por etapa'
        });
      }
    });
  }

  isSorted(columnKey: string): boolean {

    return this.dt?.sortField === columnKey;
  }

  obtenerArregloFiltros(data: any[], columna: string): any[] {
    const lsGroupBy = groupBy(data, columna);
    return sortBy(getKeys(lsGroupBy));
  }

  getColumnWidth(key: string): object {
    const widths: { [key: string]: string } = {
      nombreProceso: '100%',
      cantidadOportunidades: '100%',
      cantidadGanadas: '100%',
      cantidadPerdidas: '100%',
      desEstatus: '100%'
    };
    return { width: widths[key] || 'auto' };
  }

  actualiza(proceso: Procesos) {
    this.getOportunidadesPorEtapa(proceso);
  }

  getTotalCostPrimeNg(table: Table, def: any) {
    if (!def.isTotal) {
      return;
    }

    const registrosVisibles = table.filteredValue ? table.filteredValue : this.procesos;

    if (def.key === 'nombreProceso') {
      return registrosVisibles.length;
    }

    return (
      registrosVisibles.reduce(
        (acc: number, empresa: Procesos) =>
          acc + (Number(empresa[def.key as keyof Procesos]) || 0),
        0
      ) / registrosVisibles.length
    );
  }


  onHeaderClick() {
    this.headerClicked.emit();
  }

}
