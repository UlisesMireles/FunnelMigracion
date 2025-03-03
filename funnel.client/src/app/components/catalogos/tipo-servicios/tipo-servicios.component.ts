import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TipoServicio } from '../../../interfaces/tipoServicio';
import { TipoServicioService } from '../../../services/tipo-servicio.service';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-tipo-servicios',
  standalone: false,
  templateUrl: './tipo-servicios.component.html',
  styleUrl: './tipo-servicios.component.css'
})
export class TipoServiciosComponent {
  constructor(private servicioService: TipoServicioService, private messageService: MessageService, private cdr: ChangeDetectorRef, private loginService:LoginService) { }

  ngOnInit(): void {
    this.getContactos();
  }
  @ViewChild('dt') dt!: Table;

  tiposServicios: TipoServicio[] = [];
  tiposServiciosOriginal: TipoServicio[] = [];
  tiposServiciosSeleccionado!: TipoServicio;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;
  first: number = 0;
  rows: number = 10;

  filtroContacto = '';
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

  getContactos(idEmpresa: number = 1) {
    this.servicioService.getTipoServicios(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: TipoServicio[]) => {
        this.tiposServiciosOriginal = result;
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

  pageChange(event: LazyLoadEvent) {
    if (event.first !== undefined) {
      this.first = event.first;
    }
    if (event.rows !== undefined) {
      this.rows = event.rows;
    }
  }
  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue
      ? dt.filteredValue
      : this.tiposServicios;
    if (campo === 'nombreSector') {
      return registrosVisibles.length; // Retorna el número de registros visibles
    }
    return registrosVisibles.reduce(
      (acc: number, _tipoServicio: TipoServicio) =>
        acc + Number(_tipoServicio[campo as keyof TipoServicio] || 0),
      0
    );
  }
  updateFilter(event: any, field: string) {
    this.dt.filter(event, field, 'contains');
  }
  FiltrarPorEstatus() {
    this.tiposServicios = this.selectedEstatus === null
      ? [...this.tiposServiciosOriginal]
      : [...this.tiposServiciosOriginal.filter((x) => x.desEstatus === this.selectedEstatus)];
    if (this.dt) {
      this.dt.first = 0;
    }
  }
  
  reset() {
    this.first = 0;
    this.getContactos();
    this.dt.reset();
  }
}
