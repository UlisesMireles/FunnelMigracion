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
  styleUrl: './modal-oportunidades.component.css'
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
  
    ngOnInit() {
      this.inicializarFormulario();
    }
    inicializarFormulario() {
      if (this.insertar) {
        this.oportunidadForm = this.fb.group({
          idOportunidad: [0],
          idProspecto: ['', Validators.required],
          descripcion: ['', Validators.required],
          monto: ['', Validators.required],
          idTipoProyecto: ['', Validators.required],
          idStage: ['', Validators.required],
          idTipoEntrega: ['', Validators.required],
          fechaEstimadaCierreOriginal: ['', Validators.required],
          idEjecutivo: ['', Validators.required],
          idContactoProspecto: ['', Validators.required],
          comentario: [''],
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          probabilidad: [0],
          bandera: ['INS-OPORTUNIDAD']
        });

        this.oportunidadForm.get('idEjecutivo')?.valueChanges.subscribe((idEjecutivo) => {
          if (idEjecutivo) {
            this.cargarContactos(idEjecutivo);
          }
        });
        this.oportunidadForm.get('idStage')?.valueChanges.subscribe(() => {
          this.obtenerProbabilidadPorEtapa();
        });
        return;
      } else {
        this.oportunidadForm = this.fb.group({
          bandera: ['UPD-OPORTUNIDAD'],
          idOportunidad: [this.oportunidad.idOportunidad],
          idProspecto: [this.oportunidad.idProspecto, Validators.required],
          descripcion: [this.oportunidad.nombreOportunidad, Validators.required],
          monto: [this.oportunidad.monto, Validators.required],
          idTipoProyecto: [this.oportunidad.idTipoProyecto, Validators.required],
          idStage: [this.oportunidad.idStage, Validators.required],
          idTipoEntrega: [this.oportunidad.idTipoEntrega, Validators.required],
          fechaEstimadaCierreOriginal: [this.oportunidad.fechaEstimadaCierreOriginal ? new Date(this.oportunidad.fechaEstimadaCierreOriginal) : '', Validators.required],
          idEjecutivo: [this.oportunidad.idEjecutivo, Validators.required],
          idContactoProspecto: [this.oportunidad.idContactoProspecto, Validators.required],
          comentario: [''],
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          probabilidad: [this.oportunidad.probabilidad]
        });
        if (this.oportunidad.idEjecutivo) {
          this.cargarContactos(this.oportunidad.idEjecutivo);
        }
        this.oportunidadForm.get('idEjecutivo')?.valueChanges.subscribe((idEjecutivo) => {
          if (idEjecutivo) {
            this.cargarContactos(idEjecutivo);
          }
        });
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
  
    cargarContactos(idEjecutivo: number) {
      this.oportunidadService.getContactos(this.loginService.obtenerIdEmpresa(), idEjecutivo).subscribe({
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
      console.log(this.oportunidadForm.value);
      this.oportunidadService.postOportunidad(this.oportunidadForm.value).subscribe({
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

      obtenerProbabilidadPorEtapa() {
        const etapaSeleccionada = this.etapas.find(etapa => etapa.id === this.oportunidadForm.get('idStage')?.value);

        if (etapaSeleccionada) {
          this.oportunidadForm.get('probabilidad')?.setValue(etapaSeleccionada.probabilidad);
        }
      }
      
    }
    
