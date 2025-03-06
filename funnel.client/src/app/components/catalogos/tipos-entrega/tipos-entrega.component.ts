import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TipoEntrega} from '../../../interfaces/tipo-entrega';
import { TipoEntregaService } from '../../../services/tipo-entrega.service';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MessageService } from 'primeng/api';

import { baseOut } from '../../../interfaces/utils/utils/baseOut';

import { LoginService } from '../../../services/login.service';
@Component({
  selector: 'app-tipos-entrega',
  standalone: false,
  templateUrl: './tipos-entrega.component.html',
  styleUrl: './tipos-entrega.component.css'
})
export class TiposEntregaComponent {

  constructor(private tipoEntregaService: TipoEntregaService, private messageService: MessageService, private cdr: ChangeDetectorRef, private loginService:LoginService) { }

ngOnInit(): void {
    this.getTiposEntrega();
  }
  @ViewChild('dt') dt!: Table;

  tiposEntrega: TipoEntrega[] = [];
  tiposEntregaOriginal: TipoEntrega[] = [];
  tiposEntregaSeleccionado!: TipoEntrega;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;
  first: number = 0;
  rows: number = 10;

  filtroDescripcion = '';
  filtroAbreviatura = '';
 

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

  getTiposEntrega(idEmpresa: number = 1) {
    this.tipoEntregaService.getTiposEntrega(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: TipoEntrega[]) => {
        this.tiposEntregaOriginal = result;
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
      : this.tiposEntrega;
    if (campo === 'descripcion') {
      return registrosVisibles.length; 
    }
    return registrosVisibles.reduce(
      (acc: number, _tipoEntrega: TipoEntrega) =>
        acc + Number(_tipoEntrega[campo as keyof TipoEntrega] || 0),
      0
    );
  }
  updateFilter(event: any, field: string) {
    this.dt.filter(event, field, 'contains');
  }
  FiltrarPorEstatus() {
    this.tiposEntrega = this.selectedEstatus === null
      ? [...this.tiposEntregaOriginal]
      : [...this.tiposEntregaOriginal.filter((x) => x.desEstatus.toString() === this.selectedEstatus)];
    if (this.dt) {
      this.dt.first = 0;
    }
  }
  
  reset() {
    this.first = 0;
    this.getTiposEntrega();
    this.dt.reset();
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
      this.getTiposEntrega();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }

  inserta() {
    this.tiposEntregaSeleccionado = {
      idTipoEntrega: 0,
      descripcion: '',
      estatus: 0,
      abreviatura: '',
      idEmpresa: 0,
      fechaModificacion: '',
      desEstatus: '',
    };
    this.insertar = true;
    this.modalVisible = true;
  }
 
  actualiza(licencia: TipoEntrega) {
    this.tiposEntregaSeleccionado = licencia;
    this.insertar = false;
    this.modalVisible = true;
  }

}
