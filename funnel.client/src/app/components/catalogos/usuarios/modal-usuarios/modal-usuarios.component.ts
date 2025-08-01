import { Component, EventEmitter,Input, Output, SimpleChanges, ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Usuarios } from '../../../../interfaces/usuarios';
import { UsuariosService } from '../../../../services/usuarios.service';
import { LoginService } from '../../../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestUsuario } from '../../../../interfaces/usuarios';
import { ImagenActualizadaService } from '../../../../services/imagen-actualizada.service';
import { environment } from '../../../../../environments/environment';
import { Puestos } from '../../../../interfaces/usuarios';

@Component({
  selector: 'app-modal-usuarios',
  standalone: false,
  templateUrl: './modal-usuarios.component.html',

})
export class ModalUsuariosComponent {

  
  constructor(private UsuariosService: UsuariosService, private messageService: MessageService, private loginService: LoginService, private fb: FormBuilder, private readonly imagenService: ImagenActualizadaService, private cdr: ChangeDetectorRef) { }
    @Input() usuario!: Usuarios;
    @Input() usuarios: Usuarios[] = [];
    @Input() title: string = 'Modal';
    @Input() visible: boolean = false;
    @Input() insertar: boolean = false;
    request!: RequestUsuario;
  
    usuarioForm!: FormGroup;
    tiposUsuario: any[] = [];
    //puestos: any[] = [];

    selectedFile: File | null = null;
    selectedFileName: string = '';
    selectedFileOriginal: File | null = null;
    formModificado: boolean = false;
    showPassword = false;
    showConfirmPassword = false;
    imagePreview: string | ArrayBuffer | null = null;
    baseUrl: string = environment.baseURL;
    rutaImgenDefault: string = this.baseUrl + 'Fotografia/persona_icono_principal.png';
    rutaImgen: string = this.baseUrl + '/Fotografia/';
    busquedaPuesto: string = '';
    /*puestoSeleccionado: boolean = false;
    puestosSeleccionado!: Puestos;
    puestosFiltrados: any[] = [];*/
    
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter();
    @Output() result: EventEmitter<baseOut> = new EventEmitter();

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.inicializarFormulario ();
    this.escucharCambiosEnCampos();
   // this.cargarPuestos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['usuario'] && this.usuario) {
      this.inicializarFormulario();
      this.escucharCambiosEnCampos();
    }
  }

  inicializarFormulario() {
   // this.puestosFiltrados = this.puestos;
    if (this.insertar) {
      const passwordGenerada = this.generarPassword(); 
      this.usuarioForm = this.fb.group({
        nombre: ['', [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        apellidoPaterno: ['', [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        apellidoMaterno: ['', [
            //Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]*$')
          ]
        ],
        usuario: ['', [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern('^[a-zA-Z0-9_.-]+$')
          ]
        ],
        password: [passwordGenerada, [
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z0-9_.-]+$')
        ]],
        confirmPassword: [passwordGenerada],
        iniciales: [{ value: '', disabled: true }, [
          Validators.required,
          Validators.maxLength(5),
          Validators.minLength(3),
          Validators.pattern('^[A-Z]+$')
          ]
        ],  
        selectedFile:[this.selectedFile],
        idTipoUsuario: [null, Validators.required],
        estatus: [true],
        correo: ['', [Validators.required, Validators.email]],
        telefono: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[0-9+\\-\\s()]+$')
        ]
        ],
        idUsuario: [this.loginService.obtenerIdUsuario()],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        //idPuesto: [null, Validators.required],
        puesto: ['',[
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        bandera: ['INSERT']
      },{ validator: this.passwordMatchValidator });
      return;
    }

    else {
      if (this.usuario.archivoImagen) { 
        this.selectedFile = { name: this.usuario.archivoImagen } as File;
        this.selectedFileName = this.usuario.archivoImagen;
        
        this.imagePreview = `${this.baseUrl}/Fotografia/${this.usuario.archivoImagen}?t=${Date.now()}`;
  } else {
    this.imagePreview = this.rutaImgenDefault;
  }
        
        /*if (this.usuario.archivoImagen) { 
          this.selectedFileName = this.usuario.archivoImagen;
         
        }*/
      this.usuarioForm = this.fb.group({
        idUsuario: [this.usuario.idUsuario],
        nombre: [this.usuario.nombre, [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        apellidoPaterno: [this.usuario.apellidoPaterno, [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        apellidoMaterno: [this.usuario.apellidoMaterno, [
            //Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]*$')
          ]
        ],
        usuario: [this.usuario.usuario, [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern('^[a-zA-Z0-9_.-]+$')
          ]
        ],
        password: [''], 
        confirmPassword: [''],
        iniciales: [{ value: '', disabled: false }, [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern('^[A-Z]+$')
          ]
        ],      
        selectedFile:[this.selectedFile],
        idTipoUsuario: [this.usuario.idTipoUsuario, Validators.required],
        estatus: [this.usuario.estatus === 1],
        correo: [this.usuario.correo, [
            Validators.required,
            Validators.email,
            Validators.maxLength(100)
          ]
        ],
        telefono: [this.usuario.telefono, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[0-9+\\-\\s()]+$')
        ]
        ],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        //idPuesto: [this.usuario.idPuesto, Validators.required],
        puesto: [this.usuario.puesto, [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        bandera: ['UPDATE']
      }, { validator: this.passwordMatchValidator });
      this.selectedFileOriginal = this.selectedFile;
      this.actualizarIniciales(); 
     /* if (this.usuario.idPuesto) {
        this.puestoSeleccionado = true;
        this.puestosSeleccionado = { id: this.usuario.idPuesto, descripcion: this.usuario.puesto } as Puestos;
        this.busquedaPuesto = this.puestosSeleccionado.descripcion;
      } else {
        this.puestoSeleccionado = false;
        this.busquedaPuesto = '';
      }*/
    }
  }

  generarPassword(): string {
    const alias = this.loginService.obtenerAlias();
    const añoActual = new Date().getFullYear();
    const passwordGenerada = `${alias.toLowerCase()}${añoActual}`; 
    return passwordGenerada;
  }


  onDialogShow() {
    this.cargarTipoUsuario();
 //   this.cargarPuestos();
    this.inicializarFormulario(); 
    this.escucharCambiosEnCampos();
  }

  cargarTipoUsuario() {
    this.UsuariosService.getTiposUsuarios(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        this.tiposUsuario = result;
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

 /* cargarPuestos() {
    this.UsuariosService.getPuestos(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        this.puestos = result;
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
  filtrarPuestos(event: any) {
    const valorBusqueda = event.filter.toLowerCase();
    this.busquedaPuesto = valorBusqueda;
    this.puestoSeleccionado = false;
    if (valorBusqueda.length > 0) {
      this.puestosFiltrados = this.puestos.filter(puesto =>
        puesto.descripcion.toLowerCase().includes(valorBusqueda)
      );
    } else {
      this.puestosFiltrados = this.puestos; 
   }
  }

  seleccionarPuesto(puesto: any) {
    if (puesto != null) {
      this.usuarioForm.get('idPuesto')?.setValue(puesto);
      this.busquedaPuesto = puesto.descripcion;
    }
    else {
      this.busquedaPuesto = "";
   }

    this.puestosFiltrados = this.puestos;
    this.puestoSeleccionado = true;
    this.cdr.detectChanges();
  }
*/
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();

    if (this.fileInput){
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  guardarUsuario() {
    try {
      if (this.usuarioForm.invalid) {
        this.mostrarToastError();
        return;
      }
  
      const formValue = { ...this.usuarioForm.getRawValue() };
      const usuarioIngresado = formValue.usuario?.trim()?.toLowerCase();
      const correoIngresado = formValue.correo?.trim()?.toLowerCase();
  
      const correoYaExiste = this.usuarios.some(u =>
        u.correo.toLowerCase() === correoIngresado &&
        u.idUsuario !== this.usuario.idUsuario
      );

      const usuarioYaExiste = this.usuarios.some(u =>
        u.usuario.toLowerCase() === usuarioIngresado &&
        u.idUsuario !== this.usuario.idUsuario
      );

      if (usuarioYaExiste) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Usuario duplicado',
          detail: `El nombre de usuario '${usuarioIngresado}' ya está en uso.`,
        });
        return;
      }

      if (correoYaExiste) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Correo duplicado',
          detail: `El correo '${correoIngresado}' ya está en uso.`,
        });
        return;
      }
  
      this.usuarioForm.get('iniciales')?.enable();
      delete formValue.confirmPassword;
  
      formValue.estatus = formValue.estatus ? 1 : 0;
      formValue.idEmpresa = this.loginService.obtenerIdEmpresa();
      formValue.bandera = this.insertar ? 'INSERT' : 'UPDATE';
  /*    let idPuesto = this.usuarioForm.get('idPuesto')?.value.idPuesto;
      if (idPuesto) {
        formValue.idPuesto = idPuesto;
      } else {
        delete formValue.idPuesto;
      }*/
  
      if (!this.insertar && !formValue.password) {
        delete formValue.password;
      }
      
      const formData = new FormData();
      for (const key in formValue) {
        if (key === 'selectedFile') continue; 
        const value = formValue[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
      let nombreArchivo = '';
      if (this.selectedFile instanceof File) {
      const extension = this.selectedFile.name.split('.').pop();

      const apellidoPaterno = formValue.apellidoPaterno || '';
      const apellidoMaterno = formValue.apellidoMaterno || '';
      const nombre = formValue.nombre || '';

      nombreArchivo = `${apellidoPaterno}_${apellidoMaterno}_${nombre}`;


      nombreArchivo = `${nombreArchivo}.${extension}`;


        // Agrega la imagen con el nuevo nombre
        formData.append('imagen', this.selectedFile, nombreArchivo);
      }

      this.UsuariosService.postGuardarUsuario(formData).subscribe({
        
        next: (result: any) => {
          if (result.result && this.selectedFile instanceof File) {
            if (this.usuario.idUsuario === this.loginService.obtenerIdUsuario()) {
              this.imagenService.actualizarImagenPerfil(nombreArchivo);
            } 
            }
            else if (this.selectedFile == null || this.selectedFile == undefined) {
              if (this.usuario.idUsuario === this.loginService.obtenerIdUsuario()) {
            this.imagenService.actualizarImagenPerfil('')}
          }
          this.result.emit(result);
          this.close();
          this.formModificado = false;
        },
        error: (error) => {
          console.error('Error al guardar usuario:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: error.error?.errorMessage || 'Error desconocido al guardar usuario',
          });
        }
      });
    } catch (error) {
      console.error('Error inesperado:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error inesperado',
        detail: 'Ocurrió un error inesperado al procesar la solicitud',
      });
    }
  }
  
  mostrarToastError() {
    let detail = 'Es necesario llenar los campos indicados.';
    
    if (this.usuarioForm.errors?.['mismatch']) {
      detail = 'Las contraseñas no coinciden.';
    } else if (this.usuarioForm.get('password')?.errors || this.usuarioForm.get('confirmPassword')?.errors) {
      detail = 'Por favor verifica los campos de contraseña.';
    }
  
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail,
    });
  }

  
  private escucharCambiosEnCampos() {
    this.usuarioForm.get('nombre')?.valueChanges.subscribe(() => this.actualizarIniciales());
    this.usuarioForm.get('apellidoPaterno')?.valueChanges.subscribe(() => this.actualizarIniciales());
    this.usuarioForm.get('apellidoMaterno')?.valueChanges.subscribe(() => this.actualizarIniciales());
    
    this.usuarioForm.get('password')?.valueChanges.subscribe(() => {
      if (this.usuarioForm.get('confirmPassword')?.value) {
        this.usuarioForm.get('confirmPassword')?.updateValueAndValidity({emitEvent: false});
      }
    });
    
    this.usuarioForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      if (this.usuarioForm.get('password')?.value) {
        this.usuarioForm.get('password')?.updateValueAndValidity({emitEvent: false});
      }
    });

    this.usuarioForm.valueChanges.subscribe(() => {
      this.formModificado = true;
    });
  }
  
  private async actualizarIniciales() {
    const nombre = this.usuarioForm.get('nombre')?.value;
    const apellidoPaterno = this.usuarioForm.get('apellidoPaterno')?.value;
    const apellidoMaterno = this.usuarioForm.get('apellidoMaterno')?.value;
    const idEmpresa = this.loginService.obtenerIdEmpresa();
  
    if (nombre && apellidoPaterno && idEmpresa) {
      let iniciales = this.obtenerIniciales(nombre, apellidoPaterno, apellidoMaterno);
  
      const existenIniciales = await this.validarInicialesExistente(iniciales, idEmpresa);
  
      if (existenIniciales) {
        iniciales = this.generarInicialesAlternativas(nombre, apellidoPaterno, apellidoMaterno);
      }
  
      this.usuarioForm.get('iniciales')?.setValue(iniciales, { emitEvent: false });
    }
  }
  
  private obtenerIniciales(nombre: string, apellidoPaterno: string, apellidoMaterno: string): string {
    let iniciales = '';
    const inicialAp1 = apellidoPaterno.substring(0, 1).toUpperCase();
    const inicialAp2 = apellidoMaterno ? apellidoMaterno.substring(0, 1).toUpperCase() : 'X';
  
    const nombres = nombre.split(' ');
    if (nombres.length === 1) {
      const inicialNomb = nombre.substring(0, 1).toUpperCase();
      iniciales = inicialNomb + inicialAp1 + inicialAp2;
    } else {
      iniciales = nombres[0].substring(0, 1).toUpperCase() + nombres[1].substring(0, 1).toUpperCase() + inicialAp1 + inicialAp2;
    }
  
    return iniciales;
  }
  
  private generarInicialesAlternativas(nombre: string, apellidoPaterno: string, apellidoMaterno: string): string {
    const nombreLimpio = nombre.replace(/\s+/g, '').toUpperCase();
    const paternoLimpio = apellidoPaterno.trim().toUpperCase();
    const maternoLimpio = apellidoMaterno.trim().toUpperCase();
  
    const letrasNombre = nombreLimpio.substring(0, 3).padEnd(3, 'X'); 
    const letraPaterno = paternoLimpio.charAt(0) || 'X';
    const letraMaterno = maternoLimpio.charAt(0) || 'X';
  
    return letrasNombre + letraPaterno + letraMaterno;
  }
  
  
  private async validarInicialesExistente(iniciales: string, idEmpresa: number): Promise<boolean> {
    try {
      return Boolean(await this.UsuariosService.validarInicialesExistente(iniciales, idEmpresa).toPromise());
    } catch (error) {
      console.error('Error al validar iniciales', error);
      return false; 
    }
  }

  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    if (password && confirmPassword) {
      return password === confirmPassword ? null : { mismatch: true };
    }
    return null;
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
    this.formModificado = true;

    // Generar vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
removerFoto() {
  this.selectedFile = null;
  this.selectedFileName = '';
  this.imagePreview = null; 
  this.usuarioForm.get('selectedFile')?.setValue(null);
  this.formModificado = true;
  
  // Limpiar el input de archivo para permitir seleccionar archivo 
  if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
}
  

  abrirInput(): void {
    this.fileInput.nativeElement.click();
  }
mostrarImagenDefault(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target && target.src !== this.rutaImgenDefault) {
    target.src = this.rutaImgenDefault;
  }
}
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}  
}
