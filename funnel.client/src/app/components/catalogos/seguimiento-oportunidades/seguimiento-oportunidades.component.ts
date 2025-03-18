import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef} from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { Oportunidad } from '../../../interfaces/oportunidades';

import { OportunidadesService } from '../../../services/oportunidades.service';
import { RequestOportunidad } from '../../../interfaces/oportunidades';
import { LoginService } from '../../../services/login.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { get } from 'lodash-es';

@Component({
  selector: 'app-seguimiento-oportunidades',
  standalone: false,
  templateUrl: './seguimiento-oportunidades.component.html',
  styleUrl: './seguimiento-oportunidades.component.css'
})
export class SeguimientoOportunidadesComponent {

  constructor(private oportunidadService : OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
  @Input() oportunidad!: Oportunidad;
  @Input() oportunidades: Oportunidad[]=[];
  @Input() oportunidadesOriginal: Oportunidad[]=[];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: RequestOportunidad;

  oportunidadForm!: FormGroup;
  loading: boolean = true;

  disableOportunidades = true;
  isDescargando = false;
  anchoTabla = 100;

  historialOportunidad: Oportunidad[] = [];

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  inicializarFormulario() {
      this.oportunidadForm = this.fb.group({
        idOportunidad: [this.oportunidad.idOportunidad],
        nombre: [this.oportunidad.nombre],
        nombreOportunidad: [this.oportunidad.nombreOportunidad],
        descripcion: [this.oportunidad.nombreOportunidad],
        monto: [this.oportunidad.monto],
        idEjecutivo: [this.oportunidad.idEjecutivo],
        comentario: ['', [Validators.required, this.minWordsValidator(10)]],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        probabilidad: [this.oportunidad.probabilidad],
        idEstatusOportunidad: [this.oportunidad.idEstatusOportunidad],
        tooltipStage: [this.oportunidad.tooltipStage],
        montoNormalizado: [this.oportunidad.montoNormalizado],
        idUsuario: [2], 
        stage: [this.oportunidad.stage],
        bandera: ['INS-HISTORICO'],
      });
      if (this.oportunidad.idOportunidad) {
        this.getHistorial(this.oportunidad.idOportunidad);
      }
    }
  
    onDialogShow() {
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

    guardarHistorial(){
      this.oportunidadService.postHistorial(this.oportunidadForm.value).subscribe({
          next: (result: baseOut) => {
            this.result.emit(result);
            this.getHistorial(this.oportunidadForm.value.idOportunidad);
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
      
      getHistorial(idOportunidad: number) {
        this.oportunidadService.getHistorial(idOportunidad, this.loginService.obtenerIdEmpresa()).subscribe({
          next: (result: Oportunidad[]) => {
            this.historialOportunidad = [...result]; 
            this.loading = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Se ha producido un error.',
              detail: error.errorMessage,
            });
            this.loading = false;
          },
        });
      }
      
      minWordsValidator(minWords: number) {
        return (control: any) => {
          if (!control.value || control.value.trim().split(/\s+/).length < minWords) {
            return { minWords: true };
          }
          return null;
        };
      }
      
  }

