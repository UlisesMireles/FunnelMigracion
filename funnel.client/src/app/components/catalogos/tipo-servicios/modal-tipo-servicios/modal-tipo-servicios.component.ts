import { Component, EventEmitter, Input, Output, SimpleChanges  } from '@angular/core';

/*Primeng*/
import { MessageService } from 'primeng/api';

import { TipoServicio } from '../../../../interfaces/tipoServicio';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { TipoServicioService } from '../../../../services/tipo-servicio.service';
import { LoginService } from '../../../../services/login.service';
import { RequestTipoServicio } from '../../../../interfaces/tipoServicio';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-tipo-servicios',
  standalone: false,
  templateUrl: './modal-tipo-servicios.component.html',
  
   
})
export class ModalTipoServiciosComponent {


constructor(private TipoServicioService: TipoServicioService, private messageService: MessageService, private loginService: LoginService, private fb: FormBuilder) { }
  @Input() tipoServicio!: TipoServicio;
  @Input() tipoServicios: TipoServicio[]=[];
  @Input() tiposServicios: any[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: RequestTipoServicio;

  servicioForm!: FormGroup;
  tiposservicio: any[] = [];

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  ngOnInit() {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tipoServicio'] && this.tipoServicio) {
      this.inicializarFormulario();
    }
  }
  
  inicializarFormulario() {
    if (this.insertar) {

      this.servicioForm = this.fb.group({
        idTipoProyecto: [0],
        descripcion: ['', [Validators.required]],
        abreviatura: ['', [Validators.required]],
        estatus: [true],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        bandera: ['INSERT']
      });
    } else {

      if (this.tipoServicio) {
        this.servicioForm = this.fb.group({
          idTipoProyecto: [this.tipoServicio.idTipoProyecto],
          descripcion: [this.tipoServicio.descripcion, [Validators.required]],
          abreviatura: [this.tipoServicio.abreviatura, [Validators.required]],
          estatus: [this.tipoServicio.estatus === 1],  
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          bandera: ['UPDATE']
        });
      }
    }
  }
  
  
  onDialogShow() {
    this.inicializarFormulario(); 
  }
   close() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.closeModal.emit();
    }

    

    guardarServicio() {
      if (this.servicioForm.invalid) {
        this.mostrarToastError();
        return;
      }
     
    
      this.servicioForm.controls['estatus'].setValue(this.servicioForm.value.estatus ? 1 : 0);
      this.servicioForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
      this.servicioForm.controls['bandera'].setValue(this.insertar ? 'INSERT' : 'UPDATE');
     
      console.log(this.servicioForm.value);
     
      this.TipoServicioService.postGuardarServicio(this.servicioForm.value).subscribe({
        next: (result: baseOut) => {
          console.log(result);
          this.result.emit(result);
          this.close();
        },
        error: (error: baseOut) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: error.errorMessage,
          });
        },
      });
    }

      
      mostrarToastError() {
        console.log(this.servicioForm);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Es necesario llenar los campos indicados.',
        });
      }


}
