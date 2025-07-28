import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Usuarios } from '../../../interfaces/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { ColumnasDisponiblesComponent } from '../../utils/tablas/columnas-disponibles/columnas-disponibles.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';
import { EnumTablas } from '../../../enums/enumTablas';
import { ConfiguracionTablaService } from '../../../services/configuracion-tabla.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  @ViewChild('dt') dt!: Table;

  disableUsuarios: boolean = true;
  isDescargando = false;
  anchoTabla = 100;

  usuarios: Usuarios[] = [];
  usuariosOriginal: Usuarios[] = [];
  usuarioSeleccionado!: Usuarios;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;
  licencia: string = '';
  cantidadUsuarios: number = 0;
  insertar: boolean = true;
  modalVisible: boolean = false;
  disabledPdf: boolean = false;
  @Output() headerClicked = new EventEmitter<void>();


  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [];
  columnsAMostrarResp = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp = JSON.stringify(this.lsTodasColumnas);

  constructor(private UsuariosService: UsuariosService, private messageService: MessageService, private cdr: ChangeDetectorRef,
     private loginService: LoginService, public dialog: MatDialog, private readonly configuracionColumnasService: ConfiguracionTablaService) { }

  ngOnInit(): void {
    this.licencia = localStorage.getItem('licencia')!;
    this.cantidadUsuarios = Number(localStorage.getItem('cantidadUsuarios')!);
    this.configuracionColumnasService.obtenerColumnasAMostrar(EnumTablas.Usuarios).subscribe({
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
    this.getUsuarios();
    document.documentElement.style.fontSize = 12 + 'px';
  }

  getUsuarios(idEmpresa: number = 1) {
    this.UsuariosService.getUsuarios(this.loginService.obtenerIdEmpresa()).subscribe({

      next: (result: Usuarios[]) => {

        if (!result || result.length === 0) {
          console.warn("No hay usuarios en la respuesta.");
        }

        this.usuariosOriginal = result;
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
  FiltrarPorEstatus() {
    this.usuarios = this.selectedEstatus === null
      ? [...this.usuariosOriginal]
      : [...this.usuariosOriginal.filter((x) => x.desEstatus.toString() === this.selectedEstatus)];
    if (this.dt) {
      this.dt.first = 0;
    }
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
      this.getUsuarios();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }

  inserta() {
    const limite = this.cantidadUsuarios;
    const totalUsuarios = this.usuarios.length;
    if (totalUsuarios >= limite) {
      this.messageService.add({
        severity: 'error',
        summary: 'Límite de usuarios alcanzado',
        detail: `El límite de ${limite} usuarios de la licencia ${this.licencia} ha sido alcanzado. Para agregar más usuarios, considere actualizar su licencia.`,
      })
      return;
    }

    this.usuarioSeleccionado = {
      result: true,
      errorMessage: ' ',
      idUsuario: 0,
      usuario: '',
      password: '',
      tipoUsuario: '',
      nombre: '',
      correo: '',
      idEmpresa: 0,
      idTipoUsuario: 0,
      descripcion: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaRegistro: '',
      fechaModificacion: '',
      estatus: 1,
      desEstatus: 'Activo',
      archivoImagen: '',
      usuarioCreador: 0,
      codigoAutenticacion: '',
      fechaInicio: '',
      fechaFin: '',
      iniciales: '',
      id: 0
    };
    this.insertar = true;
    this.modalVisible = true;

  }

  actualiza(licencia: Usuarios) {
    this.usuarioSeleccionado = licencia;
    this.insertar = false;
    this.modalVisible = true;
  }

  clear(table: Table) {
    table.clear();
    this.getUsuarios();
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
      vista: 'usuarios',
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
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Usuarios");
      xlsx.writeFile(libro, "Usuarios.xlsx");
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

    this.UsuariosService.descargarReporteUsuarios(data, this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Usuarios.pdf';
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

    const registrosVisibles = table.filteredValue ? table.filteredValue : this.usuarios;

    if (def.key === 'nombre') {
      return registrosVisibles.length;
    }

    return (
      registrosVisibles.reduce(
        (acc: number, empresa: Usuarios) =>
          acc + (Number(empresa[def.key as keyof Usuarios]) || 0),
        0
      ) / registrosVisibles.length
    );
  }

  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.usuarios;

    if (campo === 'nombre') {
      return registrosVisibles.length;
    }

    return registrosVisibles.reduce(
      (acc: number, empresa: Usuarios) =>
        acc + (Number(empresa[campo as keyof Usuarios] || 0)),
      0
    );
  }

  obtenerArregloFiltros(data: any[], columna: string): any[] {
    const lsGroupBy = groupBy(data, columna);
    return sortBy(getKeys(lsGroupBy));
  }

  getColumnWidth(key: string): object {
    const widths: { [key: string]: string } = {
      nombre: '100%',
      apellidoPaterno: '100%',
      apellidoMaterno: '100%',
      usuario: '100%',
      iniciales: '100%',
      correo: '100%',
      telefono: '100%',
      tipoUsuario: '100%',
      desEstatus: '100%',
      cantidadOportunidades: '100%',
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
