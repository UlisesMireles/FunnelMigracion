import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef} from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Oportunidad } from '../../../../interfaces/oportunidades';

import { OportunidadesService } from '../../../../services/oportunidades.service';
import { RequestOportunidad } from '../../../../interfaces/oportunidades';
import { LoginService } from '../../../../services/login.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { identity } from 'rxjs';

@Component({
  selector: 'app-modal-oportunidades-ganadas',
  standalone: false,
  templateUrl: './modal-oportunidades-ganadas.component.html',
  styleUrl: './modal-oportunidades-ganadas.component.css'
})
export class ModalOportunidadesGanadasComponent {
  constructor(private oportunidadService : OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
    @Input() oportunidad!: Oportunidad;
    @Input() oportunidades: Oportunidad[]=[];
    @Input() title: string = 'Modal';
    @Input() visible: boolean = false;
    request!: RequestOportunidad;

    oportunidadForm!: FormGroup;
    estatus: any[] = [];

    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter();
    @Output() result: EventEmitter<baseOut> = new EventEmitter();
  
    inicializarFormulario() {
        this.oportunidadForm = this.fb.group({
          bandera: ['UPD-OPORTUNIDAD'],
          idOportunidad: [this.oportunidad.idOportunidad],
          descripcion: [this.oportunidad.nombreOportunidad],
          idEstatusOportunidad: [this.oportunidad.idEstatusOportunidad],
          probabilidad: [this.oportunidad.probabilidad]
        });
        this.limpiarProbabilidad();
    }

    onDialogShow() {
      this.cargarEstatus();
      this.cdr.detectChanges();
      this.inicializarFormulario(); 
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['oportunidad'] && changes['oportunidad'].currentValue) {
        this.inicializarFormulario();
        this.cdr.detectChanges();
      }
    }

    close() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.closeModal.emit();
    }

    cargarEstatus() {
      this.oportunidadService.getEstatus(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result) => (this.estatus = result),
        error: (error) => this.mostrarToastError(error.errorMessage)
      });
    }
  
    mostrarToastError(mensaje: string) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
    }

    guardarOportunidad(){
      this.oportunidadService.postOportunidad(this.oportunidadForm.value).subscribe({
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
      limpiarProbabilidad() {
        let probabilidad = this.oportunidadForm.get('probabilidad')?.value;
    
        if (typeof probabilidad === 'string' && probabilidad.includes('%')) {
            probabilidad = probabilidad.replace('%', '').trim();
            this.oportunidadForm.get('probabilidad')?.setValue(probabilidad);
        }
    }
}
