import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GraficasService } from '../../../../services/graficas.service';
import { LoginService } from '../../../../services/login.service';
import { DetalleTipoOportunidadAgente } from '../../../../interfaces/graficas';
import { RequestGraficasDto } from '../../../../interfaces/graficas';

@Component({
  selector: 'app-modal-oportunidades-por-agente-detalle-tipo',
  standalone: false,
  templateUrl: './modal-oportunidades-por-agente-detalle-tipo.component.html',
  styleUrl: './modal-oportunidades-por-agente-detalle-tipo.component.css'
})
export class ModalOportunidadesPorAgenteDetalleTipoComponent {
  @Input() visible: boolean = false;
  @Input() idAgente!: number;
  @Input() idTipoOporAgente!: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() nombreTipoOportunidad: string = '';

  oportunidades: DetalleTipoOportunidadAgente[] = [];
  maximized: boolean = false;

  constructor(
    private graficasService: GraficasService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.visible && this.idAgente && this.idTipoOporAgente) {
      this.cargarDetalles();
    }
  }

  onDialogShow() {
    this.cargarDetalles();
  }

  cargarDetalles() {
    const requestData: RequestGraficasDto = {
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.loginService.obtenerIdUsuario()
    };

    this.graficasService.obtenerDetalleOportunidadesTipoAgente(this.idAgente, this.idTipoOporAgente, requestData)
      .subscribe({
        next: (data) => {
          this.oportunidades = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar detalles:', err);
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
}
