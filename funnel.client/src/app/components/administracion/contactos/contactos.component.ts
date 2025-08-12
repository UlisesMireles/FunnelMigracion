import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Contacto } from '../../../interfaces/contactos';
import { ContactosService } from '../../../services/contactos.service';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnasDisponiblesComponent } from '../../utils/tablas/columnas-disponibles/columnas-disponibles.component';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from "lodash-es";
import { ModalOportunidadesService } from '../../../services/modalOportunidades.service';
import { Subscription } from 'rxjs';
import { EnumTablas } from '../../../enums/enumTablas';
import { ConfiguracionTablaService } from '../../../services/configuracion-tabla.service';
import { CamposAdicionales } from '../../../interfaces/campos-adicionales';
import { ModalCamposAdicionalesService } from '../../../services/modalCamposAdicionales.service';

@Component({
  selector: 'app-contactos',
  standalone: false,
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css'
})
export class ContactosComponent {

  @ViewChild('dt') dt!: Table;


  disableContactos = true;
  isDescargando = false;
  anchoTabla = 100;
  contactos: Contacto[] = [];
  contactosOriginal: Contacto[] = [];
  contactoSeleccionado!: Contacto;
  contactoEdicion: Contacto | null = null;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;


  insertar: boolean = false;
  modalVisible: boolean = false;
  @Output() headerClicked = new EventEmitter<void>();
  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [];

  columnsAMostrarResp: string = '';
  columnsTodasResp: string = '';
  private modalSubscription!: Subscription;
  disabledPdf: boolean = false;


  constructor(
    private contactosService: ContactosService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService,
    public dialog: MatDialog,
    private readonly configuracionColumnasService: ConfiguracionTablaService,
    private modalOportunidadesService: ModalOportunidadesService
  ) { }

  ngOnInit(): void {
    this.configuracionColumnasService.obtenerColumnasAMostrar(EnumTablas.Contactos).subscribe({
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
    this.getContactos();
    document.documentElement.style.fontSize = 12 + 'px';
    this.modalSubscription = this.modalOportunidadesService.modalContactoState$.subscribe((state) => {
      if (!state.showModal) {
        this.contactoEdicion = null;
      }
      //Valida si se emite un result Exitoso desde modal
      if (state.result.id != -1 && state.result.result) {
        this.getContactos();
      }
    });
  }

  getContactos() {
    this.contactosService.getContactos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Contacto[]) => {
        this.contactosOriginal = result.map(p => {
          const { propiedadesAdicionales, ...resto } = p;
          return {
            ...resto,
            ...propiedadesAdicionales
          };
        });
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

  inserta() {
    this.contactoSeleccionado = {
      idContactoProspecto: 0,
      nombre: '',
      apellidos: '',
      telefono: '',
      correoElectronico: '',
      prospecto: '',
      idEmpresa: 0,
      idProspecto: 0,
      estatus: 0,
      desEstatus: '',
      nombreCompleto: '',
      bandera: ''
    };
    this.modalOportunidadesService.openModalContacto(true, true, [], this.contactoSeleccionado)
    this.insertar = true;
    this.modalVisible = true;
  }

  actualiza(licencia: Contacto) {
    this.modalOportunidadesService.openModalContacto(true, false, [], licencia);
    this.contactoSeleccionado = licencia;
    this.contactoEdicion = { ...licencia };
    this.insertar = false;
    this.modalVisible = true;
  }

  onModalClose() {
    this.modalVisible = false;
    this.contactoEdicion = null;
  }

  manejarResultado(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.getContactos();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }


  FiltrarPorEstatus() {
    this.contactos = this.selectedEstatus === null
      ? [...this.contactosOriginal]
      : [...this.contactosOriginal.filter((x) => x.desEstatus === this.selectedEstatus)];
    if (this.dt) {
      this.dt.first = 0;
    }
  }

  //#region Funciones para el filtrado de columnas y exportación a Excel

  clear(table: Table) {
    table.clear();
    this.getContactos();
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
      todosColumnas: this.lsTodasColumnas,
      vista: 'prospectos-contactos',
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
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Contactos");
      xlsx.writeFile(libro, "Contactos.xlsx");
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
      datos: dataExport
    }

    if (dataExport.length == 0)
      return

    this.disabledPdf = true;


    this.contactosService.descargarReporteContactos(data, this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Contactos.pdf';
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
    if (!def.isTotal) {
      return;
    }

    const registrosVisibles = table.filteredValue ? table.filteredValue : this.contactos;

    if (def.key === 'nombreCompleto') {
      return registrosVisibles.length;
    }

    return (
      registrosVisibles.reduce(
        (acc: number, empresa: Contacto) =>
          acc + (Number(empresa[def.key as keyof Contacto]) || 0),
        0
      ) / registrosVisibles.length
    );
  }

  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.contactos;

    if (campo === 'nombreCompleto') {
      return registrosVisibles.length;
    }

    return registrosVisibles.reduce(
      (acc: number, empresa: Contacto) =>
        acc + (Number(empresa[campo as keyof Contacto] || 0)),
      0
    );
  }

  obtenerArregloFiltros(data: any[], columna: string): any[] {
    const lsGroupBy = groupBy(data, columna);
    return sortBy(getKeys(lsGroupBy));
  }

  getColumnWidth(key: string): object {
    const widths: { [key: string]: string } = {
      nombreCompleto: '100%',
      telefono: '100%',
      correoElectronico: '100%',
      prospecto: '100%',
      desEstatus: '100%',
    };
    return { width: widths[key] || 'auto' };
  }
  isSorted(columnKey: string): boolean {

    return this.dt?.sortField === columnKey;
  }
  onHeaderClick() {
    this.headerClicked.emit();
  }
}
