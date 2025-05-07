import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { EjecucionProcesosReportes } from '../../../interfaces/ejecucion-procesos-reportes';
import { HerramientasService } from '../../../services/herramientas.service';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../../services/login.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ejecucion-procesos',
  standalone: false,
  templateUrl: './ejecucion-procesos.component.html',
  styleUrl: './ejecucion-procesos.component.css'
})
export class EjecucionProcesosComponent {

  @ViewChild('dt') dt!: Table

  ejecucionProcesos: EjecucionProcesosReportes[] = [];
  ejecucionProcesosOriginal: EjecucionProcesosReportes[] = [];
  ejecucionProcesosSeleccionado!: EjecucionProcesosReportes;

  anchoTabla = 100;//porciento 

  correosUsuariosActivos: any[] = [];

  loading: boolean = true;
  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [
    { key: 'reporte', isCheck: true, valor: 'Reporte', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' },
    { key: 'diasInactividad', isCheck: true, valor: 'Recordatorio Dias Inactividad', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'diasFechaVencidad', isCheck: true, valor: 'Recordatorio Dias por Fecha Vencida', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'number' },
    { key: 'estatus', isCheck: true, valor: 'Estatus', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'boolean' },
    { key: 'correosInmediatos', isCheck: true, valor: 'Selección de Correos Inmediatos', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'text' }
  ];

  columnsAMostrarResp: string = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp: string = JSON.stringify(this.lsTodasColumnas);

  constructor(private herramientasService: HerramientasService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService, public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.getComboUsuariosActivos();
    document.documentElement.style.fontSize = 12 + 'px';
  }

  getComboUsuariosActivos() {
    this.herramientasService.getCorreosUsuariosActivos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        this.correosUsuariosActivos = result;
        this.getEjecucionProcesos();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      }
    });
  }

  getEjecucionProcesos() {
    this.herramientasService.getEjecucionProcesos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result) => {

        this.ejecucionProcesos = [...result];
        this.ejecucionProcesosOriginal = result;
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
        this.loading = false;

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      },
    });

  }

}
