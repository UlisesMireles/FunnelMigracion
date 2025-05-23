import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { EjecucionProcesosReportes } from '../../../interfaces/ejecucion-procesos-reportes';
import { HerramientasService } from '../../../services/herramientas.service';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../../services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';

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
  correosSelAutoSemana!: any[];
  esatusSemana: boolean = false;
  correosSelImediataSemana!: any[];
  correosSelGuardadoAutoSemana: any[] = [];
  idReporteSemana: number = 0;

  correosSelAutoDiario!: any[];
  esatusDiario: boolean = false;
  correosSelImediataDiario!: any[];
  correosSelGuardadoAutoDiario!: any[];
  idReporteDiario: number = 0;

  esatusInactividad: boolean = false;
  diasInactividad: number = 0;
  diasFechaVencida: number = 0;
  idReporteInactividad: number = 0;

  proceso: EjecucionProcesosReportes = { idUsuario: 0, idEmpresa: 0, idReporte: 0, nombre: '', horaEjecucion: '', frecuencia: 0, diasInactividad: 0, diasFechaVencida: 0, ejecucionJob: false, correos: [] };


  loading: boolean = true;

  constructor(private herramientasService: HerramientasService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService, public dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
        this.inicializarFormulario();

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

  getCorreosGuardadoAutomaticosSemana() {
    this.herramientasService.getCorreosUsuariosReporteAuto(this.loginService.obtenerIdEmpresa(), this.idReporteSemana).subscribe({
      next: (result: any) => {
        this.correosSelGuardadoAutoSemana = [...result];
        this.correosSelAutoSemana = result;
        this.getCorreosGuardadoAutomaticosDiario();
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

  getCorreosGuardadoAutomaticosDiario() {
    this.herramientasService.getCorreosUsuariosReporteAuto(this.loginService.obtenerIdEmpresa(), this.idReporteDiario).subscribe({
      next: (result: any) => {
        this.correosSelGuardadoAutoDiario = [...result];
        this.correosSelAutoDiario = result;
        this.loading = false;
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

  inicializarFormulario() {
    let procesoSemana = this.ejecucionProcesos.find(x => x.nombre.toLowerCase().includes('semana'));
    let procesoDiario = this.ejecucionProcesos.find(x => x.nombre.toLowerCase().includes('diario'));
    let recordatorio = this.ejecucionProcesos.find(x => x.nombre.toLowerCase().includes('recordatorio'));

    this.esatusSemana = procesoSemana?.ejecucionJob ?? false;
    this.esatusDiario = procesoDiario?.ejecucionJob ?? false;
    this.esatusInactividad = recordatorio?.ejecucionJob ?? false;

    this.diasInactividad = recordatorio?.diasInactividad ?? 0;
    this.diasFechaVencida = recordatorio?.diasFechaVencida ?? 0;

    this.idReporteSemana = procesoSemana?.idReporte ?? 0;
    this.idReporteDiario = procesoDiario?.idReporte ?? 0;
    this.idReporteInactividad = recordatorio?.idReporte ?? 0;

    this.getCorreosGuardadoAutomaticosSemana()

  }

  validaCambiosAutoSemana() {
    let procesoSemana = this.ejecucionProcesosOriginal.find(x => x.nombre.toLowerCase().includes('semana'));
    let correosSeleccionados = this.correosSelAutoSemana.filter(x => this.correosSelGuardadoAutoSemana.map(ct => ct.correoElectronico).includes(x.correoElectronico));
    if (procesoSemana?.ejecucionJob !== this.esatusSemana
      || correosSeleccionados.length !== this.correosSelGuardadoAutoSemana.length
      || this.correosSelAutoSemana.length > this.correosSelGuardadoAutoSemana.length)
      return false
    else
      return true
  }

  validaCambiosAutoDiario() {
    let procesoDiario = this.ejecucionProcesosOriginal.find(x => x.nombre.toLowerCase().includes('diario'));
    let correosSeleccionados = this.correosSelAutoDiario.filter(x => this.correosSelGuardadoAutoDiario.map(ct => ct.correoElectronico).includes(x.correoElectronico));
    if (procesoDiario?.ejecucionJob !== this.esatusDiario
      || correosSeleccionados.length !== this.correosSelGuardadoAutoDiario.length
      || this.correosSelAutoDiario.length > this.correosSelGuardadoAutoDiario.length)
      return false
    else
      return true
  }

  validaCambiosInactividad() {
    let recordatorio = this.ejecucionProcesosOriginal.find(x => x.nombre.toLowerCase().includes('recordatorio'));
    if (recordatorio?.ejecucionJob !== this.esatusInactividad
      || recordatorio?.diasInactividad !== this.diasInactividad
      || recordatorio?.diasFechaVencida !== this.diasFechaVencida
    )
      return false
    else
      return true
  }

  guardarProcesoAutomaticoSemana(idReporte: number) {
    let correosSeleccionados = this.correosSelAutoSemana.map(ct => ct.correoElectronico)
    this.proceso = {
      idUsuario: this.loginService.obtenerIdUsuario(),
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idReporte: idReporte,
      nombre: '',
      horaEjecucion: '00:00:00',
      frecuencia: 0,
      diasInactividad: 0,
      diasFechaVencida: 0,
      ejecucionJob: this.esatusSemana,
      correos: correosSeleccionados
    }

    this.enviarDatosGuardarProcesoAutomatico()

  }

  guardarProcesoAutomaticoDiario(idReporte: number) {

    let correosSeleccionados = this.correosSelAutoDiario.map(ct => ct.correoElectronico)
    this.proceso = {
      idUsuario: this.loginService.obtenerIdUsuario(),
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idReporte: idReporte,
      nombre: '',
      horaEjecucion: '00:00:00',
      frecuencia: 0,
      diasInactividad: 0,
      diasFechaVencida: 0,
      ejecucionJob: this.esatusDiario,
      correos: correosSeleccionados
    }

    this.enviarDatosGuardarProcesoAutomatico()

  }

  guardarProcesoAutomaticoRecordatorio(idReporte: number) {

    this.proceso = {
      idUsuario: this.loginService.obtenerIdUsuario(),
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idReporte: idReporte,
      nombre: '',
      horaEjecucion: '00:00:00',
      frecuencia: 0,
      diasInactividad: this.diasInactividad,
      diasFechaVencida: this.diasFechaVencida,
      ejecucionJob: this.esatusInactividad,
      correos: []
    }

    this.enviarDatosGuardarProcesoAutomatico()

  }

  enviarDatosGuardarProcesoAutomatico() {
    this.herramientasService.guardarEjecucionProcesos(this.proceso).subscribe({
      next: (result: baseOut) => {
        if (result.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'La operación se realizó con éxito.',
            detail: result.errorMessage,
          });
          this.getComboUsuariosActivos();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: result.errorMessage,
          });
        }
      },
      error: (error: baseOut) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });
  }

  enviarCorreoInmediatoSemana(idReporte: number) {
    //let correos = this.correosSelImediataSemana.map(ct => ct.correoElectronico)
    let correos = ["mario.canales@eisei.net.mx"]

    this.herramientasService.enviarCorreosInmediatos(correos, this.loginService.obtenerIdEmpresa(), idReporte).subscribe({
      next: (result: baseOut) => {
        if (result.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'La operación se realizó con éxito.',
            detail: result.errorMessage,
          });
          this.correosSelImediataSemana = [];
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: result.errorMessage,
          });
        }
      },
      error: (error: baseOut) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });

  }

  enviarCorreoInmediatoDiario(idReporte: number) {
    //let correos = this.correosSelImediataDiario.map(ct => ct.correoElectronico)
    let correos = ["mario.canales@eisei.net.mx"]

    this.herramientasService.enviarCorreosInmediatos(correos, this.loginService.obtenerIdEmpresa(), idReporte).subscribe({
      next: (result: baseOut) => {
        if (result.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'La operación se realizó con éxito.',
            detail: result.errorMessage,
          });
          this.correosSelImediataSemana = [];
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: result.errorMessage,
          });
        }
      },
      error: (error: baseOut) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });

  }

}
