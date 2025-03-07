import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Contacto } from '../../../interfaces/contactos';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { OportunidadesService } from '../../../services/oportunidades.service';
import { Oportunidad } from '../../../interfaces/oportunidades';

@Component({
  selector: 'app-oportunidades',
  standalone: false,
  templateUrl: './oportunidades.component.html',
  styleUrl: './oportunidades.component.css'
})
export class OportunidadesComponent {
  constructor(private oportunidadService: OportunidadesService, private messageService: MessageService, private cdr: ChangeDetectorRef,
      private readonly loginService: LoginService
    ) { }

    ngOnInit(): void {
      this.getOportunidades();
    }
    @ViewChild('dt') dt!: Table;
  
    oportunidades: Oportunidad[] = [];
    oportunidadesOriginal: Oportunidad[] = [];
    oportunidadSeleccionada!: Oportunidad;
  
    loading: boolean = true;
    first: number = 0;
    rows: number = 10;    

    idUsuario: number = 1;
    idEstatus: number = 1;

    insertar: boolean = false;
    modalVisible: boolean = false;

    filtroNombre = '';
    filtroNombreSector = '';
    filtroNombreOportunidad = '';
    filtroAbreviatura = '';
    filtroStage = '';
    filtroTooltipStage = '';
    filtroIniciales = '';
    filtroNombreEjecutivo = '';
    filtroNombreContacto = '';
    filtroEntrega = '';
    filtroEntregaDescripcion = '';
    filtroMonto = '';
    filtroProbabilidadOriginal = '';
    filtroProbabilidad = '';
    filtroMontoNormalizado = '';
    filtroFechaRegistro = '';
    filtroDiasFunnel = '';
    filtroFechaEstimadaCierreOriginal = '';
    filtroFechaModificacion = '';
    
    rowsOptions = [
      { label: '10', value: 10 },
      { label: '20', value: 20 },
      { label: '50', value: 50 }
    ];

    getOportunidades() {
      this.oportunidadService.getOportunidades(this.idUsuario, this.loginService.obtenerIdEmpresa(), this.idEstatus).subscribe({
        next: (result: Oportunidad[]) => {
          console.log(result);
          this.oportunidades = [...result];
          this.oportunidadesOriginal = result;
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

    inserta() {
      this.oportunidadSeleccionada = {
        
      };
      this.insertar = true;
      this.modalVisible = true;
    }
    
    actualiza(licencia: Contacto) {
      this.oportunidadSeleccionada = licencia;
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
      this.getOportunidades();
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
        : this.oportunidades;
      if (campo === 'nombre') {
        return registrosVisibles.length; 
      }
      return registrosVisibles.reduce(
        (acc: number, empresa: Oportunidad) =>
          acc + Number(empresa[campo as keyof Oportunidad] || 0),
        0
      );
    }

    isLastPage(): boolean {
      return this.oportunidades
        ? this.first + this.rows >= this.oportunidades.length
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
        this.getOportunidades();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: result.errorMessage,
        });
      }
    }
  
}
