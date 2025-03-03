import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { SEL_Contacto } from '../../../../interfaces/contactos';

import { ContactosService } from '../../../../services/contactos.service';
import { requestContacto } from '../../../../interfaces/contactos';


@Component({
  selector: 'app-modal-contactos',
  standalone: false,
  templateUrl: './modal-contactos.component.html',
})
export class ModalContactosComponent {

  constructor(private contactosService : ContactosService, private messageService: MessageService) { }
  @Input() contacto!: SEL_Contacto;
  @Input() contactos: SEL_Contacto[]=[];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: requestContacto;

  contactoActivo: boolean = false;
  selectedLicencia: number | undefined;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  onDialogShow() {
    this.contactoActivo = this.contacto?.estatus === 1 ? true : false;
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  actualizaContacto() {
    if (!this.request) {
      this.request = {} as requestContacto;
    }
    if (this.camposInvalidosEditar()) {
      this.mostrarToastError();
      return;
    }
    this.request.bandera = 'UPDATE';
    this.request.idContactoProspecto = this.contacto.idContactoProspecto;
    this.request.nombre = this.contacto.nombre;
    this.request.apellidos= this.contacto.apellidos;
    this.request.telefono = this.contacto.telefono;
    this.request.correoElectronico = this.contacto.correoElectronico;
    this.request.idProspecto = this.contacto.idProspecto;
    this.request.estatus = this.contactoActivo ? 1 : 0;
    this.request.idEmpresa = 1;

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
    this.request.idProspecto = 1;
    this.request.estatus = this.contactoActivo ? 1 : 0;
    this.request.idEmpresa = 1;

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

  validarContacto(): boolean {
    if (this.contactos.some(contacto => contacto.nombre?.toUpperCase() === this.contacto.nombre?.toUpperCase())) {
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
      !this.validarContacto()
    );
  }

  camposInvalidosEditar(): boolean {
    return (
      this.esCampoInvalido(this.contacto.nombre)
    );
  }

  mostrarToastError() {
    let mensaje='Es Necesario llenar los campos indicados.';
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
