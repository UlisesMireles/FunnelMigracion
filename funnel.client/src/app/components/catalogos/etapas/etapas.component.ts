import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Oportunidad, OportunidadesPorEtapa } from '../../../interfaces/oportunidades';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { OportunidadesService } from '../../../services/oportunidades.service';
import { LoginService } from '../../../services/login.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModalEtapasService } from '../../../services/modalEtapas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-etapas',
  standalone: false,
  templateUrl: './etapas.component.html',
  styleUrl: './etapas.component.css'
})
export class EtapasComponent {

  etapas: OportunidadesPorEtapa[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  connectedDropLists: string[] = [];
  tarjetaMovida: any;
  idOportunidadTarjeta: number = 0;
  tarjetaEnEspera: any;
  modalEditarVisible: boolean = false;
  modalSeguimientoVisible: boolean = false;
  insertar: boolean = false;
  oportunidadSeleccionada!: Oportunidad;
  oportunidades: Oportunidad[] = [];
  seguimientoOportunidad: boolean = false;
  cantidadExpandidos: number = 0;
  editandoOrdenEtapas: boolean = false;
  titulo: string = 'Configuración de Etapas';
  @Input() visible: boolean = false;

  @Output() result: EventEmitter<baseOut> = new EventEmitter();
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  private modalSubscription!: Subscription;
  idUsuario: number = 0;
  idEmpresa: number = 0;
  validaGuardar: boolean = false;
  nombreProceso: string = '';
  etapasFiltradas: any[] = [];
  busquedaEtapa: string = '';
  etapaSeleccionada: boolean = false;
  etapasSeleccionada!: OportunidadesPorEtapa;
  etapaEnEditar: Partial<OportunidadesPorEtapa> = {};


  constructor(
    private readonly oportunidadService: OportunidadesService, private readonly loginService: LoginService, private readonly messageService: MessageService, private readonly cdr: ChangeDetectorRef
    , private readonly modalEtapasService: ModalEtapasService, private readonly confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.idUsuario = this.loginService.obtenerIdUsuario();
    this.idEmpresa = this.loginService.obtenerIdEmpresa();

    this.modalSubscription = this.modalEtapasService.modalState$.subscribe((state) => {
      this.visible = state.showModal;
      if (state.showModal) {
        this.etapas = state.etapas;
        this.connectedDropLists = this.etapas.map((_, i) => `ListEtapa${i}`);
        this.cantidadExpandidos = this.etapas.filter(etapa => etapa.expandido).length;
      }
    });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  inicializarModal() {
    this.modalSubscription = this.modalEtapasService.modalState$.subscribe((state) => {
      this.visible = state.showModal;
    });
  }

  onDialogShow() {
    this.inicializarModal()
  }

  agregarEtapa() {
  if (this.etapas.filter(e => !e.eliminado).length >= 7) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No puedes cargar más de 7 etapas',
      key: 'toast'
    });
    return;
  }

  const nuevaEtapa: OportunidadesPorEtapa = Object.assign({
    idStage: 0,
    anio: 0,
    nombre: '',
    tarjetas: [],
    expandido: true,
    editandoNombre: true,
    agregado: true,
    probabilidad: 0,
    eliminado: false,
    idEmpresa: this.idEmpresa,
    idUsuario: this.idUsuario,
    orden: (this.etapas.length + 1).toString(),
    textoBusqueda: '', 
    etapaSeleccionada: null
  });

  this.etapas.push(nuevaEtapa);
}


  toggleEditarOrdenEtapas() {
    this.guardarEtapas();
  }

  get etapasActivas() {
    return this.etapas.filter(e => !e.eliminado);
  }

  guardarEtapas() {
    let etapasLista = this.etapas.filter(e => e.nombre == '' && Number(e.probabilidad) <= 0);
    if (etapasLista.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todas las etapas deben tener un nombre y una probabilidad mayor a 0',
        key: 'toast'
      });
      return;
    }

    const etapasOrdenProbabilidad = this.etapas;
    for (let i = 1; i < etapasOrdenProbabilidad.length; i++) {
      if ((Number(etapasOrdenProbabilidad[i].probabilidad) < Number(etapasOrdenProbabilidad[i - 1].probabilidad)) &&
        Number(etapasOrdenProbabilidad[i - 1].probabilidad) > 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La probabilidad de la etapa ' + etapasOrdenProbabilidad[i - 1].nombre + ' no puede ser mayor que la de la etapa ' + etapasOrdenProbabilidad[i].nombre,
          key: 'toast',
          life: 10000
        });
        return;
      }
    }

    this.oportunidadService.postGuardarEtapas(this.etapas).subscribe({
      next: (result: baseOut) => {
      },
      error: (error: baseOut) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
          key: 'toast'
        });
      },
    });
  }

//   filtrarEtapa(event: any, etapa: OportunidadesPorEtapa) {
//   etapa.textoBusqueda = event.filter;
// }

filtrarEtapa(event: any, etapa: any) {
  etapa.textoBusqueda = event.filter?.trim() || '';
  this.etapaSeleccionada = false;

  if (etapa.textoBusqueda.length > 0) {
    this.etapasFiltradas = this.etapasActivas.filter(e =>
      e.nombre.toLowerCase().includes(etapa.textoBusqueda.toLowerCase())
    );
  } else {
    this.etapasFiltradas = this.etapasActivas;
  }
}

  agregarEtapaDesdeBusqueda(etapaActual: OportunidadesPorEtapa) {
    const nombreNuevaEtapa = etapaActual.textoBusqueda?.trim();

    if (!nombreNuevaEtapa) return;
    if (this.etapas.filter(e => !e.eliminado).length >= 7) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No puedes cargar más de 7 etapas',
        key: 'toast'
      });
      return;
    }

    this.etapas.forEach(e => e.editandoNombre = false);

    const nuevaEtapa: OportunidadesPorEtapa = Object.assign({
      idStage: 0,
      anio: 0,
      nombre: nombreNuevaEtapa,
      tarjetas: [],
      expandido: true,
      editandoNombre: true,
      agregado: true,
      probabilidad: 0,
      eliminado: false,
      idEmpresa: this.idEmpresa,
      idUsuario: this.idUsuario,
      orden: (this.etapas.length + 1).toString(),
      textoBusqueda: '',
      etapaSeleccionada: null
    });

    this.etapas.push(nuevaEtapa);

    setTimeout(() => {
      nuevaEtapa.etapaSeleccionada = nuevaEtapa;
      this.cdr.detectChanges();
    });
  }

  seleccionarEtapa(etapa: any) {
    if (etapa != null) {
      this.busquedaEtapa = etapa.nombre;
    }
    else {
      this.busquedaEtapa = "";
    }

    this.etapasFiltradas = this.etapasActivas;
    this.etapaSeleccionada = true;
    this.cdr.detectChanges();
  }

  dropEtapa(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.etapas, event.previousIndex, event.currentIndex);
    this.etapas.forEach((etapa, index) => {
      etapa.orden = (index + 1).toString();
      this.validaGuardar = true;
    });
  }

  alternarItem(item: any, event: Event) {
    event.stopPropagation();
    item.expandido = !item.expandido;

    this.cantidadExpandidos = this.etapas.filter(etapa => etapa.expandido).length;
    this.cdr.detectChanges();
  }

  cerrar() {
    this.visible = false;
    this.modalEtapasService.closeModal();
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  editarNombreEtapa(etapa: any) {
    this.etapas.forEach(e => e.editandoNombre = false);
    etapa.editandoNombre = true;
    etapa.etapaSeleccionada = etapa;

    this.cdr.detectChanges();
  }

  seleccionarEtapaExistente(etapa: OportunidadesPorEtapa, etapaSeleccionada: OportunidadesPorEtapa) {
    if (etapaSeleccionada) {
      etapa.nombre = etapaSeleccionada.nombre;
      etapa.probabilidad = etapaSeleccionada.probabilidad;
      etapa.idStage = etapaSeleccionada.idStage;
      etapa.etapaSeleccionada = etapaSeleccionada;
    }
  }

  cancelarEdicion(etapa: any) {
    etapa.editandoNombre = false;
  }

  guardarNombreEtapa(etapa: OportunidadesPorEtapa) {
  if (etapa.etapaSeleccionada) {
    etapa.nombre = etapa.etapaSeleccionada.nombre;
    etapa.probabilidad = etapa.etapaSeleccionada.probabilidad;
    etapa.idStage = etapa.etapaSeleccionada.idStage;
  }
  else if (etapa.textoBusqueda?.trim()) {
    etapa.nombre = etapa.textoBusqueda.trim();
    etapa.idStage = 0;
  }

  if (!etapa.nombre || Number(etapa.probabilidad) <= 0) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Debes asignar un nombre y una probabilidad mayor a 0',
      key: 'toast'
    });
    return;
  }

  const nombreNormalizado = etapa.nombre.trim().toLowerCase();

  const duplicado = this.etapasActivas.some(
    e =>
      e !== etapa &&
      e.nombre.trim().toLowerCase() === nombreNormalizado
  );

  if (duplicado) {
    this.messageService.add({
      severity: 'error',
      summary: 'Nombre duplicado',
      detail: `Ya existe una etapa con el nombre "${etapa.nombre}"`,
      key: 'toast'
    });
    return;
  }

  etapa.editandoNombre = false;
}

  eliminarEtapa(etapa: any): void {
    if (this.etapas.filter(e => !e.eliminado).length <= 3) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Tienes que tener al menos 3 etapas',
        key: 'toast'
      });
      return;
    }
    this.validaGuardar = true;
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta etapa?',
      header: 'Confirmación',
      accept: () => {
        this.confirmarEliminacion(etapa);
      },
      reject: () => {
        this.rechazarEliminacion();
      },
      rejectLabel: 'No',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button-secondary',
      rejectButtonStyleClass: 'p-button-danger'
    });
  }

  confirmarEliminacion(etapa: any): void {
    if (etapa) {
      etapa.eliminado = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Etapa eliminada correctamente',
        key: 'toast'
      });
    }
  }

  rechazarEliminacion(): void {
  }

}
