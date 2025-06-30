import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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

  insertar: boolean = false;
  insertarContacto: boolean = false;
  insertarProspecto: boolean = false;

  private modalSubscription!: Subscription;
  private modalProspectosSubscription!: Subscription;
  private modalContactosSubscription!: Subscription;

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
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  
  private isDragging = false;
  private offset = { x: 0, y: 0 };
  etapas: OportunidadesPorEtapa[] = [];

  constructor(public asistenteService: AsistenteService, private modalService: ModalService, private router: Router, private readonly catalogoService: CatalogoService,
    private messageService: MessageService, private modalOportunidadesService: ModalOportunidadesService, private readonly authService: LoginService,
    private oportunidadService: OportunidadesService, private modalEtapasService: ModalEtapasService
  ) {
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
  }
  toggleChat(): void {
    this.asistenteSubscription = this.asistenteService.asistenteObservable.subscribe(value => {
      this.asistenteObservableValue = value;
    });
  
    this.asistenteService.asistenteSubject.next(this.asistenteObservableValue * (-1));
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (this.chatContainer && !this.chatContainer.nativeElement.contains(targetElement)) {
      this.enableAsistenteOperacion = false;
      this.asistenteService.asistenteSubject.next(-1);
    }
  }
  toggleOptions(): void {
    this.optionsVisible = !this.optionsVisible;
  }
  hideSubmenu(): void{
    this.optionsVisible = false;
  }
  showSubmenu(): void{
    this.optionsVisible = true;
  }
  ngOnInit(): void {
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


  ngAfterViewInit() {
    if(this.splitButton){
      const mainButton = this.splitButton.containerViewChild?.nativeElement.querySelector('.p-button-secondary');
      if (mainButton) {
        mainButton.addEventListener('click', (event: MouseEvent) => {
          this.splitButton.onDropdownButtonClick(event);
        });
      }
    }
  }

  modalEtapas() {
     this.getOportunidadesPorEtapa();
  }

  getOportunidadesPorEtapa() {
  
      const idUsuario = this.authService.obtenerIdUsuario();
      const idEmpresa = this.authService.obtenerIdEmpresa();
  
      this.oportunidadService.getOportunidadesPorEtapa(idEmpresa, idUsuario).subscribe({
        next: (result: OportunidadesPorEtapa[]) => {
  
          this.etapas = result.map(etapa => ({
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
          this.modalEtapasService.openModal(true, this.etapas)
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


startDrag(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.app-chat-header')) {
      return; 
    }
    const el = this.chatContainer.nativeElement as HTMLElement;
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

    const el = this.chatContainer.nativeElement as HTMLElement;
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
}
