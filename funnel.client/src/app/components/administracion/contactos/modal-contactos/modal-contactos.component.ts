import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Contacto } from '../../../../interfaces/contactos';

import { ContactosService } from '../../../../services/contactos.service';
import { RequestPContacto } from '../../../../interfaces/contactos';
import { LoginService } from '../../../../services/login.service';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InpoutAdicionalData } from '../../../../interfaces/input-adicional-data';


@Component({
  selector: 'app-modal-contactos',
  standalone: false,
  templateUrl: './modal-contactos.component.html',
})
export class ModalContactosComponent {

  @Input() contacto!: Contacto;
  @Input() contactos: Contacto[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertarContacto: boolean = false;
  @Input() lecturaProspecto: boolean = false;
  request!: RequestPContacto;

  contactoForm: FormGroup;
  formInfoAdicionales: FormGroup;
  inputInfoAdicionales: InpoutAdicionalData[] = [];
  validaGuadar: boolean = false;
  validaGuadarAdicionales: boolean = false;
  prospectos: any[] = [];
  informacionContactos: Contacto = {
    idContactoProspecto: 0,
    bandera: '',
    nombreCompleto: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    correoElectronico: '',
    estatus: 0,
    desEstatus: '',
    prospecto: '',
    idProspecto: 0,
    idEmpresa: 0
  };

  idReferencia: number = 0;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();
  @Output() activarModalInputsAdicionales: EventEmitter<any> = new EventEmitter();

  constructor(private contactosService: ContactosService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.formInfoAdicionales = this.fb.group({});
    this.contactoForm = this.fb.group({});
  }


  ngOnInit() {
    this.inicializarFormulario();
    this.incializarFormularioAdicional();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['contacto'] && this.contacto) {
  //     this.inicializarFormulario();
  //   }
  // }

  inicializarFormulario() {
    let idEmpresa = this.loginService.obtenerIdEmpresa();
    let valoresIniciales: Record<string, any>;
    if (this.insertarContacto) {
      this.idReferencia = 0;
      this.informacionContactos = {
        idContactoProspecto: 0,
        bandera: '',
        nombreCompleto: '',
        nombre: this.contacto?.nombre ?? '',
        apellidos: '',
        telefono: '',
        correoElectronico: '',
        estatus: 0,
        desEstatus: '',
        prospecto: '',
        idProspecto: this.contacto?.idProspecto ?? 0,
        idEmpresa: 0
      };
      this.contactoForm = this.fb.group({
        idContactoProspecto: [0],
        nombre: [this.contacto?.nombre ?? '', [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
        ]
        ],
        telefono: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[0-9+\\-\\s()]+$')
        ]
        ],
        correoElectronico: ['', [Validators.required, Validators.email]],
        idProspecto: [this.contacto?.idProspecto ?? null, Validators.required],
        estatus: [true],
        idEmpresa: [idEmpresa],

        bandera: ['INSERT']
      });

      valoresIniciales = this.contactoForm.getRawValue();

      this.contactoForm.valueChanges.subscribe((changes) => {
        this.validarCambios(valoresIniciales, changes);
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();

    } else {
      this.idReferencia = this.contacto.idContactoProspecto;
      this.informacionContactos = this.contacto;
      this.contactoForm = this.fb.group({
        idContactoProspecto: [this.contacto?.idContactoProspecto],
        nombre: [this.contacto?.nombreCompleto, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
        ]
        ],
        telefono: [this.contacto?.telefono || '', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[0-9+\\-\\s()]+$')
        ]
        ],
        correoElectronico: [this.contacto?.correoElectronico || '', [Validators.required, Validators.email]],
        idProspecto: [this.contacto?.idProspecto, Validators.required],
        estatus: [this.contacto?.estatus === 1],
        idEmpresa: [idEmpresa],
        bandera: ['UPDATE']
      });

      valoresIniciales = this.contactoForm.getRawValue();

      this.contactoForm.valueChanges.subscribe((changes) => {
        this.validarCambios(valoresIniciales, changes);
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();
    }
    this.getInputsAdicionales();
  }

  validarCambios(valoresIniciales: any, cambios: any) {
    const valoresActuales = cambios;

    if (this.contactoForm.dirty) {
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
    this.cargarProspectos();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
    if (this.insertarContacto) {
      this.inicializarFormulario();
    }
  }

  guardarContacto() {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      this.mostrarToastError();
      return;
    }
    if ((this.formInfoAdicionales.invalid && this.inputInfoAdicionales.length > 0)) {
      this.formInfoAdicionales.markAllAsTouched();
      this.mostrarToastError();
      return;
    }
    this.contactoForm.controls['estatus'].setValue(this.contactoForm.value.estatus ? 1 : 0);
    this.contactoForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
    this.contactoForm.controls['bandera'].setValue(this.insertarContacto ? 'INSERT' : 'UPDATE');

    this.informacionContactos = {
      ...this.informacionContactos,
      bandera: this.contactoForm.get('bandera')?.value,
      idContactoProspecto: this.contactoForm.get('idContactoProspecto')?.value,
      nombre: this.contactoForm.get('nombre')?.value,
      telefono: this.contactoForm.get('telefono')?.value,
      correoElectronico: this.contactoForm.get('correoElectronico')?.value,
      idProspecto: this.contactoForm.get('idProspecto')?.value,
      estatus: this.contactoForm.get('estatus')?.value,
      idEmpresa: this.contactoForm.get('idEmpresa')?.value
    }

    this.contactosService.postContacto(this.informacionContactos).subscribe({
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

  cargarProspectos() {
    this.contactosService.getProspectos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        this.prospectos = result;
        this.inicializarFormulario();
        this.cdr.detectChanges();
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

  getInputsAdicionales() {
    this.contactosService.getInputsAdicionales(this.loginService.obtenerIdEmpresa(), 'CONTACTOS', this.idReferencia).subscribe({
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

  incializarFormularioAdicional() {
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
    if (this.insertarContacto) {
      this.idReferencia = resultContacto.id
    }
    this.formArrayInfoAdicional.controls.forEach((control) => {
      let filtro = this.inputInfoAdicionales.find(x => x.idInput == control.get('idInput')?.value);
      if (filtro) {
        filtro.valor = control.get('valor')?.value;
        filtro.idReferencia = this.idReferencia
      }

    })

    this.contactosService.guardarInputsAdicionalesData(this.inputInfoAdicionales).subscribe({
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
  get formArrayInfoAdicional(): FormArray {
    return this.formInfoAdicionales.controls["formArrayInfoAdicional"] as FormArray;
  }


  abrirModalInputsAdicionales() {
    //Deberias cerrar el modal de contactos, enviar emmit, y pasar parametro que es del modal de contactos
    let obj = {
      tipoCatalogo: "Contactos",
      pantalla: "Contactos",
      insertar: this.insertarContacto,
      referencia: this.contacto
    }
    this.activarModalInputsAdicionales.emit(obj);
    this.close();

  }

  esAdministrador(): boolean {
    const rolAdmin = 1;
    return this.loginService.obtenerRolUsuario() === rolAdmin;
  }
}
