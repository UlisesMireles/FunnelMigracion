import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GraficasService } from '../../../../services/graficas.service';
import { LoginService } from '../../../../services/login.service';
import { DetalleSectorAgente } from '../../../../interfaces/graficas';
import { RequestGraficasDto } from '../../../../interfaces/graficas';

@Component({
  selector: 'app-modal-oportunidades-por-agente-detalle-sector',
  standalone: false,
  templateUrl: './modal-oportunidades-por-agente-detalle-sector.component.html',
  styleUrl: './modal-oportunidades-por-agente-detalle-sector.component.css'
})
export class ModalOportunidadesPorAgenteDetalleSectorComponent {
  @Input() visible: boolean = false;
  @Input() idAgente!: number;
  @Input() idSector!: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() nombreSector: string = '';

  oportunidades: DetalleSectorAgente[] = [];
  maximized: boolean = false;

  constructor(
    private graficasService: GraficasService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.visible && this.idAgente && this.idSector) {
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

    this.graficasService.obtenerDetalleOportunidadesSectorAgente(this.idAgente, this.idSector, requestData)
      .subscribe({
        next: (data) => {
          this.oportunidades = data;
          console.log('Datos cargados en modal hijo:', data);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar detalles sector:', err);
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
}
