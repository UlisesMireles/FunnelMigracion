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
export class ContactosComponent {

  @ViewChild('dt') dt!: Table;


  disableContactos = true;
  isDescargando = false;
  anchoTabla = 100;
  contactos: Contacto[] = [];
  contactosOriginal: Contacto[] = [];
  contactoSeleccionado!: Contacto;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;
  

  insertar: boolean = false;
  modalVisible: boolean = false;

  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [
    { key: 'nombreCompleto', isCheck: true, valor: 'Nombre', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'telefono', isCheck: true, valor: 'Teléfono', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'correoElectronico', isCheck: true, valor: 'Correo Electrónico', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'prospecto', isCheck: true, valor: 'Prospecto', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'desEstatus', isCheck: true, valor: 'Estatus', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'estatus' },
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
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.getContactos();
    document.documentElement.style.fontSize = 12 + 'px';
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
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Contactos");
      xlsx.writeFile(libro, "Contactos.xlsx");
    });
  }

  getTotalCostPrimeNg(table: Table, def: any) {
        if (def.key == 'nombre') {
          return '';
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

}
