import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GraficasService } from '../../../../services/graficas.service';
import { LoginService } from '../../../../services/login.service';
import { TipoSectorAgente } from '../../../../interfaces/graficas';
import { RequestGraficasDto } from '../../../../interfaces/graficas';

@Component({
  selector: 'app-modal-oportunidades-por-agente-sector',
  standalone: false,
  templateUrl: './modal-oportunidades-por-agente-sector.component.html',
  styleUrl: './modal-oportunidades-por-agente-sector.component.css'
})
export class ModalOportunidadesPorAgenteSectorComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() idAgente: number | null = null;
  

  oportunidades: TipoSectorAgente[] = [];
  loading: boolean = true;
  maximized: boolean = false;
  modalDetalleVisible: boolean = false;
  idSectorSeleccionado: number | null = null;
  nombreSectorSeleccionado: string = '';
  public mostrarDecimales: boolean = false;

  lsColumnasAMostrar = [
    { key: 'descripcion', header: 'Sector', format: 'text' },
    { key: 'monto', header: 'Monto', format: 'currency' },
    { key: 'montoNormalizado', header: 'Monto Normalizado', format: 'currency' },
  ];

  constructor(
    private graficasService: GraficasService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    this.mostrarDecimales = this.loginService.obtenerPermitirDecimales();
    if (this.visible && this.idAgente) {
      this.cargarOportunidades();
    }
  }

  cargarOportunidades() {
    if (!this.idAgente) return;

    const requestData: RequestGraficasDto = {
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.idAgente,
      bandera: 'SEL-AGENTE-SECTOR'  
    };

    this.loading = true;
    this.graficasService.obtenerOportunidadesPorSectorPorAgente(requestData).subscribe({
      next: (data) => {
        this.oportunidades = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar oportunidades por sector', error);
        this.loading = false;
      }
    });
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  toggleMaximize() {
    this.maximized = !this.maximized;
    this.cdr.detectChanges();
  }

  calcularSumaMontos(): number {
    return this.oportunidades.reduce((sum, item) => sum + (item.monto || 0), 0);
  }

  calcularSumaMontosNormalizados(): number {
    return this.oportunidades.reduce((sum, item) => sum + (item.montoNormalizado || 0), 0);
  }

  onDialogShow() {
    this.cargarOportunidades();
  }

abrirModalDetalle(idSector: number) {
  this.idSectorSeleccionado = idSector;
  const sectorSeleccionado = this.oportunidades.find(op => op.idSector === idSector);
  this.nombreSectorSeleccionado = sectorSeleccionado?.descripcion || '';
  this.modalDetalleVisible = true;
  this.visible = false;
}

cerrarModalDetalle() {
  this.modalDetalleVisible = false;
  this.visible = true;
}
}
