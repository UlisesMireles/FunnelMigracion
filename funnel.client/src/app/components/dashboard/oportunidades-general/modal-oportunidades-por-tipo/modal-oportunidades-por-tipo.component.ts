import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { OportunidadesTipo, RequestGraficasDto } from '../../../../interfaces/graficas';
import { GraficasService } from '../../../../services/graficas.service';

@Component({
  selector: 'app-modal-oportunidades-por-tipo',
  standalone: false,
  templateUrl: './modal-oportunidades-por-tipo.component.html',
  styleUrl: './modal-oportunidades-por-tipo.component.css'
})
export class ModalOportunidadesPorTipoComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() abrirDetalle = new EventEmitter<number>();

  tiposProyecto: OportunidadesTipo[] = [];
  loading: boolean = true;
  maximized: boolean = false;
  public mostrarDecimales: boolean = false;

  lsColumnasAMostrar = [
    { key: 'descripcion', valor: 'Tipo Oportunidad', tipoFormato: 'text' },
    { key: 'monto', valor: 'Monto', tipoFormato: 'currency' },
    { key: 'montoNormalizado', valor: 'Monto Normalizado', tipoFormato: 'currency' }
  ];

  constructor(
    private loginService: LoginService, 
    private graficasService: GraficasService, 
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.mostrarDecimales = this.loginService.obtenerPermitirDecimales();
    this.cargarTiposProyecto();
  }

  onDialogShow() {
    this.cargarTiposProyecto();
  }

  cargarTiposProyecto() {
    this.loading = true;
    
    const requestData: RequestGraficasDto = {
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.loginService.obtenerIdUsuario(),
      bandera: 'SEL-TIPO-SIN-MONTOS-CEROS'
    };

    this.graficasService.obtenerOportunidadesPorTipo(requestData)
      .subscribe({
        next: (data) => {
          this.tiposProyecto = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar tipos de proyecto:', error);
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
    return this.tiposProyecto.reduce((sum, item) => sum + (item.monto || 0), 0);
  }

  calcularSumaMontosNormalizados(): number {
    return this.tiposProyecto.reduce((sum, item) => sum + (item.montoNormalizado || 0), 0);
  }

  isSorted(columnKey: string): boolean {
    return false;
  }

  abrirDetalleTipo(idTipoProyecto: number) {
    this.abrirDetalle.emit(idTipoProyecto);
  }
}

