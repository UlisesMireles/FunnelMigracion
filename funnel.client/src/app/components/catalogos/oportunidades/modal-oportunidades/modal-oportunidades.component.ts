import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

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

  constructor(private oportunidadService : OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder) { }
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
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes['oportunidad'] && this.oportunidad) {
        this.inicializarFormulario();
      }
    }

    inicializarFormulario() {
      if (this.insertar) {
        this.oportunidadForm = this.fb.group({
          idOportunidad: [0],
          idProspecto: [null, Validators.required], 
          
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          bandera: ['INSERT']
        });
        return;
      } else {
        this.oportunidadForm = this.fb.group({
          idOportunidad: [this.oportunidad.idOportunidad],
          idProspecto: [this.oportunidad.idProspecto, Validators.required],
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          bandera: ['UPDATE']
        });
      }
    }

    onDialogShow() {
      this.cargarProspectos();
      this.cargarServicios();
      this.cargarEtapas();
      this.cargarEjecutivos();
      this.cargarContactos();
      this.cargarEntregas();

      this.inicializarFormulario(); 
    }
  
    close() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.closeModal.emit();
    }

    cargarProspectos() {
      this.oportunidadService.getProspectos(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result: any) => {
          this.prospectos = result;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: error.errorMessage,
          });
        },
      });
    }

    cargarServicios() {
      this.oportunidadService.getServicios(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result: any) => {
          this.servicios = result;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: error.errorMessage,
          });
        },
      });
    }

    cargarEtapas() {
      this.oportunidadService.getEtapas(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result: any) => {
          this.etapas = result;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: error.errorMessage,
          });
        },
      });
    }

    cargarEjecutivos() {  
      this.oportunidadService.getEjecutivos(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result: any) => {
          this.ejecutivos = result;
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

    cargarContactos() {
      this.oportunidadService.getContactos(this.loginService.obtenerIdEmpresa(), 2).subscribe({
        next: (result: any) => {
          this.contactos = result;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: error.errorMessage,
          });
        },
      });
    }

    cargarEntregas() {
      this.oportunidadService.getEntregas(this.loginService.obtenerIdEmpresa()).subscribe({
        next: (result: any) => {
          this.entregas = result;
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

    mostrarToastError() {
      console.log(this.oportunidadForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Es necesario llenar los campos indicados.',
      });
    }

}
