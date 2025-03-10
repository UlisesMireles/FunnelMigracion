import { Component, EventEmitter,Input, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { Usuario } from '../../../../interfaces/usuarios';
import { UsuariosService } from '../../../../services/usuarios.service';
import { LoginService } from '../../../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestUsuario } from '../../../../interfaces/usuarios';


@Component({
  selector: 'app-modal-usuarios',
  standalone: false,
  templateUrl: './modal-usuarios.component.html',

})
export class ModalUsuariosComponent {

  
  constructor(private UsuariosService: UsuariosService, private messageService: MessageService, private loginService: LoginService, private fb: FormBuilder) { }
    @Input() usuario!: Usuario;
    @Input() usuarios: Usuario[] = [];
    @Input() title: string = 'Modal';
    @Input() visible: boolean = false;
    @Input() insertar: boolean = false;
    request!: RequestUsuario;
  
    usuarioForm!: FormGroup;

    tiposUsuario: any[] = [];

    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter();
    @Output() result: EventEmitter<baseOut> = new EventEmitter();

  ngOnInit() {
    this.inicializarFormulario ();
    console.log(this.loginService.obtenerIdEmpresa());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['usuario'] && this.usuario) {
      this.inicializarFormulario();
    }
  }

  inicializarFormulario() {
    console.log(this.insertar);
    if (this.insertar) {
      this.usuarioForm = this.fb.group({
        idUsuario: [0],
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
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        usuario: ['', [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern('^[a-zA-Z0-9_.-]+$')
          ]
        ],
        password: ['', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z0-9_.-]+$')
          ]
        ],
        iniciales: ['', [
            Validators.required,
            Validators.maxLength(5),
            Validators.pattern('^[A-Z]+$')
          ]
        ],
        idTipoUsuario: [null, Validators.required],
        estatus: [true],
        correo: ['', [Validators.required, Validators.email]],
        usuarioCreador: [this.loginService.obtenerIdEmpresa()],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        bandera: ['INSERT']
      });
      return;
    }

    else {
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
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        usuario: [this.usuario.usuario, [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern('^[a-zA-Z0-9_.-]+$')
          ]
        ],
        password: [''], 
        iniciales: [this.usuario.iniciales, [
            Validators.required,
            Validators.maxLength(5),
            Validators.pattern('^[A-Z]+$')
          ]
        ],
        idTipoUsuario: [this.usuario.idTipoUsuario, Validators.required],
        estatus: [this.usuario.estatus === 1],
        correo: [this.usuario.correo, [
            Validators.required,
            Validators.email,
            Validators.maxLength(100)
          ]
        ],
        usuarioCreador: [this.loginService.obtenerIdEmpresa()],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        bandera: ['UPDATE']
      });
    }
  }

  onDialogShow() {
    this.cargarTipoUsuario();
    this.inicializarFormulario(); 
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
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  guardarUsuario() {
    if (this.usuarioForm.invalid) {
      this.mostrarToastError();
      return;
    }
   
  
    this.usuarioForm.controls['estatus'].setValue(this.usuarioForm.value.estatus ? 1 : 0);
    this.usuarioForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
    this.usuarioForm.controls['bandera'].setValue(this.insertar ? 'INSERT' : 'UPDATE');
   
    console.log(this.usuarioForm.value);
   
    this.UsuariosService.postGuardarUsuario(this.usuarioForm.value).subscribe({
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


  mostrarToastError() {
    console.log(this.usuarioForm);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Es necesario llenar los campos indicados.',
    });
  }

  
}
