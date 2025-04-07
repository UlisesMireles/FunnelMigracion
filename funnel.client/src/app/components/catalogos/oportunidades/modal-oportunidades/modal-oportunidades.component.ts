import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef} from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Oportunidad } from '../../../../interfaces/oportunidades';

import { OportunidadesService } from '../../../../services/oportunidades.service';
import { RequestOportunidad } from '../../../../interfaces/oportunidades';
import { LoginService } from '../../../../services/login.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-oportunidades',
  standalone: false,
  templateUrl: './modal-oportunidades.component.html',
})
export class ModalOportunidadesComponent {

  constructor(private oportunidadService : OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
    @Input() oportunidad!: Oportunidad;
    @Input() oportunidades: Oportunidad[]=[];
    @Input() title: string = 'Modal';
    @Input() visible: boolean = false;
    @Input() insertar: boolean = false;
    request!: RequestOportunidad;

    oportunidadForm!: FormGroup;
    prospectos: any[] = [];
    servicios: any[] = [];  
    etapas: any[] = [];
    ejecutivos: any[] = [];
    contactos: any[] = [];
    entregas: any[] = [];

    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter();
    @Output() result: EventEmitter<baseOut> = new EventEmitter();

    nombreProspecto: string = '';
  
    inicializarFormulario() {
      if (this.insertar) {
        this.oportunidadForm = this.fb.group({
          idOportunidad: [0],
          idProspecto: ['', Validators.required],
          descripcion: ['', [Validators.required, Validators.minLength(5)]],
          monto: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), Validators.min(1)]],
          idTipoProyecto: ['', Validators.required],
          idStage: ['', Validators.required],
          idTipoEntrega: ['', Validators.required],
          fechaEstimadaCierreOriginal: ['', Validators.required],
          idEjecutivo: ['', Validators.required],
          idContactoProspecto: ['', Validators.required],
          comentario: [''],
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          probabilidad: ['0'],
          bandera: ['INS-OPORTUNIDAD'],
          idEstatusOportunidad: [1]
        });

        this.oportunidadForm.get('idProspecto')?.valueChanges.subscribe((idProspecto) => {
          if (idProspecto) {
            this.cargarContactos(idProspecto);
          }
        });
        this.oportunidadForm.get('idStage')?.valueChanges.subscribe(() => {
          this.obtenerProbabilidadPorEtapa();
        });
        return;
      } else {
        this.nombreProspecto = this.oportunidad.nombre??'';
        this.oportunidadForm = this.fb.group({
          bandera: ['UPD-OPORTUNIDAD'],
          idOportunidad: [this.oportunidad.idOportunidad],
          idProspecto: [this.oportunidad.idProspecto, Validators.required],
          descripcion: [this.oportunidad.nombreOportunidad, [Validators.required, Validators.minLength(5)]],
          monto: [this.oportunidad.monto, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), Validators.min(1)]],
          idTipoProyecto: [this.oportunidad.idTipoProyecto, Validators.required],
          idStage: [this.oportunidad.idStage, Validators.required],
          idTipoEntrega: [this.oportunidad.idTipoEntrega, Validators.required],
          fechaEstimadaCierreOriginal: [this.oportunidad.fechaEstimadaCierreOriginal ? new Date(this.oportunidad.fechaEstimadaCierreOriginal) : '', Validators.required],
          idEjecutivo: [this.oportunidad.idEjecutivo, Validators.required],
          idContactoProspecto: [this.oportunidad.idContactoProspecto, Validators.required],
          comentario: [''],
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          probabilidad: [this.oportunidad.probabilidad],
          idEstatusOportunidad: [this.oportunidad.idEstatusOportunidad]
        });
        if (this.oportunidad.idProspecto) {
          this.cargarContactos(this.oportunidad.idProspecto);
        }
      
        this.oportunidadForm.get('idProspecto')?.valueChanges.subscribe((idProspecto) => {
          if (idProspecto) {
            this.cargarContactos(idProspecto);
          }
        });
        this.oportunidadForm.get('idStage')?.valueChanges.subscribe(() => {
          this.obtenerProbabilidadPorEtapa();
        });
        this.limpiarProbabilidad();
      }
      
    }

    onDialogShow() {
      this.cargarDatos();
      this.cdr.detectChanges();
      this.inicializarFormulario(); 
      
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['oportunidad'] && changes['oportunidad'].currentValue) {
        this.inicializarFormulario();
        this.cdr.detectChanges();
      }
    }
    
    cargarDatos() {
      this.cargarProspectos();
      this.cargarServicios();
      this.cargarEtapas();
      this.cargarEjecutivos();
      this.cargarEntregas();
    }

  
    close() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.closeModal.emit();
    }

    cargarProspectos() {
      this.oportunidadService.getProspectos(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result) => (this.prospectos = result),
        error: (error) => this.mostrarToastError(error.errorMessage)
      });
    }
  
    cargarServicios() {
      this.oportunidadService.getServicios(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result) => (this.servicios = result),
        error: (error) => this.mostrarToastError(error.errorMessage)
      });
    }
  
    cargarEtapas() {
      this.oportunidadService.getEtapas(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result) => (this.etapas = result),
        error: (error) => this.mostrarToastError(error.errorMessage)
      });
    }

    cargarEjecutivos() {
      this.oportunidadService.getEjecutivos(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result) => (this.ejecutivos = result),
        error: (error) => this.mostrarToastError(error.errorMessage)
      });
    }
  
    cargarContactos(idProspecto: number) {
      this.oportunidadService.getContactos(this.loginService.obtenerIdEmpresa(), idProspecto).subscribe({
        next: (result) => (this.contactos = result),
        error: (error) => this.mostrarToastError(error.errorMessage)
      });
    }
  
    cargarEntregas() {
      this.oportunidadService.getEntregas(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result) => (this.entregas = result),
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

      obtenerProbabilidadPorEtapa() {
        const etapaSeleccionada = this.etapas.find(etapa => etapa.id === this.oportunidadForm.get('idStage')?.value);
    
        if (etapaSeleccionada) {
            let probabilidad = etapaSeleccionada.probabilidad;
  
            if (typeof probabilidad === 'string' && probabilidad.includes('%')) {
                probabilidad = parseFloat(probabilidad.replace('%', '').trim());
            }
    
            this.oportunidadForm.get('probabilidad')?.setValue(probabilidad);
        }
      }
      limpiarProbabilidad() {
        let probabilidad = this.oportunidadForm.get('probabilidad')?.value;
    
        if (typeof probabilidad === 'string' && probabilidad.includes('%')) {
            probabilidad = probabilidad.replace('%', '').trim();
            this.oportunidadForm.get('probabilidad')?.setValue(probabilidad);
        }
    }
}
      
    
    
