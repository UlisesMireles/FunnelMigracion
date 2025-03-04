import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { SEL_Contacto } from '../../../../interfaces/contactos';

import { ContactosService } from '../../../../services/contactos.service';
import { requestContacto } from '../../../../interfaces/contactos';
import { LoginService } from '../../../../services/login.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal-contactos',
  standalone: false,
  templateUrl: './modal-contactos.component.html',
})
export class ModalContactosComponent {

  constructor(private contactosService : ContactosService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder) { }
  @Input() contacto!: SEL_Contacto;
  @Input() contactos: SEL_Contacto[]=[];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: requestContacto;

  contactoForm!: FormGroup;
  prospectos: any[] = [];  

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  ngOnInit() {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contacto'] && this.contacto) {
      this.inicializarFormulario();
    }
  }

  inicializarFormulario() {
    if (this.insertar) {
      this.contactoForm = this.fb.group({
        idContactoProspecto: [0],
        nombre: ['', [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        apellidos: ['', [
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
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        bandera: ['INSERT']
      });
      return;
    } else {
      this.contactoForm = this.fb.group({
        idContactoProspecto: [this.contacto?.idContactoProspecto],
        nombre: [this.contacto?.nombre, [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        apellidos: [this.contacto?.apellidos, [
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
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        bandera: ['UPDATE']
      });
    }
  }

  onDialogShow() {
    this.cargarProspectos();
    this.inicializarFormulario(); 
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  guardarContacto(){
    if (this.contactoForm.invalid) {
      this.mostrarToastError();
      return;
    }
    this.contactoForm.controls['estatus'].setValue(this.contactoForm.value.estatus ? 1 : 0);
    this.contactoForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
    this.contactoForm.controls['bandera'].setValue(this.insertar ? 'INSERT' : 'UPDATE');

    console.log(this.contactoForm.value);
    this.contactosService.postContacto(this.contactoForm.value).subscribe({
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
