import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { SEL_Contacto } from '../../../interfaces/contactos';
import { ContactosService } from '../../../services/contactos.service';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-contactos',
  standalone: false,
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css'
})
export class ContactosComponent {
  constructor(private contactosService: ContactosService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.getContactos();
  }
  @ViewChild('dt') dt!: Table;

  contactos: SEL_Contacto[] = [];
  contactosOriginal: SEL_Contacto[] = [];
  contactoSeleccionado!: SEL_Contacto;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;
  first: number = 0;
  rows: number = 10;

  filtroContacto='';
  filtroNombre='';
  filtroTelefono='';
  filtroCorreo='';
  filtroProspecto='';

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

  getContactos() {
    this.contactosService.getContactos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: SEL_Contacto[]) => {
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
      idEmpresa: 1,
      idProspecto: 0,
      estatus: 0,
      desEstatus: '',
      nombreCompleto: ''
    };
    this.insertar = true;
    this.modalVisible = true;
  }
  
  actualiza(licencia: SEL_Contacto) {
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
      (acc: number, empresa: SEL_Contacto) =>
        acc + Number(empresa[campo as keyof SEL_Contacto] || 0),
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
}
