import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { Oportunidad } from '../../../../interfaces/oportunidades';
import { OportunidadesService } from '../../../../services/oportunidades.service';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-modal-detalles-indicadores-etapa',
  standalone: false,
  templateUrl: './modal-detalles-indicadores-etapa.component.html',
  styleUrl: './modal-detalles-indicadores-etapa.component.css'
})
export class ModalDetallesIndicadoresEtapaComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();

  oportunidades: Oportunidad[] = [];
  loading: boolean = true;
  maximized: boolean = false;
  public mostrarDecimales: boolean = false;

    lsColumnasAMostrar = [
    { key: 'nombre', valor: 'Prospecto', tipoFormato: 'text' },
    { key: 'nombreOportunidad', valor: 'Oportunidad', tipoFormato: 'text' },
    { key: 'abreviatura', valor: 'Tipo', tipoFormato: 'text' },
    { key: 'iniciales', valor: 'Ejecutivo', tipoFormato: 'text' },
    { key: 'monto', valor: 'Monto', tipoFormato: 'currency' },
    { key: 'fechaEstimadaCierreOriginal', valor: 'Cierre Estimado', tipoFormato: 'date' }
  ];

    constructor(
    private oportunidadesService: OportunidadesService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  onDialogShow() {
    this.mostrarDecimales = this.loginService.obtenerPermitirDecimales();
    this.cargarOportunidades();
    this.actualizarVariableCSS();
  }

cargarOportunidades() {
  this.loading = true;
  this.oportunidadesService.getOportunidades(
    this.loginService.obtenerIdEmpresa(),
    this.loginService.obtenerIdUsuario(),
    1 
  ).subscribe({
    next: (data) => {
      this.oportunidades = data.sort((a: Oportunidad, b: Oportunidad) => {
        const fechaA = a.fechaEstimadaCierreOriginal ? new Date(a.fechaEstimadaCierreOriginal).getTime() : 0;
        const fechaB = b.fechaEstimadaCierreOriginal ? new Date(b.fechaEstimadaCierreOriginal).getTime() : 0;
        return fechaB - fechaA;
      });
      this.loading = false;
      this.actualizarVariableCSS();
      this.cdr.detectChanges(); // Forzar detección de cambios para actualizar la variable CSS
    },
    error: (error) => {
      console.error('Error al cargar oportunidades', error);
      this.loading = false;
    }
  });  }

  private actualizarVariableCSS() {
    this.renderer.setStyle(this.el.nativeElement, '--cantidad-registros', this.oportunidades.length.toString());
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

  getColorForFechaEstimadaCierre(fechaEstimadaCierreOriginal: string): string {
  const hoy = new Date();
  const fechaCierre = new Date(fechaEstimadaCierreOriginal);

  const diferencia = fechaCierre.getTime() - hoy.getTime();
  const diasDiferencia = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

  if (diasDiferencia < 0) {
    return 'red';        
  } else if (diasDiferencia <= 30) {
    return 'orange';     
  } else if (diasDiferencia <= 60) {
    return 'green';      
  } else {
    return 'black';     
  }
}
}
