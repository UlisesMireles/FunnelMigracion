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
import { Router } from '@angular/router';

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

  prospectoNombreIngresado: boolean = false;
  mostrarProspectoFijo: boolean = false;
  idUsuarioQR: number = 0;
  idEmpresaQR: number = 0;
  siteKey: string = '6LdlBicqAAAAABMCqyAjZOTSKrbdshNyKxwRiGL9';
  captchaForm: FormGroup;

  constructor(private route: ActivatedRoute,private contactosService: ContactosService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private prospectoService: ProspectoService,
     private router: Router
  ) {
    this.contactoForm = this.fb.group({});
    this.prospectoForm = this.fb.group({});
    this.captchaForm = this.fb.group({
    recaptcha: ['', Validators.required]
});

  }

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        try {
          const decoded = JSON.parse(atob(token));
          this.idUsuarioQR = decoded.idUsuario;
          this.idEmpresaQR = decoded.idEmpresa;

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
        idProspecto: [this.contacto?.idProspecto ?? null],
        estatus: [1],
        idEmpresa: [this.idEmpresaQR],
        usuarioCreador: [this.idUsuarioQR],
        bandera: ['INSERT'],
        recaptcha: ['', Validators.required]
      });
      this.validaGuadar = false;
      this.cdr.detectChanges();

    }
  }

  inicializarFormularioProspectos() {
    if (this.insertarContacto) { 
      this.prospectoForm = this.fb.group({
        idProspecto: [0],
        nombre: ['', [Validators.required, Validators.maxLength(50)]],
        ubicacionFisica: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
        idSector: [null],
        estatus: [1],
        idEmpresa: [this.idEmpresaQR],
        bandera: ['INSERT'],
        usuarioCreador: [this.idUsuarioQR],
        //recaptcha: ['', Validators.required]
      });
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
    if (this.contactoForm.invalid || this.prospectoForm.invalid || this.captchaForm.invalid) {
      this.contactoForm.markAllAsTouched();
      this.prospectoForm.markAllAsTouched();
      this.captchaForm.markAllAsTouched();
      this.mostrarToastError();
      return;
    }
    const contactoData = this.contactoForm.value;
    const prospectoData = this.prospectoForm.value;
    this.prospectoService.insertProspecto(prospectoData).subscribe({
      next: (prospectoResult) => {
        contactoData.idProspecto = prospectoResult.id;
        this.contactosService.postContacto(contactoData).subscribe({
          next: (contactoResult) => {
            this.messageService.add({severity:'success', summary:'Éxito', detail:'Se guardaron contacto y prospecto'});
            this.result.emit(contactoResult);
            this.close();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (err) => this.messageService.add({severity:'error', summary:'Error', detail:err.errorMessage})
        });
      },
      error: (err) => this.messageService.add({severity:'error', summary:'Error', detail:err.errorMessage})
    });
  }
  onProspectoNombreBlur() {
    const nombreProspecto = this.prospectoForm.get('nombre')?.value;
    this.prospectoNombreIngresado = !!nombreProspecto && nombreProspecto.trim() !== '';
    
    this.cdr.detectChanges();
  }
 handleReset() {
    console.log('reCAPTCHA reset');
  }

  handleExpire() {
    console.log('reCAPTCHA expired');
  }

  handleLoad() {
    console.log('reCAPTCHA loaded');
  }

  handleSuccess(event: any) {
    console.log('reCAPTCHA success:', event);
  }
}