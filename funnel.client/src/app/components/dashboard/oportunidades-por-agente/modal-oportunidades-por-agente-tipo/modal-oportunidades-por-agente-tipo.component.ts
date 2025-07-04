import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GraficasService } from '../../../../services/graficas.service';
import { LoginService } from '../../../../services/login.service';
import { TipoOportunidadAgente } from '../../../../interfaces/graficas';
import { RequestGraficasDto } from '../../../../interfaces/graficas';
@Component({
  selector: 'app-modal-oportunidades-por-agente-tipo',
  standalone: false,
  templateUrl: './modal-oportunidades-por-agente-tipo.component.html',
  styleUrl: './modal-oportunidades-por-agente-tipo.component.css'
})
export class ModalOportunidadesPorAgenteTipoComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() idAgente: number | null = null;
  @Input() idTipoOporAgente!: number;
  nombreTipoSeleccionado: string = '';
  
  

  modalDetalleVisible: boolean = false;
  idTipoOporAgenteSeleccionado: number | null = null;

  oportunidades: TipoOportunidadAgente[] = [];
  loading: boolean = true;
  maximized: boolean = false;

  lsColumnasAMostrar = [
    { key: 'descripcion', header: 'Tipo de Oportunidad', format: 'text' },
    { key: 'monto', header: 'Monto', format: 'currency' },
    { key: 'montoNormalizado', header: 'Monto Normalizado', format: 'currency' },
  ];

constructor(
    private graficasService: GraficasService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    console.log('Visible:', this.visible, 'idAgente:', this.idAgente);
    if (this.visible && this.idAgente) {
      this.cargarOportunidades();
    }
  }

   cargarOportunidades() {
    if (!this.idAgente) return;

    const requestData: RequestGraficasDto = {
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.idAgente,
      bandera: 'SEL-TIPO-OPOR-AGENTE'
    };

    this.graficasService.obtenerOportunidadesPorAgenteTipo(requestData).subscribe({
      next: (data) => {
        this.oportunidades = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar oportunidades por tipo', error);
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

  calcularSumaPorcentajes(): number {
    return this.oportunidades.reduce((sum, item) => sum + (item.porcentaje || 0), 0);
  }

  isSorted(columnKey: string): boolean {
    return false; 
  }

    onDialogShow() {
    this.cargarOportunidades();
  }

  abrirModalDetalle(idTipo: number) {
    this.idTipoOporAgenteSeleccionado = idTipo;
    const tipoSeleccionado = this.oportunidades.find(op => op.idTipoOporAgente === idTipo);
    this.nombreTipoSeleccionado = tipoSeleccionado?.descripcion || '';
    this.modalDetalleVisible = true;   
    this.visible = false;               
  }

  cerrarModalDetalle() {
    this.modalDetalleVisible = false;  
    this.visible = true;                
  }
}