import { Component, EventEmitter, Input, Output } from '@angular/core';

/*Primeng*/
import { MessageService } from 'primeng/api';

import { TipoServicio } from '../../../../interfaces/tipoServicio';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { TipoServicioService } from '../../../../services/tipo-servicio.service';
import { LoginService } from '../../../../services/login.service';
import { RequestTipoServicio } from '../../../../interfaces/tipoServicio';


@Component({
  selector: 'app-modal-tipo-servicios',
  standalone: false,
  templateUrl: './modal-tipo-servicios.component.html',
  styleUrl: './modal-tipo-servicios.component.css',
  //providers: [TipoServicioService] 
})
export class ModalTipoServiciosComponent {
constructor(private TipoServicioService: TipoServicioService, private messageService: MessageService, private loginService: LoginService) { }
  @Input() tipoServicio!: TipoServicio;
  @Input() tipoServicios: TipoServicio[]=[];
  @Input() tiposServicios: any[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: RequestTipoServicio;

  tiposervicioActivo: boolean = false;
  tiposservicio: any[] = [];

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  onDialogShow() {
    this.tiposervicioActivo = this.tipoServicio?.desEstatus === 'Activo';
  }
   close() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.closeModal.emit();
    }
    actualizaServicio() {
        if (!this.request) {
          this.request = {} as RequestTipoServicio;
        }

        if (this.camposInvalidosEditar()) {
          this.mostrarToastError();
          return;
        }
        
        this.request.bandera = 'UPDATE';
        this.request.idTipoServicio = this.tipoServicio.idTipoServicio;
        this.request.descripcion = this.tipoServicio.descripcion;
        this.request.abreviatura= this.tipoServicio.abreviatura;
        this.request.estatus = this.tiposervicioActivo ? 1 : 0;
        this.request.idEmpresa = 1;
        

        this.TipoServicioService.postGuardarServicio(this.request).subscribe(
          {
            
            next: (result: baseOut) => {
              console.log(this.request),
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
      guardarServicio(){
        if (!this.request) {
          this.request = {} as RequestTipoServicio;
        }
        if (this.camposInvalidosInsertar()) {
          this.mostrarToastError();
          return;
        }
        this.request.bandera = 'INSERT';
        this.request.idTipoServicio = this.tipoServicio.idTipoServicio;
        this.request.descripcion = this.tipoServicio.descripcion;
        this.request.abreviatura= this.tipoServicio.abreviatura;
        this.request.estatus = this.tiposervicioActivo ? 1 : 0;
        this.request.idEmpresa = 1;
  
        this.TipoServicioService.postGuardarServicio(this.request).subscribe(
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
      validarServicio(): boolean {
        if (this.tipoServicios.some((tipoServicio: TipoServicio) =>
          tipoServicio.descripcion?.toUpperCase() === this.tipoServicio.descripcion?.toUpperCase()
        )) {          
          return false;
        }
        return true;
      }
      esCampoInvalido(valor: any): boolean {
        return valor === null || valor === undefined || valor === '' || valor <= 0;
      }
      camposInvalidosInsertar(): boolean {
        return (
          this.esCampoInvalido(this.tipoServicio.descripcion) ||
          this.esCampoInvalido(this.tipoServicio.abreviatura)||
          !this.validarServicio()
        );
      }
      camposInvalidosEditar(): boolean {
        return (
          this.esCampoInvalido(this.tipoServicio.descripcion) ||
          this.esCampoInvalido(this.tipoServicio.abreviatura)
        );
      }

      /**
       * Método para mostrar un toast de error cuando hay campos vacíos.
       */
      mostrarToastError() {
        let mensaje='Es Necesario llenar los campos indicados.';
        this.messageService.clear();
        if (!this.validarServicio() && this.insertar) {
          mensaje = 'El Servicio ya existe.';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensaje,
        });
      }
}



