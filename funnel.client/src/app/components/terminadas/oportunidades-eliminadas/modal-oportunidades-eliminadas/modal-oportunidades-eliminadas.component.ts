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
  selector: 'app-modal-oportunidades-eliminadas',
  standalone: false,
  templateUrl: './modal-oportunidades-eliminadas.component.html',
})
export class ModalOportunidadesEliminadasComponent {
  constructor(private oportunidadService : OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
  @Input() oportunidad!: Oportunidad;
  @Input() oportunidades: Oportunidad[]=[];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  request!: RequestOportunidad;

  oportunidadForm!: FormGroup;
  estatus: any[] = [];
  initialStatus: number | null = null;


  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  inicializarFormulario() {
      this.oportunidadForm = this.fb.group({
        bandera: ['UPD-ESTATUS'],
        idOportunidad: [this.oportunidad.idOportunidad],
        comentario: [''],
        idEstatusOportunidad: [this.oportunidad.idEstatusOportunidad],
        idUsuario: [this.loginService.obtenerIdUsuario()],
        stage: [this.oportunidad.stage],
      });
  }

  onDialogShow() {
    this.cargarEstatus();
    this.cdr.detectChanges();
    this.inicializarFormulario(); 
    this.initialStatus = this.oportunidadForm.get('idEstatusOportunidad')?.value;
  }

  hasStatusChanged(): boolean {
    const currentStatus = this.oportunidadForm.get('idEstatusOportunidad')?.value;
    return currentStatus !== this.initialStatus;
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
    const idEstatus = this.oportunidadForm.get('idEstatusOportunidad')?.value;
    let descripcion = '';
  
    switch (idEstatus) {
      case 1: 
        descripcion = 'En Proceso';
        break;
      case 2: 
        descripcion = 'Ganada';
        break;
      case 3: 
        descripcion = 'Perdida';
        break;
      case 4:
        descripcion = 'Cancelada';
        break;
      case 5: 
        descripcion = 'Eliminada';
        break;
      default:
        descripcion = 'actualizada';
    }
  
    this.oportunidadForm.patchValue({
      comentario: `Modificación de estatus de oportunidad a '${descripcion}'`
    });
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
}
