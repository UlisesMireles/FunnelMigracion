import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef} from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { Oportunidad } from '../../../interfaces/oportunidades';

import { OportunidadesService } from '../../../services/oportunidades.service';
import { RequestOportunidad } from '../../../interfaces/oportunidades';
import { LoginService } from '../../../services/login.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  inicializarFormulario() {
      this.oportunidadForm = this.fb.group({
        idOportunidad: [this.oportunidad.idOportunidad],
        idProspecto: [this.oportunidad.idProspecto, Validators.required],
        nombre: [this.oportunidad.nombre, [Validators.required, Validators.minLength(5)]],
        nombreOportunidad: [this.oportunidad.nombreOportunidad, [Validators.required, Validators.minLength(5)]],
        descripcion: [this.oportunidad.nombreOportunidad, [Validators.required, Validators.minLength(5)]],
        monto: [this.oportunidad.monto, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), Validators.min(1)]],
        idEjecutivo: [this.oportunidad.idEjecutivo, Validators.required],
        comentario: [''],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        probabilidad: [this.oportunidad.probabilidad],
        idEstatusOportunidad: [this.oportunidad.idEstatusOportunidad],
        tooltipStage: [this.oportunidad.tooltipStage],
        montoNormalizado: [this.oportunidad.montoNormalizado],
        bandera: ['UPD-OPORTUNIDAD'],
      });
      if (this.oportunidad.idOportunidad) {
        this.getHistorial(this.oportunidad.idOportunidad);
      }
      this.limpiarProbabilidad();
    }
    
    limpiarProbabilidad() {
      let probabilidad = this.oportunidadForm.get('probabilidad')?.value;
  
      if (typeof probabilidad === 'string' && probabilidad.includes('%')) {
          probabilidad = probabilidad.replace('%', '').trim();
          this.oportunidadForm.get('probabilidad')?.setValue(probabilidad);
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

      
    getHistorial(idOportunidad: number) {
      this.oportunidadService.getHistorial(idOportunidad, this.loginService.obtenerIdEmpresa() ).subscribe({
        next: (result: Oportunidad[]) => {
          this.oportunidades = [...result];
          this.oportunidadesOriginal = result;
          this.cdr.detectChanges(); 
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
  }

