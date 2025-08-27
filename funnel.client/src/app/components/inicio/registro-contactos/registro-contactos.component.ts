import { Component, Input, Output, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { Contacto } from '../../../interfaces/contactos';
import { ContactosService } from '../../../services/contactos.service';
import { RequestPContacto } from '../../../interfaces/contactos';
import { LoginService } from '../../../services/login.service';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestProspecto } from '../../../interfaces/prospecto';
import { Prospectos } from '../../../interfaces/prospecto';
import { ProspectoService } from '../../../services/prospecto.service';

@Component({
  selector: 'app-registro-contactos',
  standalone: false,
  templateUrl: './registro-contactos.component.html',
  styleUrl: './registro-contactos.component.css'
})
export class RegistroContactosComponent {
  @Input() contacto!: Contacto;
  @Input() contactos: Contacto[] = [];
  @Input() prospecto!: Prospectos;
  @Input() title: string = 'Modal';
  @Input() visible: boolean = true;
  @Input() insertarContacto: boolean = true;
  @Input() lecturaProspecto: boolean = false;
  request!: RequestPContacto;
  @Input() insertarProspecto: boolean = false;
  requestp!: RequestProspecto;

  contactoForm: FormGroup;
  prospectoForm: FormGroup;
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

  idReferencia: number = 0;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();
  baseUrl: string = environment.baseURLAssets;
  constructor(private route: ActivatedRoute,private contactosService: ContactosService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private prospectoService: ProspectoService) {
    this.contactoForm = this.fb.group({});
    this.prospectoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        try {
          const decoded = JSON.parse(atob(token));
          const idUsuario = decoded.idUsuario;
          const idEmpresa = decoded.idEmpresa;
          console.log('ID Usuario:', idUsuario);
          console.log('ID Empresa:', idEmpresa);
        } catch (e) {
          console.error('Token inválido');
        }
      } else {
        console.log('Falta token');
      }
    });
    this.inicializarFormularioProspectos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    let idEmpresa = this.loginService.obtenerIdEmpresa();
    
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
        ]],
        telefono: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[0-9+\\-\\s()]+$')
        ]],
        correoElectronico: ['', [Validators.required, Validators.email]],
        idProspecto: [this.contacto?.idProspecto ?? null],
        estatus: [true],
        idEmpresa: [idEmpresa],
        usuarioCreador: [this.loginService.obtenerIdUsuario()],
        bandera: ['INSERT']
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();
    }
  }

  inicializarFormularioProspectos() {
    let idEmpresa = this.loginService.obtenerIdEmpresa();
    if (this.insertarContacto) { 
      this.prospectoForm = this.fb.group({
        idProspecto: [0],
        nombre: ['', [Validators.required, Validators.maxLength(50)]],
        ubicacionFisica: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
        idSector: [null],
        estatus: [true],
        idEmpresa: [idEmpresa],
        bandera: ['INSERT'],
        usuarioCreador: [this.loginService.obtenerIdUsuario()]
      });
    } else {
      this.idReferencia = this.contacto.idContactoProspecto;
      this.informacionContactos = this.contacto;
      
      this.contactoForm = this.fb.group({
        idContactoProspecto: [this.contacto?.idContactoProspecto],
        nombre: [this.contacto?.nombreCompleto, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
        ]],
        telefono: [this.contacto?.telefono || '', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[0-9+\\-\\s()]+$')
        ]],
        correoElectronico: [this.contacto?.correoElectronico || '', [Validators.required, Validators.email]],
        idProspecto: [this.contacto?.idProspecto, Validators.required],
        estatus: [this.contacto?.estatus === 1],
        idEmpresa: [idEmpresa],
        bandera: ['UPDATE'],
        usuarioCreador: [this.loginService.obtenerIdUsuario()]
      });
    }
    
    this.validaGuadar = false;
    this.cdr.detectChanges();
  }

  limpiarCampos() {
    // Solo limpiamos los campos si estamos insertando un nuevo contacto
    if (this.insertarContacto) {
      this.contactoForm.reset({
        idContactoProspecto: 0,
        idProspecto: null,
        estatus: true,
        idEmpresa: this.loginService.obtenerIdEmpresa(),
        usuarioCreador: this.loginService.obtenerIdUsuario(),
        bandera: 'INSERT'
      });
      
      // Marcamos el formulario como no tocado para limpiar los mensajes de error
      this.contactoForm.markAsUntouched();
      this.contactoForm.markAsPristine();
    }
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
      idEmpresa: this.contactoForm.get('idEmpresa')?.value,
      usuarioCreador: this.contactoForm.get('usuarioCreador')?.value
    }

    this.contactosService.postContacto(this.informacionContactos).subscribe({
      next: (result: baseOut) => {
        this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Contacto insertado correctamente.'
      });
        if (this.insertarContacto) {
          this.limpiarCampos();
        }
        
        this.result.emit(result);
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
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Es necesario llenar los campos indicados.',
    });
  }

  esAdministrador(): boolean {
    const rolAdmin = 1;
    return this.loginService.obtenerRolUsuario() === rolAdmin;
  }

  guardarAmbos() {
    if (this.contactoForm.invalid || this.prospectoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      this.prospectoForm.markAllAsTouched();
      this.mostrarToastError();
      return;
    }

    const contactoData = this.contactoForm.value;
    const prospectoData = this.prospectoForm.value;
    this.prospectoForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
    this.prospectoForm.controls['bandera'].setValue('INSERT');

    console.log('Datos del prospecto:', prospectoData);
    console.log('Datos del contacto:', contactoData);
    this.prospectoService.postInsertProspecto(prospectoData).subscribe({
      next: (prospectoResult) => {
        contactoData.idProspecto = prospectoResult.id;
        this.contactosService.postContacto(contactoData).subscribe({
          next: (contactoResult) => {
            this.messageService.add({severity:'success', summary:'Éxito', detail:'Se guardaron contacto y prospecto'});
            this.result.emit(contactoResult);
            this.close();
          },
          error: (err) => this.messageService.add({severity:'error', summary:'Error', detail:err.errorMessage})
        });
      },
      error: (err) => this.messageService.add({severity:'error', summary:'Error', detail:err.errorMessage})
    });
  }

}

