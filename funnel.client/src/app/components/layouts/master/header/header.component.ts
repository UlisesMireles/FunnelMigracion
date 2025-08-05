import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AsistenteService } from '../../../../services/asistentes/asistente.service';
import { ModalService } from '../../../../services/modal-perfil.service';
import { Router } from '@angular/router';
import { ModalOportunidadesService } from '../../../../services/modalOportunidades.service';
import { Oportunidad, OportunidadesPorEtapa } from '../../../../interfaces/oportunidades';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { Prospectos } from '../../../../interfaces/prospecto';
import { Contacto } from '../../../../interfaces/contactos';
import { SplitButton } from 'primeng/splitbutton';
import { LoginService } from '../../../../services/login.service';
import { CatalogoService } from '../../../../services/catalogo.service';
import { ModalEtapasService } from '../../../../services/modalEtapas.service';
import { OportunidadesService } from '../../../../services/oportunidades.service';
import { ContactosService } from '../../../../services/contactos.service';
import { CamposAdicionales } from '../../../../interfaces/campos-adicionales';
import { ModalCamposAdicionalesService } from '../../../../services/modalCamposAdicionales.service';
import { Procesos } from '../../../../interfaces/procesos';
import { ProcesosService } from '../../../../services/procesos.service';
import { PlantillasProcesos } from '../../../../interfaces/plantillas-procesos';
import { EnumLicencias } from '../../../../enums/enumLicencias';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  baseUrl: string = environment.baseURLAssets;
  enableAsistenteOperacion = false; // Inicia oculto
  ListaMenu: any[] = [];
  //modalVisible: boolean = false;
  nombreUsuario: string = '';
  licencia: string = '';
  optionsVisible: boolean = false;
  optionsVisibleProcesos: boolean = false;

  insertar: boolean = false;
  insertarContacto: boolean = false;
  insertarProspecto: boolean = false;
  insertarEtapas: boolean = false;

  private modalSubscription!: Subscription;
  private modalProspectosSubscription!: Subscription;
  private modalContactosSubscription!: Subscription;
  private modalEtapasSubscription!: Subscription;

  modalVisibleEtapas: boolean = false;

  //Modal Oportunidades
  modalVisibleOportunidades: boolean = false;
  oportunidades: Oportunidad[] = [];
  oportunidadSeleccionada!: Oportunidad;

  //Modal Prospectos
  modalVisibleProspectos: boolean = false;
  prospectos: Prospectos[] = [];
  prospectoSeleccionado!: Prospectos;

  //Modal Contactos
  modalVisibleContactos: boolean = false;
  contactos: Contacto[] = [];
  contactoSeleccionado!: Contacto;
  private asistenteSubscription!: Subscription;
  asistenteObservableValue: number = -1;
  items: MenuItem[];
  @ViewChild('splitBtn') splitButton!: SplitButton;
  esLogoDefault = false;
  imagenEmpresaUrl: string | null = null;
  @ViewChild('chatContainerOperacion') chatContainerOperacion!: ElementRef;
  @ViewChild('chatContainerProspeccion') chatContainerProspeccion!: ElementRef;

  //Modal Campos Adicionales
  camposAdicionales: CamposAdicionales[] = [];
  camposAdicionalesPorCatalogo: CamposAdicionales[] = [];
  modalVisibleCamposAdicionales: boolean = false;
  informacionReferenciaCatalgo: any = {};

  private isDragging = false;
  private offset = { x: 0, y: 0 };
  sessionCountdownMinutes: number = 0;
  sessionCountdownSeconds: number = 0;
  private sessionCountdownInterval: any;


  sessionCountdownMinutesInactividad: number = 0;
  sessionCountdownSecondsInactividad: number = 0;
  private sessionCountdownIntervalInactividad: any;
  etapas: OportunidadesPorEtapa[] = [];
  procesos: Procesos[] = [];
  plantillas: PlantillasProcesos[] = [];
   @ViewChild('selectProcesos') selectProcesos: any;

  licenciaPlatino: boolean = false;
  procesoSeleccionado: Procesos | null = null;
  etapasCombo: OportunidadesPorEtapa[] = [];

  constructor(
    public asistenteService: AsistenteService,
    private modalService: ModalService,
    private router: Router,
    private readonly catalogoService: CatalogoService,
    private messageService: MessageService,
    private modalOportunidadesService: ModalOportunidadesService,
    private readonly authService: LoginService,
    private contactosService: ContactosService,
    private modalCamposAdicionalesService: ModalCamposAdicionalesService,
    private oportunidadService: OportunidadesService,
    private modalEtapasService: ModalEtapasService,
    private procesosService: ProcesosService,
    private cdr: ChangeDetectorRef) {
      
    this.items = [
      {
        label: 'Oportunidades',
        command: () => {
          this.agregarOportunidad();
        }
      },
      {
        label: 'Prospectos',
        command: () => {
          this.agregarProspecto();
        }
      },
      {
        label: 'Contactos',
        command: () => {
          this.agregarContacto();
        }
      },
    ];
  }
  ngOnDestroy(): void {
    if (this.asistenteSubscription) {
      this.asistenteSubscription.unsubscribe();
    }
    if (this.sessionCountdownInterval) {
      clearInterval(this.sessionCountdownInterval);
    }
  }
  toggleChat(): void {
    this.asistenteSubscription = this.asistenteService.asistenteObservable.subscribe(value => {
      this.asistenteObservableValue = value;
      this.enableAsistenteOperacion = this.asistenteObservableValue === 1;
    });

    this.asistenteService.asistenteSubject.next(this.asistenteObservableValue * (-1));
  }

  @HostListener('document:click', ['$event'])
handleClickOutside(event: MouseEvent): void {
  const targetElement = event.target as HTMLElement;

  const isToggleButtonOperacion = targetElement.closest('#chat-container-operacion'); 
  const isToggleButtonProspeccion = targetElement.closest('#chat-container-prospeccion'); 

  if (this.enableAsistenteOperacion && 
      this.chatContainerOperacion && 
      !this.chatContainerOperacion.nativeElement.contains(targetElement) &&
      !isToggleButtonOperacion) {
    this.enableAsistenteOperacion = false;
    this.asistenteService.asistenteSubject.next(-1);
  }

  if (this.mostrarAsistenteProspeccion && 
      this.chatContainerProspeccion && 
      !this.chatContainerProspeccion.nativeElement.contains(targetElement) &&
      !isToggleButtonProspeccion) {
    this.mostrarAsistenteProspeccion = false;
    this.cdr.detectChanges();
  }
}
  toggleOptions(): void {
    this.optionsVisible = !this.optionsVisible;
  }
  hideSubmenu(): void {
    this.optionsVisible = false;
  }
  showSubmenu(): void {
    this.optionsVisible = true;
  }

  toggleOptionsProcesos(): void {
    this.optionsVisibleProcesos = !this.optionsVisibleProcesos;
  }
  hideSubmenuProcesos(): void {
    this.optionsVisibleProcesos = false;
  }
  showSubmenuProcesos(): void {
    this.optionsVisibleProcesos = true;
  }
  ngOnInit(): void {
    this.licenciaPlatino = localStorage.getItem('licencia')! === EnumLicencias.Platino;
    console.log(localStorage.getItem('licencia')!);
    this.startSessionCountdown();
    this.authService.sessionReset$.subscribe(() => {
      this.startSessionCountdown();
    });
    this.asistenteService.asistenteSubject.next(-1);
    this.cargarImagenEmpresa();
    const perfil = {
      nombre: localStorage.getItem('username')!,//'Perfil',
      ruta: '/perfil',
      icono: 'bi bi-person-circle',
      tooltip: 'Perfil',
      subMenu: []
    };

    this.nombreUsuario = localStorage.getItem('username')!;
    this.licencia = localStorage.getItem('licencia')!;
    this.getProcesos();

    //Suscripcion a servicio de modal de oportunidades, recibe datos para el despliegue del modal
    this.modalSubscription = this.modalOportunidadesService.modalState$.subscribe((state) => {
      this.modalVisibleOportunidades = state.showModal;
      this.insertar = state.insertar;
      this.oportunidades = state.oportunidades;
      this.oportunidadSeleccionada = state.oportunidadSeleccionada;
    });

    //Suscripcion a servicio de modal de prospectos, recibe datos para el despliegue del modal
    this.modalProspectosSubscription = this.modalOportunidadesService.modalProspectoState$.subscribe((state) => {
      this.modalVisibleProspectos = state.showModal;
      this.insertarProspecto = state.insertarProspecto;
      this.prospectos = state.prospectos;
      this.prospectoSeleccionado = state.prospectoSeleccionado;
    });

    //Suscripcion a servicio de modal de contactos, recibe datos para el despliegue del modal
    this.modalContactosSubscription = this.modalOportunidadesService.modalContactoState$.subscribe((state) => {
      this.modalVisibleContactos = state.showModal;
      this.insertarContacto = state.insertarContacto;
      this.contactos = state.contactos;
      this.contactoSeleccionado = state.contactoSeleccionado;
    });

    this.modalEtapasSubscription = this.modalEtapasService.modalState$.subscribe((state) => {
      this.modalVisibleEtapas = state.showModal;
      this.insertarEtapas = state.insertarEtapas;
      this.etapas = state.etapas;
      this.plantillas = state.plantillas;
    });

    this.getComboEtapas();
  }

  getComboEtapas() {
  
      const idUsuario = this.authService.obtenerIdUsuario();
      const idEmpresa = this.authService.obtenerIdEmpresa();
  
      this.procesosService.getComboEtapas(idEmpresa, idUsuario).subscribe({
        next: (result: OportunidadesPorEtapa[]) => {
  
          this.etapasCombo = result.map(etapa => ({
            ...etapa,
            expandido: true, // Expandir todas las etapas por defecto
            editandoNombre: false,
            tarjetas: etapa.tarjetas || [],
            orden: etapa.orden,
            probabilidad: etapa.probabilidad,
            idEmpresa: idUsuario,
            idUsuario: idUsuario,
            idStage: etapa.idStage
          }));

          const idProceso = Number(localStorage.getItem('idProceso'));
          const usuario = idUsuario;
          if (idProceso <= 0 && usuario > 0) {
            this.modalEtapasService.openModal(true, true, this.etapas, this.etapasCombo, this.plantillas);
          }
          else {
            this.modalEtapasService.closeModal();
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar oportunidades por etapa'
          });
        }
      });
    }

  cargarImagenEmpresa() {
    const idEmpresaStr = localStorage.getItem('idEmpresa');
    const idEmpresa = idEmpresaStr ? Number(idEmpresaStr) : null;

    if (idEmpresa === null || isNaN(idEmpresa)) {
      this.imagenEmpresaUrl = `${this.baseUrl}/assets/img/logotipo-glupoint.png?t=${Date.now()}`;
      return;
    }

    this.authService.obtenerUrlImagenEmpresa(idEmpresa).subscribe({
      next: (urlImagen) => {
        this.imagenEmpresaUrl = urlImagen?.trim() ? `${urlImagen}?t=${Date.now()}` : `${this.baseUrl}/assets/img/logotipo-glupoint.png?t=${Date.now()}`;

      },
      error: (err) => {
        console.error('Error al cargar imagen:', err);
        this.imagenEmpresaUrl = this.baseUrl + '/assets/img/logotipo-glupoint.png';
      }
    });
  }

  getProcesos() {
      this.procesosService.getProcesos(this.authService.obtenerIdEmpresa()).subscribe({
        next: (result: Procesos[]) => {
          this.procesos = result.filter(proceso => proceso.estatus == true);
          const idProceso = Number(localStorage.getItem('idProceso'));
          let procesoSeleccionado = this.procesos.find(proceso => proceso.idProceso == idProceso);
          if (procesoSeleccionado) {
          this.procesoSeleccionado = procesoSeleccionado;
        }

        if (!this.procesoSeleccionado && this.procesos.length > 0) {
          this.procesoSeleccionado = this.procesos[0];
        }

          //localStorage.setItem('idProceso', this.procesos[0].idProceso.toString());
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: error.errorMessage,
          });
        },
      });
    }

seleccionarProceso(proceso: Procesos) {
  console.log('Proceso seleccionado:', proceso);
  localStorage.setItem('idProceso', proceso.idProceso.toString());
  window.location.reload();
}


  ngAfterViewInit() {
    if (this.splitButton) {
      const mainButton = this.splitButton.containerViewChild?.nativeElement.querySelector('.p-button-secondary');
      if (mainButton) {
        mainButton.addEventListener('click', (event: MouseEvent) => {
          this.splitButton.onDropdownButtonClick(event);
        });
      }
    }
  }

  agregarOportunidad() {
    this.modalOportunidadesService.openModal(true, true, [], {})
  }

  agregarProspecto() {
    this.prospectoSeleccionado = {
      bandera: '',
      idProspecto: 0,
      nombre: '',
      ubicacionFisica: '',
      estatus: 0,
      desEstatus: '',
      nombreSector: '',
      idSector: 0,
      totalOportunidades: 0,
      proceso: 0,
      ganadas: 0,
      perdidas: 0,
      canceladas: 0,
      eliminadas: 0,
      idEmpresa: 0,
      porcEfectividad: 0,
    };
    this.modalOportunidadesService.openModalProspecto(true, true, [], this.prospectoSeleccionado)

  }

  agregarContacto() {
    this.contactoSeleccionado = {
      idContactoProspecto: 0,
      nombre: '',
      apellidos: '',
      telefono: '',
      correoElectronico: '',
      prospecto: '',
      idEmpresa: 0,
      idProspecto: 0,
      estatus: 0,
      desEstatus: '',
      nombreCompleto: '',
      bandera: ''
    };
    this.modalOportunidadesService.openModalContacto(true, true, [], this.contactoSeleccionado)

  }

  navigateTo(path: string) {
    if (path === '/perfil') {
      // if(this.modalVisible)
      //   this.modalService.closeModal();
      // else
      this.modalService.toggleModal();

    } else {
      this.modalService.closeModal();
      this.router.navigate([path]);
    }
  }

  onModalCloseOportunidades() {
    this.modalOportunidadesService.closeModal();
  }

  goToConfiguracionProcesos() {
    this.router.navigate(['/procesos']);
  }


  manejarResultadoOportunidades(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.modalOportunidadesService.closeModal(result);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }

  onModalCloseProspectos() {
    this.catalogoService.cargarProspectos(this.authService.obtenerIdEmpresa());
    this.modalOportunidadesService.closeModalProspecto();
  }

  manejarResultadoProspectos(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.modalOportunidadesService.closeModalProspecto(result);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }

  onModalCloseContactos() {
    this.modalOportunidadesService.closeModalContacto();
  }

  onModalCloseEtapas() {
    this.modalEtapasService.closeModal();
  }

  manejarResultadoContactos(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.modalOportunidadesService.closeModalContacto(result);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }

manejarResultadoAbrirInputsAdicionales(resut: any) {
    this.informacionReferenciaCatalgo = resut
    this.getCamposAdicionales();

  }

manejarResultadoCamposAdicionales(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.modalCamposAdicionalesService.closeModal();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }

  onModalCloseCamposAdicionales() {
    this.modalCamposAdicionalesService.closeModal();
    //Se debe reabrir modal de contacto o prospecto independientemente si guardo datos o no
    setTimeout(() => {
      switch (this.informacionReferenciaCatalgo.tipoCatalogo.toLowerCase()) {
        case "contactos":
          this.modalOportunidadesService.openModalContacto(true, this.informacionReferenciaCatalgo.insertar, [], this.informacionReferenciaCatalgo.referencia);
          break;
        default:
          this.modalOportunidadesService.openModalProspecto(true, this.informacionReferenciaCatalgo.insertar, [], this.informacionReferenciaCatalgo.referencia)
          break;
      }
    }, 1000);
  }

  getCamposAdicionales() {

    const idUsuario = this.authService.obtenerIdUsuario();
    const idEmpresa = this.authService.obtenerIdEmpresa();

    this.contactosService.getCamposAdicionales(idEmpresa, this.informacionReferenciaCatalgo.tipoCatalogo).subscribe({
      next: (result: CamposAdicionales[]) => {

        this.camposAdicionales = result.map(campos => ({
          ...campos,
          idInput: campos.idInput,
          nombre: campos.nombre,
          etiqueta: campos.etiqueta,
          requerido: campos.requerido,
          tipoCampo: campos.tipoCampo,
          rCatalogoInputId: campos.rCatalogoInputId,
          tipoCatalogoInput: campos.tipoCatalogoInput,
          orden: campos.orden,
          idEmpresa: idEmpresa,
          idUsuario: idUsuario,
          modificado: false
        }));

        this.consultarCamposAdicionalesPorCatalogo(idEmpresa, idUsuario);
      },
      error: (error) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar informacion de campos adicionales'
        });
      }
    });
  }


  consultarCamposAdicionalesPorCatalogo(idEmpresa: number, idUsuario: number) {

    this.contactosService.getCamposAdicionalesPorCatalogo(idEmpresa, this.informacionReferenciaCatalgo.tipoCatalogo).subscribe({
      next: (result: CamposAdicionales[]) => {

        this.camposAdicionalesPorCatalogo = result.map(campos => ({
          ...campos,
          idInput: campos.idInput,
          nombre: campos.nombre,
          etiqueta: campos.etiqueta,
          requerido: campos.requerido,
          tipoCampo: campos.tipoCampo,
          rCatalogoInputId: campos.rCatalogoInputId,
          tipoCatalogoInput: campos.tipoCatalogoInput,
          orden: campos.orden,
          idEmpresa: idEmpresa,
          idUsuario: idUsuario,
          modificado: false
        }));
        this.modalCamposAdicionalesService.openModal(true, this.camposAdicionales, this.camposAdicionalesPorCatalogo, this.informacionReferenciaCatalgo.pantalla)
      },
      error: (error) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar informacion de campos adicionales'
        });
      }
    });
  }

startDrag(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.app-chat-header')) {
      return;
    }
    const el = this.chatContainerOperacion.nativeElement as HTMLElement;
    this.isDragging = true;
    this.offset = {
      x: event.clientX - el.getBoundingClientRect().left,
      y: event.clientY - el.getBoundingClientRect().top,
    };

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.endDrag);
  }

  onDrag = (event: MouseEvent): void => {
    if (!this.isDragging) return;

    const x = event.clientX - this.offset.x;
    const y = event.clientY - this.offset.y;

    const el = this.chatContainerOperacion.nativeElement as HTMLElement;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.right = 'auto'; // anula el "right" para permitir mover
  };

  endDrag = (): void => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.endDrag);
  };

  logout() {
    this.authService.logout('Sesión cerrada por el usuario');
    this.router.navigate(['/login']);
  }

  startSessionCountdown() {
    // sessionTimeout está en milisegundos
    let remaining = this.authService['sessionTimeout'] / 1000; // en segundos
    let remainingInactividad =  this.authService['sessionActivityTimeout'] / 1000;

    if (this.sessionCountdownInterval) {
      clearInterval(this.sessionCountdownInterval);
    }

    this.updateCountdownDisplay(remaining);

    if (this.sessionCountdownIntervalInactividad) {
      clearInterval(this.sessionCountdownIntervalInactividad);
    }

    this.updateCountdownDisplay(remainingInactividad);

    this.sessionCountdownInterval = setInterval(() => {
      remaining--;
      this.updateCountdownDisplay(remaining);

      if (remaining <= 0) {
        clearInterval(this.sessionCountdownInterval);
      }
    }, 1000);

    this.sessionCountdownIntervalInactividad = setInterval(() => {
      remainingInactividad--;
      this.updateCountdownDisplayInactividad(remainingInactividad);

      if (remainingInactividad <= 0) {
        clearInterval(this.sessionCountdownIntervalInactividad);
      }
    }, 1000);
  }

  updateCountdownDisplay(remainingSeconds: number) {
    this.sessionCountdownMinutes = Math.floor(remainingSeconds / 60);
    this.sessionCountdownSeconds = remainingSeconds % 60;
  }
  updateCountdownDisplayInactividad(remainingSeconds: number) {
    this.sessionCountdownMinutesInactividad = Math.floor(remainingSeconds / 60);
    this.sessionCountdownSecondsInactividad = remainingSeconds % 60;
  }

   manejarResultadoEtapas(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.modalEtapasService.closeModal(result);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }
  startDragProspeccion(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.app-chat-header-prospeccion')) {
      return;
    }
    const el = this.chatContainerProspeccion.nativeElement as HTMLElement;
    this.isDragging = true;
    this.offset = {
      x: event.clientX - el.getBoundingClientRect().left,
      y: event.clientY - el.getBoundingClientRect().top,
    };

    document.addEventListener('mousemove', this.onDragProspeccion);
    document.addEventListener('mouseup', this.endDragProspeccion);
  }

  onDragProspeccion = (event: MouseEvent): void => {
    if (!this.isDragging) return;

    const x = event.clientX - this.offset.x;
    const y = event.clientY - this.offset.y;

    const el = this.chatContainerProspeccion.nativeElement as HTMLElement;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.right = 'auto'; // anula el "right" para permitir mover
  };

  endDragProspeccion = (): void => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onDragProspeccion);
    document.removeEventListener('mouseup', this.endDragProspeccion);
  };

  mostrarAsistenteProspeccion = false;

}
