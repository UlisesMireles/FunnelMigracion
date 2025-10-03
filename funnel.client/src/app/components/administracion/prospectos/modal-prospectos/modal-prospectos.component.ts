import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RequestProspecto } from '../../../../interfaces/prospecto';
import { BaseOut } from '../../../../interfaces/utils/baseOut';
import { Prospectos } from '../../../../interfaces/prospecto';
import { ProspectoService } from '../../../../services/prospecto.service';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../../services/login.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalOportunidadesService } from '../../../../services/modalOportunidades.service';
import { Subscription } from 'rxjs';
import { InpoutAdicionalData } from '../../../../interfaces/input-adicional-data';

@Component({
  selector: 'app-modal-prospectos',
  standalone: false,
  templateUrl: './modal-prospectos.component.html',
  styleUrl: './modal-prospectos.component.css'
})
export class ModalProspectosComponent {

  @Input() prospecto!: Prospectos;
  @Input() prospectos: Prospectos[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertarProspecto: boolean = false;
  request!: RequestProspecto;

  prospectoActivo: boolean = false;
  prospectoForm: FormGroup;
  sectores: any[] = [];
  desdeSector: boolean = false;

  //Variables Inputs Adicionales
  formInfoAdicionales: FormGroup;
  inputInfoAdicionales: InpoutAdicionalData[] = [];
  validaGuadarAdicionales: boolean = false;
  get formArrayInfoAdicional(): FormArray {
    return this.formInfoAdicionales.controls["formArrayInfoAdicional"] as FormArray;
  }
  idReferencia: number = 0;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();
  @Output() activarModalInputsAdicionales: EventEmitter<any> = new EventEmitter();

  validaGuadar: boolean = false;
  informacionProspecto: Prospectos = {
    idProspecto: 0,
    nombre: "",
    ubicacionFisica: "",
    estatus: 0,
    desEstatus: "",
    nombreSector: "",
    idSector: 0,
    totalOportunidades: 0,
    proceso: 0,
    ganadas: 0,
    perdidas: 0,
    canceladas: 0,
    eliminadas: 0,
    idEmpresa: 0,
    bandera: "",
    porcEfectividad: 0
  };

  constructor(private prospectoService: ProspectoService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef,
    private modalOportunidadesService: ModalOportunidadesService
  ) {
    this.formInfoAdicionales = this.fb.group({});
    this.prospectoForm = this.fb.group({});
  }

  ngOnInit() {
    this.modalOportunidadesService.modalProspectoState$.subscribe(state => {
      this.desdeSector = state.desdeSector;
    });
    this.inicializarFormulario()
    this.inicializarFormularioAdicional();

  }
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['prospecto'] && this.prospecto) {
  //     this.inicializarFormulario();
  //   }
  // }
  inicializarFormulario() {
    let idEmpresa = this.loginService.obtenerIdEmpresa();
    let valoresIniciales: Record<string, any>;
    if (this.insertarProspecto) {
      this.idReferencia = 0;
      this.informacionProspecto = {
        idProspecto: 0,
        nombre: this.prospecto?.nombre ?? "",
        ubicacionFisica: "",
        estatus: 0,
        desEstatus: "",
        nombreSector: "",
        idSector: 0,
        totalOportunidades: 0,
        proceso: 0,
        ganadas: 0,
        perdidas: 0,
        canceladas: 0,
        eliminadas: 0,
        idEmpresa: 0,
        bandera: "",
        porcEfectividad: 0,
      };

      this.prospectoForm = this.fb.group({
        idProspecto: [0],
        nombre: [this.prospecto?.nombre ?? "", [
          Validators.required,
          Validators.maxLength(50),
          // Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')
        ]
        ],
        ubicacionFisica: ['', [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
        ]
        ],
        idSector: [null, Validators.required],
        estatus: [true],
        idEmpresa: [idEmpresa],
        bandera: ['INSERT'],
        usuarioCreador: [this.loginService.obtenerIdUsuario()]
      });

      valoresIniciales = this.prospectoForm.getRawValue();

      this.prospectoForm.valueChanges.subscribe((changes) => {
        this.validarCambios(valoresIniciales, changes);
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();
    } else {
      this.idReferencia = this.prospecto.idProspecto;
      this.informacionProspecto = this.prospecto;
      this.prospectoForm = this.fb.group({
        idProspecto: [this.prospecto?.idProspecto],
        nombre: [this.prospecto?.nombre, [
          Validators.required,
          Validators.maxLength(50),
          // Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
        ]
        ],
        ubicacionFisica: [this.prospecto?.ubicacionFisica, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
        ]
        ],
        idSector: [this.prospecto?.idSector, Validators.required],
        estatus: [this.prospecto?.estatus === 1 ? true : false],
        idEmpresa: [idEmpresa],
        bandera: ['UPDATE'],
        usuarioCreador: [this.loginService.obtenerIdUsuario()]
      });

      valoresIniciales = this.prospectoForm.getRawValue();

      this.prospectoForm.valueChanges.subscribe((changes) => {
        this.validarCambios(valoresIniciales, changes);
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();
    }
    this.getInputsAdicionales();

  }

  validarCambios(valoresIniciales: any, cambios: any) {
    const valoresActuales = cambios;

    if (this.prospectoForm.dirty) {
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

  onDialogShow() {
    this.cargarSectores();
  }

  cargarSectores() {
    this.prospectoService.getSectores(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        this.sectores = result;
        this.inicializarFormulario();
        this.cdr.detectChanges();
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

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  guardarProspecto() {
    if (this.prospectoForm.invalid) {
      this.prospectoForm.markAllAsTouched();
      this.mostrarToastError();
      return;
    }

    if ((this.formInfoAdicionales.invalid && this.inputInfoAdicionales.length > 0)) {
      this.formInfoAdicionales.markAllAsTouched();
      this.mostrarToastError();
      return;
    }

    this.prospectoForm.controls['estatus'].setValue(this.prospectoForm.value.estatus ? 1 : 0);
    this.prospectoForm.controls['bandera'].setValue(this.prospectoForm.value.bandera);
    this.prospectoForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
    this.prospectoForm.controls['usuarioCreador'].setValue(this.loginService.obtenerIdUsuario());
    this.informacionProspecto = {
      ...this.informacionProspecto,
      bandera: this.prospectoForm.get('bandera')?.value,
      idProspecto: this.prospectoForm.get('idProspecto')?.value,
      nombre: this.prospectoForm.get('nombre')?.value,
      ubicacionFisica: this.prospectoForm.get('ubicacionFisica')?.value,
      idSector: this.prospectoForm.get('idSector')?.value,
      estatus: this.prospectoForm.get('estatus')?.value,
      idEmpresa: this.prospectoForm.get('idEmpresa')?.value,
      usuarioCreador: this.prospectoForm.get('usuarioCreador')?.value
    }


    this.prospectoService.postInsertProspecto(this.informacionProspecto).subscribe({
      next: (result: baseOut) => {
        if (this.inputInfoAdicionales.length > 0) {
          this.guardarInformacionAdicional(result)
        }
        else {
          this.result.emit(result);
          this.close();
        }
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

  getInputsAdicionales() {
    this.prospectoService.getInputsAdicionalesData(this.loginService.obtenerIdEmpresa(), 'PROSPECTOS', this.idReferencia).subscribe({
      next: (result) => {
        this.inputInfoAdicionales = result;
        this.formArrayInfoAdicional.clear();
        if (this.inputInfoAdicionales.length > 0) {
          this.agregarElementosFormulario();
        }
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

  inicializarFormularioAdicional() {
    this.formInfoAdicionales = this.fb.group({
      formArrayInfoAdicional: this.fb.array([])
    })
  }

  agregarElementosFormulario() {
    let valoresIniciales: Record<string, any>;

    this.inputInfoAdicionales.forEach(v => {
      let config: any = {
        idInput: [v.idInput],
        etiqueta: [v.etiqueta],
        tipoCampo: [v.tipoCampo],
        idInputData: [v.idInputData]
      }
      let arrayValidadores = []
      if (v.requerido) {
        arrayValidadores.push(Validators.required)
      }
      config.valor = [v.valor, arrayValidadores]
      let formCredito = this.fb.group(config)

      this.formArrayInfoAdicional.push(formCredito)
    })


    valoresIniciales = this.formInfoAdicionales.getRawValue();
    this.formInfoAdicionales.valueChanges.subscribe((changes) => {
      this.validarCambiosAdicionales(valoresIniciales, changes);
    });
    this.validaGuadarAdicionales = false;
  }

  validarCambiosAdicionales(valoresIniciales: any, cambios: any) {
    const valoresActuales = cambios;

    if (this.formInfoAdicionales.dirty) {
      this.validaGuadarAdicionales = true;
    }
    const valoresRegresaron = this.compararValores(valoresIniciales, valoresActuales);
    if (valoresRegresaron) {
      this.validaGuadarAdicionales = false;
    }
  }

  guardarInformacionAdicional(resultContacto: baseOut) {
    //Establecer los valores a array de inputs adicionales, y el id de referencia del conctacto
    if (this.insertarProspecto) {
      this.idReferencia = resultContacto.id
    }
    this.formArrayInfoAdicional.controls.forEach((control) => {
      let filtro = this.inputInfoAdicionales.find(x => x.idInput == control.get('idInput')?.value);
      if (filtro) {
        filtro.valor = control.get('valor')?.value;
        filtro.idReferencia = this.idReferencia
      }

    })

    this.prospectoService.guardarInputsAdicionalesData(this.inputInfoAdicionales).subscribe({
      next: () => {
        this.result.emit(resultContacto);
        this.close();
      },
      error: (error: baseOut) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se guardado correctamente el contacto pero no se puedo guardar información adicional. Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });
  }



  mostrarToastError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Es necesario llenar los campos indicados.',
    });
  }

  abrirModalInputsAdicionales() {
    //Deberias cerrar el modal de contactos, enviar emmit, y pasar parametro que es del modal de contactos
    let obj = {
      tipoCatalogo: "Prospectos",
      pantalla: "Prospectos",
      insertar: this.insertarProspecto,
      referencia: this.prospecto
    }
    this.activarModalInputsAdicionales.emit(obj);
    this.close();

  }

  esAdministrador(): boolean {
    const rolAdmin = 1;
    return this.loginService.obtenerRolUsuario() === rolAdmin;
  }
}
