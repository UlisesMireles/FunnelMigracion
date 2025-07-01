import { Component, EventEmitter, Input, Output, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';

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
import { Prospectos } from '../../../../interfaces/prospecto';

@Component({
  selector: 'app-modal-oportunidades',
  standalone: false,
  templateUrl: './modal-oportunidades.component.html',
  styleUrls: ['../oportunidades.component.css']
})
export class ModalOportunidadesComponent implements OnInit, OnDestroy {
  private catalogosSubscription!: Subscription;

  constructor(private readonly catalogoService: CatalogoService, private oportunidadService: OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef,
    private modalOportunidadesService: ModalOportunidadesService
  ) {

  }
  @Input() oportunidad!: Oportunidad;
  @Input() oportunidades: Oportunidad[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  @Input() insertarContacto: boolean = false;
  @Input() insertarProspecto: boolean = false;
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
  prospectoSeleccionado: boolean = false;
  prospectosSeleccionado!: Prospectos;

  private modalSubscription!: Subscription;
  private modalContactosSubscription!: Subscription;
  private modalProspectosSubscription!: Subscription;

  //Modal Contactos
  modalVisibleContactos: boolean = false;
  modalVisibleProspectos: boolean = false;
  contactoSeleccionado!: Contacto;

  contactosFiltrados: any[] = [];
  busquedaContacto: string | null = '';
  contactosSeleccionado: boolean = false;
  registraContacto: boolean = true;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  nombreProspecto: string = '';
  validaGuadar: boolean = false;
  banderaContacto: boolean = false;
  informacionOportunidad: Oportunidad = {};
  prospectoAgregado!: Prospectos;
  contactoEnEditar: Partial<Contacto> = {};
  prospectoEnEditar: Partial<Prospectos> = {};

  inicializarFormulario() {
    this.modalSubscription = this.modalOportunidadesService.modalState$.subscribe((state) => {
      this.visible = state.showModal;
      this.insertar = state.insertar;
    });
    let valoresIniciales: Record<string, any>;
    this.prospectosFiltrados = this.prospectos;
    if (this.insertar) {
      this.informacionOportunidad = { probabilidad: '0', idEstatus: 1 };
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
        idContactoProspecto: [null, Validators.required],
        comentario: ['', [Validators.required, Validators.minLength(10)]],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        probabilidad: ['0'],
        bandera: ['INS-OPORTUNIDAD'],
        idEstatus: [1]
      });
      this.oportunidadForm.get('idContactoProspecto')?.disable();
      this.busquedaContacto = null;
      valoresIniciales = this.oportunidadForm.getRawValue();

      this.oportunidadForm.valueChanges.subscribe((changes) => {
        this.validarCambios(valoresIniciales, changes);
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();

    } else {
      this.informacionOportunidad = this.oportunidad;
      this.nombreProspecto = this.oportunidad.nombre ?? '';
      this.oportunidadForm = this.fb.group({
        bandera: ['UPD-OPORTUNIDAD'],
        idOportunidad: [this.oportunidad.idOportunidad],
        idProspecto: [this.prospectoEnEditar, Validators.required],
        descripcion: [this.oportunidad.nombreOportunidad, [Validators.required, Validators.minLength(5)]],
        monto: [this.oportunidad.monto, [Validators.required, Validators.min(1)]],
        idTipoProyecto: [this.oportunidad.idTipoProyecto, Validators.required],
        idStage: [this.oportunidad.idStage, Validators.required],
        idTipoEntrega: [this.oportunidad.idTipoEntrega, Validators.required],
        fechaEstimadaCierreOriginal: [this.oportunidad.fechaEstimadaCierreOriginal ? new Date(this.oportunidad.fechaEstimadaCierreOriginal) : '', Validators.required],
        idEjecutivo: [this.oportunidad.idEjecutivo, Validators.required],
        idContactoProspecto: [this.contactoEnEditar, Validators.required],
        comentario: ['', [Validators.required, Validators.minLength(10)]],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        probabilidad: [this.oportunidad.probabilidad],
        idEstatus: [this.oportunidad.idEstatusOportunidad]
      });

      this.oportunidadForm.get('idContactoProspecto')?.enable();
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

    this.catalogosSubscription = this.catalogoService.catalogosUpdated$.subscribe(() => {
      this.cargarDatos();
    });

    //Suscripcion a servicio de modal de contactos, recibe datos para el despliegue del modal
    this.modalContactosSubscription = this.modalOportunidadesService.modalContactoOportunidadesState$.subscribe((state) => {
      this.modalVisibleContactos = state.showModal;
      this.insertarContacto = state.insertarContacto;
      this.contactos = state.contactos;
      this.contactoSeleccionado = state.contactoSeleccionado;
    });

    this.modalProspectosSubscription = this.modalOportunidadesService.modalProspectoOportunidadesState$.subscribe((state) => {
      this.modalVisibleProspectos = state.showModal;
      this.insertarProspecto = state.insertarProspecto;
      this.prospectos = state.prospectos;
      this.prospectosSeleccionado = state.prospectoSeleccionado;
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
    const valorBusqueda = event.filter.toLowerCase();
    this.busquedaProspecto = valorBusqueda;
    this.prospectoSeleccionado = false;
    if (valorBusqueda.length > 0) {
      this.prospectosFiltrados = this.prospectos.filter(prospecto =>
        prospecto.nombre.toLowerCase().includes(valorBusqueda)
      );
    } else {
      this.prospectosFiltrados = this.prospectos;
    }
  }

  filtrarContactos(event: any) {
    const valorBusqueda = event.filter.toLowerCase();
    this.busquedaContacto = valorBusqueda;
    this.contactosSeleccionado = false;
    if (valorBusqueda.length > 0) {
      this.contactosFiltrados = this.contactos.filter(contacto =>
        contacto.nombreCompleto.toLowerCase().includes(valorBusqueda)
      );
    } else {
      this.contactosFiltrados = this.contactos;
    }
  }

  seleccionarProspecto(prospecto: any) {
    if (prospecto != null) {
      this.oportunidadForm.get('idProspecto')?.setValue(prospecto);
      this.busquedaProspecto = prospecto.nombre;
    }
    else {
      this.busquedaProspecto = "";
    }

    this.prospectosFiltrados = this.prospectos;
    this.prospectoSeleccionado = true;
    this.cdr.detectChanges();
    this.onChangeProspecto();
  }

  seleccionarContactos(contacto: any) {
    if (contacto != null) {
      this.oportunidadForm.get('idContactoProspecto')?.setValue(contacto);
      this.busquedaContacto = contacto.nombreCompleto;
    }
    else {
      this.busquedaContacto = "";
    }

    this.contactosFiltrados = this.contactos;
    this.contactosSeleccionado = true;
    this.cdr.detectChanges();
    //this.onChangeProspecto(); 
  }

  agregarProspecto() {
    this.prospectoAgregado = {
      bandera: '',
      idProspecto: 0,
      nombre: this.busquedaProspecto,
      ubicacionFisica: '',
      estatus: 0,
      desEstatus: '',
      nombreSector: '',
      idSector: 0,
      totalOportunidades: 0,
      proceso: 0,
      ganadas: 0,
      perdidas: 0,
      canceladas: 0,
      eliminadas: 0,
      idEmpresa: 0,
      porcEfectividad: 0,
    };
    this.modalOportunidadesService.openModalProspectoOportunidades(true, true, [], this.prospectoAgregado)

  }

  onChangeProspecto() {
    const prospecto = this.oportunidadForm.get('idProspecto')?.value;
    if (prospecto) {
      if (prospecto.id > 0) {
        this.contactos = this.catalogoService.obtenerContactos(prospecto.id);
        this.oportunidadForm.get('idContactoProspecto')?.enable();
        const prospectoSeleccionado = this.prospectos.find(p => p.id === prospecto.id);
        if (prospectoSeleccionado) {
          this.busquedaProspecto = prospectoSeleccionado.nombre;
        }
        // Contacto por defecto si solo hay uno
        if (this.contactos.length === 1) {
          this.oportunidadForm.get('idContactoProspecto')?.setValue(this.contactos[0]);
        }
        if (this.contactos.length == 0) {
          this.banderaContacto = true;
          this.registraContacto = false;
        }
      }
    }
    else {
      this.oportunidadForm.get('idContactoProspecto')?.disable();
      this.oportunidadForm.get('idContactoProspecto')?.setValue(null);
      this.busquedaProspecto = '';
      this.busquedaContacto = null;
      this.registraContacto = true;
      this.banderaContacto = false;
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

    this.catalogoService.cargarCatalogos(this.loginService.obtenerIdEmpresa());
    this.cargarDatos();
  }

  cargarDatos() {
    this.prospectos = this.catalogoService.obtenerProspectos();
    this.servicios = this.catalogoService.obtenerServicios();
    this.etapas = this.catalogoService.obtenerEtapas();
    this.ejecutivos = this.catalogoService.obtenerEjecutivos();
    this.entregas = this.catalogoService.obtenerEntregas();
    //Ordenar y asignar ejecutivos
    this.ejecutivos = this.catalogoService.obtenerEjecutivos().sort((a, b) =>
      a.nombreCompleto.localeCompare(b.nombreCompleto, 'es', { sensitivity: 'base' })
    );
    if (this.oportunidad) {
      if (this.oportunidad.idProspecto) {
        this.prospectoEnEditar = this.prospectos.find(e => e.id == this.oportunidad.idProspecto);
        this.contactos = this.catalogoService.obtenerContactos(this.oportunidad.idProspecto);
        if (this.contactos.length > 0) {
          if (!this.insertar) {
            const contactoAsignado = this.contactos.find(e => e.idContactoProspecto === this.oportunidad.idContactoProspecto);
            this.contactoEnEditar = contactoAsignado;
            this.oportunidadForm.get('idContactoProspecto')?.setValue(contactoAsignado);
            this.busquedaContacto = contactoAsignado?.nombreCompleto;
          }

        }

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
    let idContacto = this.oportunidadForm.get('idContactoProspecto')?.value.idContactoProspecto;
    let idProspecto = this.oportunidadForm.get('idProspecto')?.value.id;

    this.informacionOportunidad = {
      ...this.informacionOportunidad,
      bandera: this.oportunidadForm.get('bandera')?.value,
      idOportunidad: this.oportunidadForm.get('idOportunidad')?.value,
      idEstatusOportunidad: this.oportunidadForm.get('idEstatus')?.value,
      idEjecutivo: this.oportunidadForm.get('idEjecutivo')?.value,
      idContactoProspecto: idContacto,
      idStage: this.oportunidadForm.get('idStage')?.value,
      idEmpresa: this.oportunidadForm.get('idEmpresa')?.value,
      idTipoProyecto: this.oportunidadForm.get('idTipoProyecto')?.value,
      idTipoEntrega: this.oportunidadForm.get('idTipoEntrega')?.value,
      descripcion: this.oportunidadForm.get('descripcion')?.value,
      monto: this.oportunidadForm.get('monto')?.value,
      fechaEstimadaCierre: this.oportunidadForm.get('fechaEstimadaCierreOriginal')?.value || new Date(),
      comentario: this.oportunidadForm.get('comentario')?.value,
      idProspecto: idProspecto,
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
    const idProspecto = this.oportunidadForm.get('idProspecto')?.value.id;
    const nombreProspecto = this.busquedaProspecto;


    this.contactoSeleccionado = {
      idContactoProspecto: 0,
      nombre: this.busquedaContacto || '',
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

  onModalCloseProspectos() {
    this.modalOportunidadesService.closeModalProspectoOportunidades();
  }

  manejarResultadoContactos(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.modalOportunidadesService.closeModalContactoOportunidades(result);

      const prospecto = this.oportunidadForm.get('idProspecto')?.value;


      if (prospecto.id > 0) {

        this.catalogoService.cargarContactos(this.loginService.obtenerIdEmpresa());
        setTimeout(() => {

          if (!this.oportunidadForm.get('idProspecto')?.value) {
            this.oportunidadForm.get('idProspecto')?.setValue(prospecto);
          }

          this.contactos = this.catalogoService.obtenerContactos(prospecto.id);

          const contactoNuevo = this.contactos.find(c => c.idContactoProspecto === result.id);
          if (contactoNuevo) {
            this.oportunidadForm.get('idContactoProspecto')?.setValue(contactoNuevo);
          } else if (this.contactos.length === 1) {
            this.oportunidadForm.get('idContactoProspecto')?.setValue(this.contactos[0]);
          }
          this.oportunidadForm.get('idContactoProspecto')?.enable();
          this.busquedaContacto = contactoNuevo?.nombreCompleto;
          this.banderaContacto = false;
          this.registraContacto = true;
          this.cdr.detectChanges();
        }, 500);

      } else {
        this.busquedaProspecto = '';
        this.contactos = [];
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

  manejarResultadoProspectos(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.modalOportunidadesService.closeModalProspecto(result);

      this.catalogoService.cargarProspectos(this.loginService.obtenerIdEmpresa());
      setTimeout(() => {
        this.prospectos = this.catalogoService.obtenerProspectos();


        const prospectoNuevo = this.prospectos.find(c => c.id === result.id);
        if (prospectoNuevo) {
          this.oportunidadForm.get('idProspecto')?.setValue(prospectoNuevo);
        } else if (this.prospectos.length === 1) {
          this.oportunidadForm.get('idProspecto')?.setValue(this.prospectos[0]);
        }

        this.busquedaProspecto = prospectoNuevo?.nombre;
        this.oportunidadForm.get('idContactoProspecto')?.enable();
        this.prospectosFiltrados = this.prospectos;
        this.prospectoSeleccionado = true;
        this.onChangeProspecto();

        this.cdr.detectChanges();
      }, 500);
    }

    else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }


  formatearMonto(event: any) {
    const input = event.target;
    // Solo números
    let valorNumerico = input.value.replace(/[^0-9]/g, '');

    // Actualiza el form control con el valor numérico (como número, no string)
    this.oportunidadForm.get('monto')?.setValue(valorNumerico ? parseInt(valorNumerico, 10) : null, { emitEvent: false });

    // Formatea para mostrar en el input
    let valorFormateado = valorNumerico ? parseInt(valorNumerico, 10).toLocaleString('es-MX') : '';

    // Actualiza solo el input visualmente (esto no afecta el form control)
    input.value = valorFormateado;
  }
}