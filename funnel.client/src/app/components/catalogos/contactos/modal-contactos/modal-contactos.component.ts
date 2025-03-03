import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { SEL_Contacto } from '../../../../interfaces/contactos';

import { ContactosService } from '../../../../services/contactos.service';
import { requestContacto } from '../../../../interfaces/contactos';
import { LoginService } from '../../../../services/login.service';


@Component({
  selector: 'app-modal-contactos',
  standalone: false,
  templateUrl: './modal-contactos.component.html',
})
export class ModalContactosComponent {

  constructor(private contactosService : ContactosService, private messageService: MessageService, private readonly loginService: LoginService) { }
  @Input() contacto!: SEL_Contacto;
  @Input() contactos: SEL_Contacto[]=[];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: requestContacto;

  contactoActivo: boolean = false;
  selectedLicencia: number | undefined;

  prospectos: any[] = [];  
  selectedProspecto: number | undefined; 

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  onDialogShow() {
    this.contactoActivo = this.contacto?.estatus === 1 ? true : false;
    this.cargarProspectos();

    this.selectedProspecto = this.contacto?.idProspecto;
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  actualizaContacto() {
    console.log(this.request);
    if (!this.request) {
      this.request = {} as requestContacto;
    }
    this.request.bandera = 'UPDATE';
    this.request.idContactoProspecto = this.contacto.idContactoProspecto;
    this.request.nombre = this.contacto.nombre;
    this.request.apellidos= this.contacto.apellidos;
    this.request.telefono = this.contacto.telefono;
    this.request.correoElectronico = this.contacto.correoElectronico;
    this.request.idProspecto = this.selectedProspecto ?? 0;
    this.request.estatus = this.contactoActivo ? 1 : 0;
    this.request.idEmpresa = this.loginService.obtenerIdEmpresa();
    console.log(this.request);
    this.contactosService.postContacto(this.request).subscribe(
      {
        next: (result: baseOut) => {
          this.result.emit(result);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        },
        error: (error: baseOut)=> {
          this.result.emit(error);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        }
      }
    );
  }

  guardarContanto(){
    if (!this.request) {
      this.request = {} as requestContacto;
    }
    if (this.camposInvalidosInsertar()) {
      this.mostrarToastError();
      return;
    }
    this.request.bandera = 'INSERT';
    this.request.idContactoProspecto = this.contacto.idContactoProspecto;
    this.request.nombre = this.contacto.nombre;
    this.request.apellidos= this.contacto.apellidos;
    this.request.telefono = this.contacto.telefono;
    this.request.correoElectronico = this.contacto.correoElectronico;
    this.request.idProspecto = this.selectedProspecto ?? 0;
    this.request.estatus = this.contactoActivo ? 1 : 0;
    this.request.idEmpresa = this.loginService.obtenerIdEmpresa();

    this.contactosService.postContacto(this.request).subscribe(
      {
        next: (result: baseOut) => {
          this.result.emit(result);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        },
        error: (error: baseOut)=> {
          this.result.emit(error);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        }
      }
    );
  }

  cargarProspectos() {
    this.contactosService.getProspectos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        this.prospectos = result;
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

  validarContacto(): boolean {
    const nombreCompletoNuevo = `${this.contacto.nombre?.toUpperCase()} ${this.contacto.apellidos?.toUpperCase()}`;

    if (this.contactos.some(contacto => contacto.nombreCompleto?.toUpperCase() === nombreCompletoNuevo)) {
      return false;
    }
    return true;
  }

  esCampoInvalido(valor: any): boolean {
    return valor === null || valor === undefined || valor === '' || valor <= 0;
  }
  camposInvalidosInsertar(): boolean {
    return (
      this.esCampoInvalido(this.contacto.nombre) || 
      this.esCampoInvalido(this.contacto.apellidos) || 
      this.esCampoInvalido(this.contacto.telefono) ||
      this.esCampoInvalido(this.contacto.correoElectronico) ||
      !this.validarContacto()
    );
  }

  camposInvalidosEditar(): boolean {
    console.log(this.contacto);
    return (
      this.esCampoInvalido(this.contacto.nombre) || 
      this.esCampoInvalido(this.contacto.apellidos) || 
      this.esCampoInvalido(this.contacto.telefono) ||
      this.esCampoInvalido(this.contacto.correoElectronico) ||
      !this.validarContacto()
    );
  }

  mostrarToastError() {
    let mensaje='Es Necesario llenar los campos indicados.';
    console.log(this.validarContacto());
    this.messageService.clear();
    if (!this.validarContacto() && this.insertar) {
      mensaje = 'El Contacto ya existe.';
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
    });
  }
}
