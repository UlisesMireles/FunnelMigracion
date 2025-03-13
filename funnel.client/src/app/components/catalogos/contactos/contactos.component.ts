import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Contacto } from '../../../interfaces/contactos';
import { ContactosService } from '../../../services/contactos.service';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnasDisponiblesComponent } from '../../shared/columnas-disponibles/columnas-disponibles.component';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from "lodash-es";

@Component({
  selector: 'app-contactos',
  standalone: false,
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css'
})
export class ContactosComponent implements OnInit {

  @ViewChild('dt') dt!: Table;

  contactos: Contacto[] = [];
  contactosOriginal: Contacto[] = [];
  contactoSeleccionado!: Contacto;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;
  first: number = 0;
  rows: number = 10;

  filtroNombre = '';
  filtroTelefono = '';
  filtroCorreo = '';
  filtroProspecto = '';

  insertar: boolean = false;
  modalVisible: boolean = false;

  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  rowsOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 }
  ];

  lsColumnasAMostrar: any[] = [
    { key: 'nombreCompleto', isCheck: false, valor: 'Nombre Completo', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'telefono', isCheck: false, valor: 'Teléfono', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'correoElectronico', isCheck: false, valor: 'Correo Electrónico', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'prospecto', isCheck: false, valor: 'Prospecto', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'desEstatus', isCheck: false, valor: 'Estatus', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
  ];

  lsTodasColumnas: any[] = [
    { key: 'nombreCompleto', isCheck: false, valor: 'Nombre Completo', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'telefono', isCheck: false, valor: 'Teléfono', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'correoElectronico', isCheck: false, valor: 'Correo Electrónico', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'prospecto', isCheck: false, valor: 'Prospecto', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'desEstatus', isCheck: false, valor: 'Estatus', isIgnore: true, isTotal: false, groupColumn: false, tipoFormato: 'text' },
  ];

  columnsAMostrarResp: string = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp: string = JSON.stringify(this.lsTodasColumnas);

  constructor(
    private contactosService: ContactosService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getContactos();
  }

  getContactos() {
    this.contactosService.getContactos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Contacto[]) => {
        this.contactosOriginal = result;
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
      nombreCompleto: ''
    };
    this.insertar = true;
    this.modalVisible = true;
  }

  actualiza(licencia: Contacto) {
    this.contactoSeleccionado = licencia;
    this.insertar = false;
    this.modalVisible = true;
  }

  pageChange(event: LazyLoadEvent) {
    if (event.first !== undefined) {
      this.first = event.first;
    }
    if (event.rows !== undefined) {
      this.rows = event.rows;
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
    this.getContactos();
    this.dt.reset();
  }

  next() {
    this.first = this.first + this.rows;
  }

  updateFilter(event: any, field: string) {
    this.dt.filter(event, field, 'contains');
  }

  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue
      ? dt.filteredValue
      : this.contactos;
    if (campo === 'nombreCompleto') {
      return registrosVisibles.length;
    }
    return registrosVisibles.reduce(
      (acc: number, empresa: Contacto) =>
        acc + Number(empresa[campo as keyof Contacto] || 0),
      0
    );
  }

  isLastPage(): boolean {
    return this.contactos
      ? this.first + this.rows >= this.contactos.length
      : true;
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
      }
    });
  }

  exportExcel(table: Table) {
    let colsIgnorar: any[] = [];
    
    // Asegúrate de que dataExport nunca sea undefined
    let dataExport = (table.filteredValue || table.value || []);
  
    this.lsTodasColumnas.forEach(element => {
      if (!this.lsColumnasAMostrar.find(f => f.key === element.key)) {
        colsIgnorar.push(element);
      }
    });
  
    colsIgnorar.forEach(element => {
      dataExport = mapping(dataExport, i => omit(i, element.key));
    });
  
    import('xlsx').then(xlsx => {
      const hojadeCalculo: import('xlsx').WorkSheet = xlsx.utils.json_to_sheet(dataExport);
      const libro: import('xlsx').WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "contactos");
      xlsx.writeFile(libro, "contactos.xlsx");
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

    return sumBy(this.contactos, def.key)
  }

  obtenerArregloFiltros(data: any[], columna: string): any[] {
    const lsGroupBy = groupBy(data, columna);
    return sortBy(getKeys(lsGroupBy));
  }
  //#endregion
}