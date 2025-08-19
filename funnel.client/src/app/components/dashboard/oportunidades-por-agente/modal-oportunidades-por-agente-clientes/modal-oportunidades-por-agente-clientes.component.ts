import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { OportunidadesService } from '../../../../services/oportunidades.service';
import { LoginService } from '../../../../services/login.service';
import { OportunidadAgenteCliente } from '../../../../interfaces/graficas';
import { GraficasService } from '../../../../services/graficas.service';
import { RequestGraficasDto } from '../../../../interfaces/graficas';

@Component({
  selector: 'app-modal-oportunidades-por-agente-clientes',
  standalone: false,
  templateUrl: './modal-oportunidades-por-agente-clientes.component.html',
  styleUrl: './modal-oportunidades-por-agente-clientes.component.css'
})
export class ModalOportunidadesPorAgenteClientesComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() idAgente: number | null = null;

  oportunidades: OportunidadAgenteCliente[] = [];
  loading: boolean = true;
  maximized: boolean = false;
  public mostrarDecimales: boolean = false;

    lsColumnasAMostrar = [
    { key: 'nombreProspecto', valor: 'Prospecto', tipoFormato: 'text' },
    { key: 'nombreOportunidad', valor: 'Oportunidad', tipoFormato: 'text' },
    { key: 'tipoProyectoAbreviatura', valor: 'Tipo', tipoFormato: 'text' },
    { key: 'monto', valor: 'Monto', tipoFormato: 'currency' },
    { key: 'fechaEstimadaCierre', valor: 'Cierre Estimado', tipoFormato: 'text' },
  ];

    constructor(
    private graficasService: GraficasService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  onDialogShow() {
    this.mostrarDecimales = this.loginService.obtenerPermitirDecimales();
    if (this.idAgente) {
      this.cargarOportunidades();
    }
  }

  cargarOportunidades() {
    if (!this.idAgente) return;
    const requestData: RequestGraficasDto = {
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.idAgente,
      idEstatusOportunidad: 1,
    };

    this.graficasService.obtenerOportunidadesPorAgenteClientes(requestData).subscribe({
      next: (data) => {
        this.oportunidades = data.sort((a, b) => {
          const fechaA = a.fechaEstimadaCierre ? new Date(a.fechaEstimadaCierre).getTime() : 0;
          const fechaB = b.fechaEstimadaCierre ? new Date(b.fechaEstimadaCierre).getTime() : 0;
          return fechaB - fechaA;
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar oportunidades', error);
        this.loading = false;
      }
    });
  }

  close() { 
  this.visible = false;
  this.visibleChange.emit(this.visible);
  this.closeModal.emit();

  setTimeout(() => {
    this.visibleChange.emit(false);
  });
}

    isSorted(columnKey: string): boolean {
    return false;
  }
  
  toggleMaximize() {
          this.maximized = !this.maximized;
          this.cdr.detectChanges();
        }

  calcularSumaMontos(): number {
    return this.oportunidades.reduce((sum, item) => sum + (item.monto || 0), 0);
  }

}
