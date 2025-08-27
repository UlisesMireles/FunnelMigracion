import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactosService } from '../../../services/contactos.service';
import { Contacto } from '../../../interfaces/contactos';
import { CamposAdicionales } from '../../../interfaces/campos-adicionales';
import { ModalCamposAdicionalesService } from '../../../services/modalCamposAdicionales.service';
import { ModalOportunidadesService } from '../../../services/modalOportunidades.service';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-registro-contactos',
  standalone: false,
  templateUrl: './registro-contactos.component.html',
  styleUrl: './registro-contactos.component.css'
})
export class RegistroContactosComponent {
  //Modal Contactos
  insertarContacto: boolean = true;
  modalVisibleContactos: boolean = false;
  contactos: Contacto[] = [];
  contactoSeleccionado!: Contacto;
  private modalContactosSubscription!: Subscription;

  //Modal Campos Adicionales
  camposAdicionales: CamposAdicionales[] = [];
  camposAdicionalesPorCatalogo: CamposAdicionales[] = [];
  modalVisibleCamposAdicionales: boolean = false;
  informacionReferenciaCatalgo: any = {};

  baseUrl: string = environment.baseURLAssets;
  constructor(private route: ActivatedRoute, private modalCamposAdicionalesService: ModalCamposAdicionalesService, private modalOportunidadesService: ModalOportunidadesService, private contactosService: ContactosService,
    private messageService: MessageService, private readonly authService: LoginService,
  ) { }

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        try {
          const decoded = JSON.parse(atob(token));
          const idUsuario = decoded.idUsuario;
          const idEmpresa = decoded.idEmpresa;
          console.log('ID Usuario:', idUsuario);
          console.log('ID Empresa:', idEmpresa);
        } catch (e) {
          console.error('Token inválido');
        }
      } else {
        console.log('Falta token');
      }
      
    });
     //Suscripcion a servicio de modal de contactos, recibe datos para el despliegue del modal
     this.modalContactosSubscription = this.modalOportunidadesService.modalContactoState$.subscribe((state) => {
      this.modalVisibleContactos = state.showModal;
      this.insertarContacto = state.insertarContacto;
      this.contactos = state.contactos;
      this.contactoSeleccionado = state.contactoSeleccionado;
    });
     this.agregarContacto();
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

}
