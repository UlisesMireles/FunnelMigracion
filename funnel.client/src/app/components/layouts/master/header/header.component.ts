import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AsistenteService } from '../../../../services/asistenteOperacion/asistente.service';
import { ModalService } from '../../../../services/modal-perfil.service';
import { Router } from '@angular/router';
import { ModalOportunidadesService } from '../../../../services/modalOportunidades.service';
import { Oportunidad } from '../../../../interfaces/oportunidades';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Prospectos } from '../../../../interfaces/prospecto';
import { Contacto } from '../../../../interfaces/contactos';
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

  private modalSubscription!: Subscription;
  private modalProspectosSubscription!: Subscription;
  private modalContactosSubscription!: Subscription;

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

  constructor(private asistenteService: AsistenteService, private modalService: ModalService, private router: Router,
    private messageService: MessageService, private modalOportunidadesService: ModalOportunidadesService) { }

  toggleChat(): void {
    this.enableAsistenteOperacion = !this.enableAsistenteOperacion;
    // Si necesitas notificar al servicio
    this.asistenteService.asistenteSubject.next(this.enableAsistenteOperacion ? 1 : -1);
  }

  toggleOptions() {
    this.optionsVisible = !this.optionsVisible;
  }

  ngOnInit(): void {
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
      this.insertar = state.insertar;
      this.prospectos = state.prospectos;
      this.prospectoSeleccionado = state.prospectoSeleccionado;
    });

    //Suscripcion a servicio de modal de contactos, recibe datos para el despliegue del modal
    this.modalContactosSubscription = this.modalOportunidadesService.modalContactoState$.subscribe((state) => {
      this.modalVisibleContactos = state.showModal;
      this.insertar = state.insertar;
      this.contactos = state.contactos;
      this.contactoSeleccionado = state.contactoSeleccionado;
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

      //  console.log('this.modalVisible ' + this.modalVisible);
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

}
