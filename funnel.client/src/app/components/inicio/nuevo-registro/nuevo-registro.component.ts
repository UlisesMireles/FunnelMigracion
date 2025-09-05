import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Usuarios } from '../../../interfaces/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { RequestUsuario } from '../../../interfaces/usuarios';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-nuevo-registro',
  standalone: false,
  templateUrl: './nuevo-registro.component.html',
  styleUrl: './nuevo-registro.component.css'
})
export class NuevoRegistroComponent implements OnInit {
  baseUrl: string = environment.baseURLAssets;
  currentStep = 1;

  usuarioForm!: FormGroup;
  empresaForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private UsuariosService: UsuariosService, private messageService: MessageService) {}
    @Input() usuario!: Usuarios;
    @Input() usuarios: Usuarios[] = [];
    request!: RequestUsuario;
  
  ngOnInit(): void {
    this.inicializarFormulario();
  }
  inicializarFormulario() {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      iniciales: [''], 
      correo: ['', [Validators.required, Validators.email]],
      idTipoUsuario: [1],
      estatus: [true],
      idEmpresa: [0],
      puesto: [''],
      telefono: ['', [
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[0-9+\\-\\s()]+$')
        ]
      ],
      bandera: ['INSERT']
    },{ validator: this.passwordMatchValidator });
    this.empresaForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      direccion: ['', Validators.required],
      rfc: ['', Validators.required],
      sitioWeb: [''],
    });
  }

  goToStep(step: number) {
    if (this.currentStep === 1 && this.usuarioForm.get('nombre')?.invalid || this.usuarioForm.get('correo')?.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    if (this.currentStep === 3 && this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

   /* if (this.currentStep === 4 && this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      return;
    }*/

    this.currentStep = step;
  }
  moveNext(event: Event, nextInput: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      nextInput.focus();
    }
  }

  movePrev(event: KeyboardEvent, prevInput: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value) {
      prevInput.focus();
    }
  }

  finish() {
    this.inicializarFormulario();
    this.currentStep = 1; 
  }

  registrarEmpresa(): void {
      const empresaData = this.empresaForm.value;
      /*if (this.empresaForm.invalid) {
        this.empresaForm.markAllAsTouched();
        return;
      }*/
      console.log('Datos de la empresa para registro:', empresaData);
      this.guardarUsuario(1);
      this.finish();
  }

  guardarUsuario(idEmpresa: number): void {
    try {
      if (this.usuarioForm.invalid) {
        this.usuarioForm.markAllAsTouched();
        return;
      }
      let usuarioData = this.usuarioForm.value;
        if (usuarioData.nombre) {
          const partes = usuarioData.nombre.trim().split(/\s+/);

          if (partes.length >= 3) {
            this.usuarioForm.patchValue({
              nombre: partes[0],
              apellidoPaterno: partes[1],
              apellidoMaterno: partes.slice(2).join(' ')
            });
          } else if (partes.length === 2) {
            this.usuarioForm.patchValue({
              nombre: partes[0],
              apellidoPaterno: partes[1],
              apellidoMaterno: ''
            });
          } else if (partes.length === 1) {
            this.usuarioForm.patchValue({
              nombre: partes[0],
              apellidoPaterno: '',
              apellidoMaterno: ''
            });
          }
        }

        usuarioData = this.usuarioForm.value;

        const iniciales = this.obtenerIniciales(
          usuarioData.nombre,
          usuarioData.apellidoPaterno,
          usuarioData.apellidoMaterno
        );

        this.usuarioForm.patchValue({ iniciales });
        this.usuarioForm.patchValue({ idEmpresa });

        const formValue = { ...this.usuarioForm.value };

        const usuarioIngresado = formValue.usuario?.trim()?.toLowerCase();
        const correoIngresado = formValue.correo?.trim()?.toLowerCase();
    
        const correoYaExiste = this.usuarios.some(u =>
          u.correo.toLowerCase() === correoIngresado
        );

        const usuarioYaExiste = this.usuarios.some(u =>
          u.usuario.toLowerCase() === usuarioIngresado
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

        delete formValue.confirmPassword;

        console.log('Datos combinados para registro:', formValue);
        
       /* this.UsuariosService.postGuardarUsuario(formValue).subscribe({
          next: (resp: any) => {
            console.log('Usuario guardado con éxito:', resp);
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Usuario registrado', 
              detail: resp.message });
          },
          error: (error) => {
            console.error('Error al guardar usuario:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Se ha producido un error.',
              detail: error.error?.errorMessage || 'Error desconocido al guardar usuario',
            });
          }
        });*/
    } catch (error) {
      console.error('Error en guardarUsuario:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: 'Error desconocido al guardar usuario',
      });
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

}
