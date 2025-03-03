import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
//PrimeNG
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

import{ ProspectoService } from '../../../services/prospecto.service';

import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { Prospectos } from '../../../interfaces/prospecto';
@Component({
  selector: 'app-prospectos',
  standalone: false,
  templateUrl: './prospectos.component.html',
  styleUrl: './prospectos.component.css'
})
export class ProspectosComponent {
  constructor( private messageService: MessageService, private cdr: ChangeDetectorRef, private prospectoService: ProspectoService) { }

ngOnInit(): void {
this.getProspectos();
}
  @ViewChild('dt')
  dt!: Table ;

prospectos: Prospectos[] = [];
prospectosOriginal: Prospectos[] = [];
prospectoSeleccionado!: Prospectos;
filtroProspecto='';
filtroUbicacionProspecto='';
filtroSector='';
filtroTodas=''; 
filtroProceso='';
filtroGanadas='';
filtroPerdidas='';
filtroCanceladas='';
filtroEliminadas='';
first: number = 0;
rows: number = 10;
loading: boolean = true;
insertar: boolean = false;
modalVisible: boolean = false;
selectedEstatus: any = null;

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
getProspectos() {
  this.prospectoService.getProspectos().subscribe({
    next: (result: Prospectos[]) => {
      this.prospectosOriginal = result;
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
  this.prospectos = this.selectedEstatus === null
    ? [...this.prospectosOriginal]
    : [...this.prospectosOriginal.filter((x) => x.desEstatus === this.selectedEstatus)];
  if (this.dt) {
    this.dt.first = 0;
  }
}
// eventosBotones
inserta() {
  this.prospectoSeleccionado = {
    bandera: '',
    idProspecto: 0,
    nombre: '',
    ubicacionFisica: '',
    esatus: 0,
    desEstatus: '',
    nombreSector: '',
    idSector: 0,
    totalOportunidades: 0,
    proceso:0,
    ganadas: 0,
    perdidas: 0,
    canceladas: 0,
    eliminadas: 0,
    idEmpresa: 0,
    };
  this.insertar = true;
  this.modalVisible = true;
}
actualiza(licencia: Prospectos) {
  this.prospectoSeleccionado = licencia;
  this.insertar = false;
  this.modalVisible = true;
}
updateFilter(event: any, field: string) {
  this.dt.filter(event, field, 'contains');
}
// eventosTabla
pageChange(event: LazyLoadEvent) {
  if (event.first !== undefined) {
    this.first = event.first;
  }
  if (event.rows !== undefined) {
    this.rows = event.rows;
  }
}
changeRows(event: any, dt: any) {
  this.rows = event.value;
  dt.rows = this.rows;
  dt.first = 0;
  dt.reset();
}
onInput(event: Event): void {
  const input = event.target as HTMLInputElement; // Casting de tipo
  if (this.dt) {
    this.dt.filterGlobal(input.value, 'contains');
  }
}
prev() {
  this.first = this.first - this.rows;
}
reset() {
  this.first = 0;
  this.getProspectos();
  this.dt.reset();
}
next() {
  this.first = this.first + this.rows;
}
isFirstPage(): boolean {
  return this.prospectos ? this.first === 0 : true;
}
getVisibleTotal(campo: string, dt: any): number {
  const registrosVisibles = dt.filteredValue
    ? dt.filteredValue
    : this.prospectos;
  if (campo === 'nombreSector') {
    return registrosVisibles.length; // Retorna el número de registros visibles
  }
  return registrosVisibles.reduce(
    (acc: number, empresa: Prospectos) =>
      acc + Number(empresa[campo as keyof Prospectos] || 0),
    0
  );
}
isLastPage(): boolean {
  return this.prospectos
    ? this.first + this.rows >= this.prospectos.length
    : true;
}
// metodos moda
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
    this.getProspectos();
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Se ha producido un error.',
      detail: result.errorMessage,
    });
  }
}
}
