import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Oportunidad, RequestOportunidad } from '../../../../interfaces/oportunidades';

import { OportunidadesService } from '../../../../services/oportunidades.service';
import { LoginService } from '../../../../services/login.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogoService } from '../../../../services/catalogo.service';
import { ModalOportunidadesService } from '../../../../services/modalOportunidades.service';
import { Subscription } from 'rxjs';
import { Contacto } from '../../../../interfaces/contactos';

@Component({
  selector: 'app-modal-oportunidades',
  standalone: false,
  templateUrl: './modal-oportunidades.component.html',
})
export class ModalOportunidadesComponent {

  constructor(private readonly catalogoService: CatalogoService, private oportunidadService: OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef,
    private modalOportunidadesService: ModalOportunidadesService
  ) { 
   
  }
  @Input() oportunidad!: Oportunidad;
  @Input() oportunidades: Oportunidad[] = [];
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
  estatusOportunidad: any[] = [];
  prospectosFiltrados: any[] = [];
  busquedaProspecto: string = '';
  prospectoSeleccionado : boolean = false;  
  
  private modalSubscription!: Subscription;
  private modalContactosSubscription!: Subscription;
  //Modal Contactos
  modalVisibleContactos: boolean = false;
  contactoSeleccionado!: Contacto;
  
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  nombreProspecto: string = '';
  validaGuadar: boolean = false;
  banderaContacto: boolean = true;
  informacionOportunidad: Oportunidad = {};
  
  inicializarFormulario() {
    this.modalSubscription = this.modalOportunidadesService.modalState$.subscribe((state) => {
      this.visible = state.showModal;
      this.insertar = state.insertar;
    });
    let valoresIniciales: Record<string, any>;
    if (this.insertar) {
      this.informacionOportunidad = { probabilidad: '0', idEstatus: 1 };
      this.banderaContacto = true;
      this.oportunidadForm = this.fb.group({
        idOportunidad: [0],
        idProspecto: [null, Validators.required],
        descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        monto: [0, [Validators.required, Validators.min(1)]],
        idTipoProyecto: ['', Validators.required],
        idStage: ['', Validators.required],
        idTipoEntrega: ['', Validators.required],
        fechaEstimadaCierreOriginal: ['', Validators.required],
        idEjecutivo: ['', Validators.required],
        idContactoProspecto: ['', Validators.required],
        comentario: ['', [Validators.required, Validators.minLength(10)]],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        probabilidad: ['0'],
        bandera: ['INS-OPORTUNIDAD'],
        idEstatus: [1]
      });

      valoresIniciales = this.oportunidadForm.getRawValue();

      this.oportunidadForm.valueChanges.subscribe((changes) => {
        this.validarCambios(valoresIniciales, changes);
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();

    } else {
      this.informacionOportunidad = this.oportunidad;
      this.banderaContacto = false;
      this.nombreProspecto = this.oportunidad.nombre ?? '';
      this.oportunidadForm = this.fb.group({
        bandera: ['UPD-OPORTUNIDAD'],
        idOportunidad: [this.oportunidad.idOportunidad],
        idProspecto: [this.oportunidad.idProspecto, Validators.required],
        descripcion: [this.oportunidad.nombreOportunidad, [Validators.required, Validators.minLength(5)]],
        monto: [this.oportunidad.monto, [Validators.required, Validators.min(1)]],
        idTipoProyecto: [this.oportunidad.idTipoProyecto, Validators.required],
        idStage: [this.oportunidad.idStage, Validators.required],
        idTipoEntrega: [this.oportunidad.idTipoEntrega, Validators.required],
        fechaEstimadaCierreOriginal: [this.oportunidad.fechaEstimadaCierreOriginal ? new Date(this.oportunidad.fechaEstimadaCierreOriginal) : '', Validators.required],
        idEjecutivo: [this.oportunidad.idEjecutivo, Validators.required],
        idContactoProspecto: [this.oportunidad.idContactoProspecto, Validators.required],
        comentario: ['', [Validators.required, Validators.minLength(10)]],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        probabilidad: [this.oportunidad.probabilidad],
        idEstatus: [this.oportunidad.idEstatusOportunidad]
      });

      valoresIniciales = this.oportunidadForm.getRawValue();



      this.oportunidadForm.valueChanges.subscribe((changes) => {
        this.validarCambios(valoresIniciales, changes);
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();

    }

  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe(); 
    }
  }
  ngOnInit(): void {
    
    //Suscripcion a servicio de modal de contactos, recibe datos para el despliegue del modal
    this.modalContactosSubscription = this.modalOportunidadesService. modalContactoOportunidadesState$.subscribe((state) => {
      this.modalVisibleContactos = state.showModal;
      this.insertar = state.insertar;
      this.contactos = state.contactos;
      this.contactoSeleccionado = state.contactoSeleccionado;
    });
  }

  validarCambios(valoresIniciales: any, cambios: any) {
    const valoresActuales = cambios;

    if (this.oportunidadForm.dirty) {
      this.validaGuadar = true;
    }
    const valoresRegresaron = this.compararValores(valoresIniciales, valoresActuales);
    if (valoresRegresaron) {
      this.validaGuadar = false;
    }
  }

  compararValores(valoresIniciales: any, valoresActuales: any) {
    let valoresInicialesJson = JSON.stringify(valoresIniciales);
    let valoresActualesJson = JSON.stringify(valoresActuales);
    return valoresInicialesJson === valoresActualesJson;
  }


filtrarProspectos(event: any) {
  const valorBusqueda = event.target.value.toLowerCase();
  this.busquedaProspecto = valorBusqueda;
  this.prospectoSeleccionado = false;
  if (valorBusqueda.length > 0) {
    this.prospectosFiltrados = this.prospectos.filter(prospecto => 
      prospecto.nombre.toLowerCase().includes(valorBusqueda)
    );
  } else {
    this.prospectosFiltrados = [];
  }
}

seleccionarProspecto(prospecto: any) {
  this.oportunidadForm.get('idProspecto')?.setValue(prospecto.id);
  this.busquedaProspecto = prospecto.nombre;
  this.prospectosFiltrados = [];
  this.prospectoSeleccionado = true;
  this.cdr.detectChanges();
  this.onChangeProspecto(); 
}

onChangeProspecto() {
  const idProspecto = this.oportunidadForm.get('idProspecto')?.value;
  if (idProspecto > 0) {
    this.contactos = this.catalogoService.obtenerContactos(idProspecto);
    this.banderaContacto = false;
    const prospectoSeleccionado = this.prospectos.find(p => p.id === idProspecto);
    if (prospectoSeleccionado) {
      this.busquedaProspecto = prospectoSeleccionado.nombre;
    }
    // Contacto por defecto si solo hay uno
    if (this.contactos.length === 1) {
      this.oportunidadForm.get('idContactoProspecto')?.setValue(this.contactos[0].idContactoProspecto);
    }
  } else {
    this.banderaContacto = true;
    this.busquedaProspecto = '';
  }
  this.cdr.detectChanges();
}

  onChangeProbabilidad() {
    const idStage = this.oportunidadForm.get('idStage')?.value;
    if (idStage > 0) {
      this.obtenerProbabilidadPorEtapa(idStage);
    }
    if (!this.insertar)
      this.limpiarProbabilidad();
  }

  onDialogShow() {
    this.catalogoService.cargarProspectos(this.loginService.obtenerIdEmpresa());
    this.catalogoService.cargarContactos(this.loginService.obtenerIdEmpresa());
    this.catalogoService.cargarServicios(this.loginService.obtenerIdEmpresa());
    this.catalogoService.cargarEtapas(this.loginService.obtenerIdEmpresa());
    this.catalogoService.cargarEjecutivos(this.loginService.obtenerIdEmpresa());
    this.catalogoService.cargarEntregas(this.loginService.obtenerIdEmpresa());
    this.cargarDatos();
  }

  cargarDatos() {
    this.banderaContacto = true;
    this.prospectos = this.catalogoService.obtenerProspectos();
    this.servicios = this.catalogoService.obtenerServicios();
    this.etapas = this.catalogoService.obtenerEtapas();
    this.ejecutivos = this.catalogoService.obtenerEjecutivos();
    //Ordenar y asignar ejecutivos
  this.ejecutivos = this.catalogoService.obtenerEjecutivos().sort((a, b) =>
    a.nombreCompleto.localeCompare(b.nombreCompleto, 'es', { sensitivity: 'base' })
  );
    if (this.oportunidad)
    {
      if (this.oportunidad.idProspecto) {
        this.contactos = this.catalogoService.obtenerContactos(this.oportunidad.idProspecto);
      }
    }
    this.entregas = this.catalogoService.obtenerEntregas();
    this.estatusOportunidad = this.catalogoService.obtenerEstatusOportunidad();
    this.inicializarFormulario();
    // Asignaciones por defecto (primer elemento)
    if (this.insertar) {
    // Servicio 
    if (this.servicios.length > 0) {
      this.oportunidadForm.get('idTipoProyecto')?.setValue(this.servicios[0].idTipoProyecto);
    }
    // Entrega 
    if (this.entregas.length > 0) {
      this.oportunidadForm.get('idTipoEntrega')?.setValue(this.entregas[0].idTipoEntrega);
    }
    // Etapa 
    if (this.etapas.length > 0) {
      this.oportunidadForm.get('idStage')?.setValue(this.etapas[0].id);
      this.onChangeProbabilidad(); 
    }
    // Ejecutivo (el que se encuentra logueado)
    const usuarioLogueado = this.loginService.obtenerIdUsuario();
    const ejecutivoLogueado = this.ejecutivos.find(e => e.idUsuario === usuarioLogueado);
    if (ejecutivoLogueado) {
      this.oportunidadForm.get('idEjecutivo')?.setValue(usuarioLogueado);
    }
    }
  
      this.cdr.detectChanges();
    }
  


  close() {
    this.busquedaProspecto = '';
    this.prospectosFiltrados = [];
    this.prospectoSeleccionado = false;
    this.banderaContacto = true;
    this.visible = false;
    this.modalOportunidadesService.closeModal();
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  mostrarToastError(mensaje: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
  }

  guardarOportunidad() {
    this.markAllAsTouched(this.oportunidadForm);

    const comentario = this.oportunidadForm.get('comentario')?.value;
    if (!comentario || comentario.length < 10) {
      this.mostrarToastError("El comentario debe tener al menos 10 caracteres");
      return;
    }

    if (this.oportunidadForm.invalid) {
      this.mostrarToastError("Es necesario llenar los campos indicados.");
      return;
    }
    this.informacionOportunidad = {
      ...this.informacionOportunidad,
      bandera: this.oportunidadForm.get('bandera')?.value,
      idOportunidad: this.oportunidadForm.get('idOportunidad')?.value,
      idEstatusOportunidad: this.oportunidadForm.get('idEstatus')?.value,
      idEjecutivo: this.oportunidadForm.get('idEjecutivo')?.value,
      idContactoProspecto: this.oportunidadForm.get('idContactoProspecto')?.value,
      idStage: this.oportunidadForm.get('idStage')?.value,
      idEmpresa: this.oportunidadForm.get('idEmpresa')?.value,
      idTipoProyecto: this.oportunidadForm.get('idTipoProyecto')?.value,
      idTipoEntrega: this.oportunidadForm.get('idTipoEntrega')?.value,
      descripcion: this.oportunidadForm.get('descripcion')?.value,
      monto: this.oportunidadForm.get('monto')?.value,
      fechaEstimadaCierre: this.oportunidadForm.get('fechaEstimadaCierreOriginal')?.value || new Date(),
      comentario: this.oportunidadForm.get('comentario')?.value,
      idProspecto: this.oportunidadForm.get('idProspecto')?.value,
      probabilidad: this.oportunidadForm.get('probabilidad')?.value
    };
    this.informacionOportunidad.probabilidad = this.informacionOportunidad.probabilidad?.replace('%', '').trim();
    this.informacionOportunidad.idUsuario = this.loginService.obtenerIdUsuario();

        this.oportunidadService.postOportunidad(this.informacionOportunidad).subscribe({
          next: (result: baseOut) => {
            this.result.emit(result);
            this.close();
          },
          error: (error: baseOut) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Se ha producido un error al guardar la oportunidad.',
              detail: error.errorMessage,
            });
          },
    });
  }
  obtenerProbabilidadPorEtapa(idStage: number) {
    const etapaSeleccionada = this.etapas.find(etapa => etapa.id === idStage);

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

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markAllAsTouched(control as FormGroup);
      }
    });
  }

  limitarCaracteres() {
    const descripcionControl = this.oportunidadForm.get('descripcion');
    if (descripcionControl?.value.length >= 100) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Límite alcanzado',
        detail: 'Has alcanzado el límite máximo de 100 caracteres',
        life: 3000
      });
    }
  }
  guardarHistorial() {
    let historicoOportunidad = {
      bandera: 'INS-HISTORICO',
      idOportunidad: this.oportunidadForm.get('idOportunidad')?.value,
      idStage: this.oportunidadForm.get('idStage')?.value,
      idUsuario: this.loginService.obtenerIdUsuario(),
      comentario: this.oportunidadForm.get('comentario')?.value,
    };
    this.oportunidadService.postHistorial(historicoOportunidad).subscribe({
      next: (result: baseOut) => {
        this.result.emit(result);
      },
      error: (error: baseOut) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error al guardar el comentario.',
          detail: error.errorMessage,
        });
      },
    });
  }

  seleccionarHoy() {
    this.oportunidadForm.get('fechaEstimadaCierreOriginal')?.setValue(new Date());
  }
  agregarContacto() {
    const idProspecto = this.oportunidadForm.get('idProspecto')?.value;
    const nombreProspecto = this.busquedaProspecto;
    
   
    this.contactoSeleccionado = {
      idContactoProspecto: 0,
      nombre: '',
      apellidos: '',
      telefono: '',
      correoElectronico: '',
      prospecto: nombreProspecto || '',
      idEmpresa: 0,
      idProspecto: idProspecto || 0,
      estatus: 0,
      desEstatus: '',
      nombreCompleto: '',
      bandera: ''
    };
    this.modalOportunidadesService.openModalContactoOportunidades(true, true, [], this.contactoSeleccionado);

  }
  
  onModalCloseContactos() {
  this.modalOportunidadesService.closeModalContactoOportunidades();
}

 manejarResultadoContactos(result: baseOut) {
  if (result.result) {
    this.messageService.add({
      severity: 'success',
      summary: 'La operación se realizó con éxito.',
      detail: result.errorMessage,
    });
    this.modalOportunidadesService.closeModalContactoOportunidades(result);

    const idProspecto = this.oportunidadForm.get('idProspecto')?.value;

    
  if (idProspecto > 0) {
    if (!this.oportunidadForm.get('idProspecto')?.value) {
      this.oportunidadForm.get('idProspecto')?.setValue(idProspecto);
    }

  this.catalogoService.cargarContactos(this.loginService.obtenerIdEmpresa());
    setTimeout(() => {
    this.contactos = this.catalogoService.obtenerContactos(idProspecto);

    this.banderaContacto = false;

 const contactoNuevo = this.contactos.find(c => c.idContactoProspecto === result.id);
  if (contactoNuevo) {
    this.oportunidadForm.get('idContactoProspecto')?.setValue(result.id);
  } else if (this.contactos.length === 1) {
    this.oportunidadForm.get('idContactoProspecto')?.setValue(this.contactos[0].idContactoProspecto);
  } 
 
   this.cdr.detectChanges();
}, 500);

    } else {
      this.busquedaProspecto = '';
      this.contactos = [];
      this.banderaContacto = true;
      this.oportunidadForm.get('idContactoProspecto')?.setValue(null);
      this.cdr.detectChanges();
    }
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Se ha producido un error.',
      detail: result.errorMessage,
    });
  }
}
}