import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Contacto } from '../../../../interfaces/contactos';

import { ContactosService } from '../../../../services/contactos.service';
import { RequestPContacto } from '../../../../interfaces/contactos';
import { LoginService } from '../../../../services/login.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal-contactos',
  standalone: false,
  templateUrl: './modal-contactos.component.html',
})
export class ModalContactosComponent {

  constructor(private contactosService : ContactosService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
  @Input() contacto!: Contacto;
  @Input() contactos: Contacto[]=[];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: RequestPContacto;

  contactoForm!: FormGroup;
  validaGuadar: boolean = false;
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

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  // ngOnInit() {
  //   this.inicializarFormulario();
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['contacto'] && this.contacto) {
  //     this.inicializarFormulario();
  //   }
  // }

  inicializarFormulario() {
    let idEmpresa = this.loginService.obtenerIdEmpresa();
    let valoresIniciales: Record<string, any>;
    if (this.insertar) {
      this.informacionContactos = {idContactoProspecto: 0,
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
        idEmpresa: 0};
      this.contactoForm = this.fb.group({
        idContactoProspecto: [0],
        nombre: ['', [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        telefono: ['', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15),
            Validators.pattern('^[0-9]+$')
          ]
        ],
        correoElectronico: ['', [Validators.required, Validators.email]],
        idProspecto: [null, Validators.required],
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
            Validators.maxLength(15),
            Validators.pattern('^[0-9]+$')
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
  }

  guardarContacto(){
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      this.mostrarToastError();
      return;
    }
    this.contactoForm.controls['estatus'].setValue(this.contactoForm.value.estatus ? 1 : 0);
    this.contactoForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
    this.contactoForm.controls['bandera'].setValue(this.insertar ? 'INSERT' : 'UPDATE');

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
  mostrarToastError() {
    console.log(this.contactoForm);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Es necesario llenar los campos indicados.',
    });
  }
}
