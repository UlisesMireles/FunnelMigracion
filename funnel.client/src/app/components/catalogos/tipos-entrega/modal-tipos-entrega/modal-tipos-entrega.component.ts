import { Component, EventEmitter, Input, Output, SimpleChanges  } from '@angular/core';

/*Primeng*/
import { MessageService } from 'primeng/api';

import { TipoEntrega } from '../../../../interfaces/tipo-entrega';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { TipoEntregaService } from '../../../../services/tipo-entrega.service';
import { LoginService } from '../../../../services/login.service';
import { RequestTipoEntrega } from '../../../../interfaces/tipo-entrega';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-modal-tipos-entrega',
  standalone: false,
  templateUrl: './modal-tipos-entrega.component.html',
  styleUrl: './modal-tipos-entrega.component.css'
})
export class ModalTiposEntregaComponent {
constructor(private TipoEntregaService: TipoEntregaService, private messageService: MessageService, private loginService: LoginService, private fb: FormBuilder) { }
@Input() tipoEntrega!: TipoEntrega;
@Input() tiposEntrega: TipoEntrega[]=[]
@Input() tiposEntregas: any[] = [];
@Input() title: string = 'Modal';
@Input() visible: boolean = false;
@Input() insertar: boolean = false;
request!: RequestTipoEntrega;
tipoEntregaForm!: FormGroup;
tiposentrega: any[] = [];
@Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
@Output() closeModal: EventEmitter<void> = new EventEmitter()
@Output() result: EventEmitter<baseOut> = new EventEmitter()
ngOnInit() {
  this.inicializarFormulario();
}
ngOnChanges(changes: SimpleChanges) {
  if (changes['tipoEntrega'] && this.tipoEntrega) {
    this.inicializarFormulario();
    
    
  }
}
inicializarFormulario() {
  if(this.insertar){
  this.tipoEntregaForm = this.fb.group({
       idTipoEntrega: [0],
      descripcion: ['', [Validators.required]],
      abreviatura: ['', [Validators.required]],
      estatus: [true],
      idEmpresa: [this.loginService.obtenerIdEmpresa()],
      bandera: ['INSERT']
    });
  }else{
    if (this.tipoEntrega) {
      this.tipoEntregaForm = this.fb.group({
        idTipoEntrega: [this.tipoEntrega.idTipoEntrega],
        descripcion: [this.tipoEntrega.descripcion, [Validators.required]],
        abreviatura: [this.tipoEntrega.abreviatura, [Validators.required]],
        estatus: [this.tipoEntrega.estatus === 1],
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
     guardarTipoEntrega() {
      if (this.tipoEntregaForm.valid) {
        this.mostrarToastError();
        return;
      }
      this.tipoEntregaForm.controls['estatus'].setValue(this.tipoEntregaForm.controls['estatus'].value ? 1 : 0);
      this.tipoEntregaForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
      this.tipoEntregaForm.controls['bandera'].setValue(this.insertar ? 'INSERT' : 'UPDATE');
      this.TipoEntregaService.postGuardarTipoEntrega(this.tipoEntregaForm.value).subscribe({
        next: (result: baseOut) => {
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
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: 'Es necesario llenar los campos indicados.',
      });
    }
  }