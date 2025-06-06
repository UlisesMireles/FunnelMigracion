import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SectoresDetalles, RequestGraficasDto } from '../../../../interfaces/graficas';
import { GraficasService } from '../../../../services/graficas.service';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-modal-detalles-oportunidades-por-sector',
  standalone: false,
  templateUrl: './modal-detalles-oportunidades-por-sector.component.html',
  styleUrl: './modal-detalles-oportunidades-por-sector.component.css'
})
export class ModalDetallesOportunidadesPorSectorComponent {
  @Input() visible: boolean = false;
  @Input() idSector!: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();

  oportunidades: SectoresDetalles[] = [];
  loading: boolean = true;
  maximized: boolean = false;
  nombreSector: string = '';

  constructor(
    private graficasService: GraficasService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.idSector) {
      this.cargarDetalles();
    }
  }

  onDialogShow() {
    this.cargarDetalles();
  }

    cargarDetalles() {
    this.loading = true;
    const requestData: RequestGraficasDto = {
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.loginService.obtenerIdUsuario()
    };

    this.graficasService.obtenerDetalleOportunidadesSector(this.idSector, requestData)
      .subscribe({
        next: (data) => {
          this.oportunidades = data.map(oportunidad => ({
            ...oportunidad,
            fechaEstimadaCierre: this.parsearFecha(oportunidad.fechaEstimadaCierre)
          }));
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar detalles del sector:', error);
          this.loading = false;
        }
      });
  }

  parsearFecha(fechaString: any): string {
    try {
      if (!fechaString) return '';
      
      if (fechaString instanceof Date && !isNaN(fechaString.getTime())) {
        return fechaString.toISOString();
      }

      if (typeof fechaString === 'string' && fechaString.includes('-')) {
        const date = new Date(fechaString);
        if (!isNaN(date.getTime())) {
          return fechaString;
        }
      }

      if (typeof fechaString === 'string' && fechaString.includes('/')) {
        const partes = fechaString.split('/');
        if (partes.length === 3) {
          const dia = parseInt(partes[0]), mes = parseInt(partes[1]) - 1, anio = parseInt(partes[2]);
          if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
            const date = new Date(anio, mes, dia);
            if (!isNaN(date.getTime())) {
              return date.toISOString();
            }
          }
        }
      }
      
      console.warn('Formato de fecha no reconocido:', fechaString);
      return '';
    } catch (error) {
      console.error('Error al parsear fecha:', error, 'Valor:', fechaString);
      return '';
    }
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

  isSorted(columnKey: string): boolean {
    return false;
  }

}
