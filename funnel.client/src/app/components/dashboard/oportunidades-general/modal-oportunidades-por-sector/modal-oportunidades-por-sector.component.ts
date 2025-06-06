import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { Sectores, RequestGraficasDto } from '../../../../interfaces/graficas';
import { GraficasService } from '../../../../services/graficas.service';

@Component({
  selector: 'app-modal-oportunidades-por-sector',
  standalone: false,
  templateUrl: './modal-oportunidades-por-sector.component.html',
  styleUrl: './modal-oportunidades-por-sector.component.css'
})
export class ModalOportunidadesPorSectorComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() abrirDetalle = new EventEmitter<number>();

  sectores: Sectores[] = [];
  loading: boolean = true;
  maximized: boolean = false;

    lsColumnasAMostrar = [
    { key: 'nombreSector', valor: 'Sector', tipoFormato: 'text' },
    { key: 'monto', valor: 'Monto', tipoFormato: 'currency' },
    { key: 'montoNormalizado', valor: 'Monto Normalizado', tipoFormato: 'currency' },
  ];

  constructor(private loginService: LoginService, private graficasService: GraficasService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
    this.cargarSectores();
  }

    onDialogShow() {
    this.cargarSectores();
  }

    cargarSectores() {
    this.loading = true;
    
    const requestData: RequestGraficasDto = {
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.loginService.obtenerIdUsuario(),
      bandera: 'SEL-AGENTE-SECTOR'
    };

    this.graficasService.obtenerOportunidadesPorSector(requestData)
      .subscribe({
        next: (data) => {
          this.sectores = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar sectores:', error);
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

  toggleMaximize() {
    this.maximized = !this.maximized;
    this.cdr.detectChanges();
  }

  calcularSumaMontos(): number {
    return this.sectores.reduce((sum, item) => sum + (item.monto || 0), 0);
  }

  calcularSumaMontosNormalizados(): number {
    return this.sectores.reduce((sum, item) => sum + (item.montoNormalizado || 0), 0);
  }

      isSorted(columnKey: string): boolean {
    return false;
  }

abrirDetalleSector(idSector: number) {
  this.abrirDetalle.emit(idSector);
}
}
