import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { OportunidadesTipoDetalles, RequestGraficasDto } from '../../../../interfaces/graficas';
import { GraficasService } from '../../../../services/graficas.service';

@Component({
  selector: 'app-modal-detalles-oportunidades-por-tipo',
  standalone: false,
  templateUrl: './modal-detalles-oportunidades-por-tipo.component.html',
  styleUrl: './modal-detalles-oportunidades-por-tipo.component.css'
})
export class ModalDetallesOportunidadesPorTipoComponent {
    @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() idTipoProyecto: number = 0;

  detalles: OportunidadesTipoDetalles[] = [];
  loading: boolean = true;
  maximized: boolean = false;
  nombreTipoProyecto: string = '';

  lsColumnasAMostrar = [
    { key: 'nombreProspecto', valor: 'Prospecto', tipoFormato: 'text' },
    { key: 'nombreOportunidad', valor: 'Oportunidad', tipoFormato: 'text' },
    { key: 'tipoProyecto', valor: 'Tipo', tipoFormato: 'text' },
    { key: 'ejecutivo', valor: 'Ejecutivo', tipoFormato: 'text' },
    { key: 'monto', valor: 'Monto', tipoFormato: 'currency' },
    { key: 'fechaEstimadaCierre', valor: 'Cierre Estimado', tipoFormato: 'text' }
  ];

    constructor(
    private loginService: LoginService, 
    private graficasService: GraficasService, 
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.idTipoProyecto) {
      this.cargarDetalles();
    }
  }

  ngOnChanges() {
    if (this.idTipoProyecto && this.visible) {
      this.cargarDetalles();
    }
  }

  cargarDetalles() {
    this.loading = true;
    
    const requestData: RequestGraficasDto = {
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.loginService.obtenerIdUsuario(),
      bandera: 'SEL-TIPO-SIN-MONTOS-CEROS'
    };

    this.graficasService.obtenerDetalleOportunidadesTipo(this.idTipoProyecto, requestData)
      .subscribe({
        next: (data) => {
          this.detalles = data;
          if (data.length > 0) {
            this.nombreTipoProyecto = data[0].tipoProyecto;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar detalles:', error);
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
    return this.detalles.reduce((sum, item) => sum + (item.monto || 0), 0);
  }

  calcularSumaMontosNormalizados(): number {
    return this.detalles.reduce((sum, item) => sum + (item.montoNormalizado || 0), 0);
  }

  isSorted(columnKey: string): boolean {
    return false;
  }

}
