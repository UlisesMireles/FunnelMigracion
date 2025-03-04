import { Component, EventEmitter,Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RequestProspecto } from '../../../../interfaces/prospecto';
import { BaseOut } from '../../../../interfaces/utils/baseOut';
import { Prospectos } from '../../../../interfaces/prospecto';
import { ProspectoService } from '../../../../services/prospecto.service';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../../services/login.service';
@Component({
  selector: 'app-modal-prospectos',
  standalone: false,
  templateUrl: './modal-prospectos.component.html',
  styleUrl: './modal-prospectos.component.css'
})
export class ModalProspectosComponent {
  constructor (private prospectoService: ProspectoService, private messageService: MessageService, private readonly loginService: LoginService) { }
  @Input() prospecto!: Prospectos;
  @Input() prospectos: Prospectos[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: RequestProspecto;

  prospectoActivo: boolean = false;
  sectores: any[] = [];
  
  
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  /*ngOnInit():void {
    this.cargarSectores();
    if(this.insertar){
      this.prospecto = {} as Prospectos;
    }
    if(this.prospecto){
      this.prospecto.idSector = this.prospecto.idSector == null ? 0 : this.prospecto.idSector;
    }
  }*/
  onDialogShow(){
    this.prospectoActivo = this.prospecto?.desEstatus == 'Activo';
    this.cargarSectores();
  }

  cargarSectores() {
    this.prospectoService.getSectores(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        this.sectores = result.map((sector: any) => ({ label: sector.nombreSector, value: sector.idSector }));
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
  
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  actualizarProspecto() {
    if (!this.request) {
      this.request = {} as RequestProspecto;
    }
    if (this.camposInvalidosEditar()) {
      this.mostrarToastError();
      return;
    }
    this.request.bandera='UPDATE';
    this.request.idProspecto = this.prospecto.idProspecto;
    this.request.nombre = this.prospecto.nombre;
    this.request.ubicacionFisica = this.prospecto.ubicacionFisica;
    this.request.idSector = this.prospecto.idSector;
    this.request.idEmpresa = this.loginService.obtenerIdEmpresa();
    this.request.estatus = this.prospectoActivo ? 1 : 0;
    this.prospectoService.postInsertProspecto(this.request).subscribe(
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
    if (!this.request) {
      this.request = {} as RequestProspecto;
    }
    console.log(this.request);
    /*if(this.camposInvalidosInsertar()){
      this.mostrarToastError();
      return;
    }*/
    console.log(this.request);
    this.request.bandera='INSERTAR';
    this.request.idProspecto = this.prospecto.idProspecto;
    this.request.nombre = this.prospecto.nombre;
    this.request.ubicacionFisica = this.prospecto.ubicacionFisica;
    this.request.idSector = this.prospecto.idSector;
   
    this.request.idEmpresa = this.loginService.obtenerIdEmpresa();
    this.request.estatus = this.prospectoActivo ? 1 : 0; 
    console.log(this.request);  
    this.prospectoService.postInsertProspecto(this.request).subscribe(
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
      this.esCampoInvalido(this.prospecto.idSector) ||
      this.esCampoInvalido(this.prospecto.nombreSector) ||
      !this.validarProspecto()
    );
  }

  camposInvalidosEditar(): boolean {
    return(
      this.esCampoInvalido(this.prospecto.nombre) ||
      this.esCampoInvalido(this.prospecto.ubicacionFisica)||
      this.esCampoInvalido(this.prospecto.idSector)
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
