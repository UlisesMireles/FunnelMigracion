import { Component, EventEmitter,Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RequestProspecto } from '../../../../interfaces/prospecto';
import { BaseOut } from '../../../../interfaces/utils/baseOut';
import { Prospectos } from '../../../../interfaces/prospecto';
import { ProspectoService } from '../../../../services/prospecto.service';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
@Component({
  selector: 'app-modal-prospectos',
  standalone: false,
  templateUrl: './modal-prospectos.component.html',
  styleUrl: './modal-prospectos.component.css'
})
export class ModalProspectosComponent {
  constructor (private prospectoService: ProspectoService, private messageService: MessageService) { }
  @Input() prospecto!: Prospectos;
  @Input() prospectos: Prospectos[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: RequestProspecto;

  prospectoActivo: boolean = false;
  
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  onDialogShow(){
    this.prospectoActivo = this.prospecto?.desEstatus == 'Activo';
  }
  
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  actualizarProspecto() {
    if (!this.prospecto) {
      this.request = {} as RequestProspecto;
    }
    if (this.camposInvalidosEditar()) {
      this.mostrarToastError();
      return;
    }
    this.request.bandera='UPD-PROSPECTO';
    this.request.idProspecto = this.prospecto.idProspecto;
    this.request.nombre = this.prospecto.nombre;
    this.request.ubicacionFisica = this.prospecto.ubicacionFisica;
    
    this.request.estatus = this.prospectoActivo ? 1 : 0;
    this.prospectoService.postINSUPProspecto(this.request).subscribe(
      {
        next: (result: baseOut) => {
          this.result.emit(result);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        },
        error: (error) => {
          this.result.emit(error);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        }
      }
    );
  }

  guardarProspecto() {
    if (!this.request){
      this.request = {} as RequestProspecto;
    }
    if(this.camposInvalidosInsertar()){
      this.mostrarToastError();
      return;
    }
    this.request.bandera='INS-PROSPECTO';
    this.request.idProspecto = this.prospecto.idProspecto;
    this.request.nombre = this.prospecto.nombre;
    this.request.ubicacionFisica = this.prospecto.ubicacionFisica;
    this.request.idEmpresa = 1; 
    this.request.idSector = this.prospecto.idSector;
    this.request.estatus = this.prospectoActivo ? 1 : 0;
    this.prospectoService.postINSUPProspecto(this.request).subscribe(
      {
        next: (result: baseOut) => {
          this.result.emit(result);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        },
        error: (error) => {
          this.result.emit(error);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        }
      }
    );
  }

  validarProspecto(): boolean {
    if (this.prospectos.some(prospecto=>prospecto.nombre?.toUpperCase() === this.prospecto.nombre?.toUpperCase())) {
      return false;
    }
    return true;
  }

  esCampoInvalido(valor:any): boolean {
    return (valor === null || valor === undefined || valor === '' || valor<=0);
  }

  camposInvalidosInsertar(): boolean {
    return(
      this.esCampoInvalido(this.prospecto.nombre) ||
      this.esCampoInvalido(this.prospecto.ubicacionFisica)||
      !this.validarProspecto()
    );
  }

  camposInvalidosEditar(): boolean {
    return(
      this.esCampoInvalido(this.prospecto.nombre) ||
      this.esCampoInvalido(this.prospecto.ubicacionFisica)
    );
}

mostrarToastError() {
  let mensaje ='Es necesario llenar los campos indicados.';
  this.messageService.clear();
  if (!this.validarProspecto()&& this.insertar) {
    mensaje = 'El prospecto ya existe.';
  }
  this.messageService.add({
    severity: 'error',
    summary: 'Se ha producido un error.',
    detail: mensaje,
  });
}}
