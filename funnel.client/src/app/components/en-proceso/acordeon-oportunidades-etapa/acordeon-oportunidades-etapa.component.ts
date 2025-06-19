import { transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Oportunidad, OportunidadesPorEtapa, Tarjeta, RequestActualizarEtapa } from '../../../interfaces/oportunidades';
import { OportunidadesService } from '../../../services/oportunidades.service';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { ModalOportunidadesService } from '../../../services/modalOportunidades.service';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-acordeon-oportunidades-etapa',
  standalone: false,
  templateUrl: './acordeon-oportunidades-etapa.component.html',
  styleUrl: './acordeon-oportunidades-etapa.component.css'
})
export class AcordeonOportunidadesEtapaComponent {

  etapas: OportunidadesPorEtapa[] = []; // Array que contendrá los meses con sus oportunidades (tarjetas)
  loading: boolean = true;// Bandera para mostrar el spinner de carga
  errorMessage: string = '';// Variable para almacenar mensaje de error en caso de fallo
  connectedDropLists: string[] = [];// Lista de identificadores para los dropLists de cada mes (usado por cdkDragDrop)
  tarjetaMovida: any;// Objeto que almacena la tarjeta que se movió y datos relacionados (origen, destino, etc.)
  idOportunidadTarjeta: number = 0;  // Variable para almacenar el ID de la oportunidad (tarjeta) que se está moviendo
  tarjetaEnEspera: any;  // Variable para almacenar temporalmente la tarjeta arrastrada (para poder obtener su idOportunidad)
  modalEditarVisible: boolean = false;
  modalSeguimientoVisible: boolean = false;
  insertar: boolean = false;
  oportunidadSeleccionada!: Oportunidad;
  oportunidades: Oportunidad[] = [];
  seguimientoOportunidad: boolean = false;
  cantidadExpandidos: number = 0;
  // Output para emitir resultados de la petición post (por ejemplo, para notificar a un padre)
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  private modalSubscription!: Subscription;
  baseUrl: string = environment.baseURL;
  // 
  constructor(
    private oportunidadService: OportunidadesService, private readonly loginService: LoginService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private modalOportunidadesService: ModalOportunidadesService
  ) { }

  ngOnInit() {

    this.getOportunidadesPorEtapa();
    this.modalSubscription = this.modalOportunidadesService.modalState$.subscribe((state) => {
      //Valida si se emite un result Exitoso desde modal
      if (state.result.id != -1 && state.result.result) {
        this.getOportunidadesPorEtapa();
      }
    });
  }
  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();  // Desuscribimos al destruir el componente
    }
  }

  getOportunidadesPorEtapa() {
    this.loading = true;

    const idUsuario = this.loginService.obtenerIdUsuario();
    const idEmpresa = this.loginService.obtenerIdEmpresa();


    this.oportunidadService.getOportunidadesPorEtapa(idEmpresa, idUsuario).subscribe({
      next: (result: OportunidadesPorEtapa[]) => {

        this.etapas = result.map(etapa => ({
          ...etapa,
          expandido: etapa.tarjetas.length > 0, // Expandir todas las etapas por defecto
          tarjetas: etapa.tarjetas || [] // Asegurar array vacío si es null/undefined
        }));

        this.connectedDropLists = this.etapas.map((_, i) => `ListEtapa${i}`);
        this.cantidadExpandidos = this.etapas.filter(etapa => etapa.expandido).length;
        this.loading = false;
        console.log('Oportunidades por etapa cargadas:', this.etapas);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar oportunidades por etapa'
        });
      }
    });
  }


  alternarItem(item: any, event: Event) {
    event.stopPropagation(); // Evita propagación del evento
    item.expandido = !item.expandido; // Invierte el valor de 'expandido'

    this.cantidadExpandidos = this.etapas.filter(etapa => etapa.expandido).length;
    this.cdr.detectChanges();
  }

  drop(event: any, etapaDestino: OportunidadesPorEtapa) {
    // 1. Validar si el movimiento es dentro del mismo contenedor


    // 2. Identificar la etapa de origen
    const etapaOrigenObj = this.etapas.find(e => e.tarjetas === event.previousContainer.data);
    if (!etapaOrigenObj) {
      console.error('No se encontró la etapa de origen');
      return;
    }
    // 3. Preparar datos del movimiento
    this.tarjetaMovida = {
      tarjeta: event.item.data,
      etapaOrigen: event.previousContainer.data,
      etapaDestino: etapaDestino,
      indexOrigen: event.previousIndex,
      indexDestino: event.currentIndex,
      etapaOrigenObj: etapaOrigenObj
    };
    if (event.previousContainer === event.container) {
      return;
    }
    // 4. Mover visualmente la tarjeta (actualización optimista)
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    // 5. Asignar el ID para la actualización
    this.idOportunidadTarjeta = this.tarjetaMovida.tarjeta.idOportunidad;
    console.log(`Movimiento iniciado - Oportunidad: ${this.idOportunidadTarjeta}, Nueva etapa: ${etapaDestino.idStage}`);

    // 6. Actualizar en el backend
    this.actualizarEtapaEnBackend();
  }

  private actualizarEtapaEnBackend() {
    if (!this.idOportunidadTarjeta || !this.tarjetaMovida) {
      console.error('Datos incompletos para actualización');
      return;
    }

    const request: RequestActualizarEtapa = {
      bandera: "UPD-STAGE",
      idOportunidad: this.idOportunidadTarjeta,
      idStage: this.tarjetaMovida.etapaDestino.anio,
      idUsuario: this.loginService.obtenerIdUsuario(),
      idEmpresa: this.loginService.obtenerIdEmpresa()
    };

    this.oportunidadService.actualizarEtapa(request).subscribe({
      next: (result: baseOut) => {
        if (result.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Etapa actualizada correctamente',
            life: 3000
          });

          // Actualizar datos adicionales si es necesario
          this.actualizarDatosLocales();
        } else {
          this.revertirMovimiento();
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: result.errorMessage || 'La etapa no se actualizó completamente',
            life: 5000
          });
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.revertirMovimiento();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al comunicarse con el servidor',
          life: 5000
        });
      }
    });
  }

  private actualizarDatosLocales() {
    // Aquí puedes actualizar cualquier dato local adicional
    // Por ejemplo: recálculo de totales, estadísticas, etc.
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  private revertirMovimiento() {
    if (!this.tarjetaMovida) return;

    transferArrayItem(
      this.tarjetaMovida.etapaDestino.tarjetas,
      this.tarjetaMovida.etapaOrigen,
      this.tarjetaMovida.indexDestino,
      this.tarjetaMovida.indexOrigen
    );

    console.log('Movimiento revertido');
    this.cdr.detectChanges();
  }


  getTotalMonto(mes: OportunidadesPorEtapa): number {
    return mes.tarjetas.reduce((acc, tarjeta) => acc + (tarjeta.monto || 0), 0);
  }

  // Suma todos los montos normalizados de las tarjetas del mes
  getTotalNormalizado(mes: OportunidadesPorEtapa): number {
    return mes.tarjetas.reduce((acc, tarjeta) => acc + (tarjeta.montoNormalizado || 0), 0);
  }

  manejarResultado(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.getOportunidadesPorEtapa();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }

  getClaseNombreEmpresa(nombreEmpresa: string, nombreAbrev: string): string {
    const cantNombre = nombreEmpresa.length;
    const cantAbrev = nombreAbrev.length;
    if (cantNombre >= 30 && cantAbrev >= 4) {
      return 'clsNomEmpresa116';
    } else if (cantNombre >= 30 && cantAbrev < 4) {
      return 'clsNomEmpresa125';
    } else {
      return 'clsNomEmpresa';
    }
  }

  private crearNuevaLicencia(licencia: Tarjeta) {
    return {
      idOportunidad: licencia.idOportunidad,
      nombre: licencia.nombreEmpresa,
      nombreAbrev: licencia.nombreAbrev,
      nombreOportunidad: licencia.nombreOportunidad,
      monto: licencia.monto,
      probabilidad: licencia.probabilidad,
      montoNormalizado: licencia.montoNormalizado,
      imagen: licencia.imagen,
      nombreEjecutivo: licencia.nombreEjecutivo,
      iniciales: licencia.iniciales,
      descripcion: licencia.descripcion,
      fechaEstimadaCierre: licencia.fechaEstimadaCierre,
      idTipoProyecto: licencia.idTipoProyecto,
      nombreContacto: licencia.nombreContacto,
      entrega: licencia.entrega,
      fechaEstimadaCierreOriginal: licencia.fechaEstimadaCierreOriginal,
      idEstatusOportunidad: licencia.idEstatusOportunidad,
      comentario: licencia.comentario,
      idProspecto: licencia.idProspecto,
      idStage: licencia.idStage,
      idTipoEntrega: licencia.idTipoEntrega,
      idEjecutivo: licencia.idEjecutivo,
      idContactoProspecto: licencia.idContactoProspecto,
      totalComentarios: licencia.totalComentarios,
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      idUsuario: this.loginService.obtenerIdUsuario(),
      stage: licencia.stage
    };
  }

  actualiza(licencia: Tarjeta) {
    this.oportunidadSeleccionada = licencia;
    this.insertar = false;
    this.modalEditarVisible = true;
    this.modalOportunidadesService
      .openModal(true, false, [], licencia)
      .subscribe((modalResult) => {
        if (modalResult?.result) {
          this.ngOnInit();
        }
      });
  }

  seguimiento(licencia: Tarjeta) {
    this.oportunidadSeleccionada = licencia;
    this.seguimientoOportunidad = true;
    this.modalSeguimientoVisible = true;
  }
  private readonly cacheBuster = Date.now();
  getImagen(imagen: string) {
    return `${this.baseUrl}/Fotografia/${imagen}?t=${this.cacheBuster}`;
  }
}
