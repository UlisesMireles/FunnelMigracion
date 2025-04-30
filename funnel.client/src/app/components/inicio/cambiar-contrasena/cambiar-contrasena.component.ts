import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Usuarios } from '../../../interfaces/usuarios';
import { LoginService } from '../../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: false,
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent implements OnInit {
  formCambiarPassword!: FormGroup;
  usuario: string = "";
  correo: string = "";
  tipoUsuario: string = "";
  idUsuario: string = "";
  fotoSeleccionada: File | null = null;
  @ViewChild('inputFoto') inputFoto!: ElementRef<HTMLInputElement>;
  informacionUsuario: Usuarios = {
    idUsuario: 0,
    usuario: '',
    password: '',
    tipoUsuario: '',
    result: false,
    errorMessage: '',
    nombre: '',
    correo: '',
    idEmpresa: 0,
    idTipoUsuario: 0,
    descripcion: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaRegistro: '',
    fechaModificacion: '',
    estatus: 0,
    desEstatus: '',
    archivoImagen: '',
    usuarioCreador: 0,
    codigoAutenticacion: '',
    fechaInicio: '',
    fechaFin: '',
    iniciales: '',
    id: 0,
    imagen: undefined
  };

  fotoUrl: string | null = null;
  
  constructor(private fb: FormBuilder,  private router: Router, private messageService: MessageService, private authService: LoginService) {
  }

  ngOnInit(): void {
    this.usuario = localStorage.getItem('username') as string;
    this.correo = localStorage.getItem('correo') as string;
    this.tipoUsuario = localStorage.getItem('tipoUsuario') as string;
    this.idUsuario = localStorage.getItem('currentUser') as string;
    this.informacionUsuario.usuario = this.usuario;
    this.informacionUsuario.correo = this.correo;
    this.informacionUsuario.tipoUsuario = this.tipoUsuario;
    this.informacionUsuario.idUsuario = Number(this.idUsuario);

    this.formCambiarPassword = this.fb.group({
      usuario: [{value:this.usuario, disabled: true}],
      correo: [{value: this.correo, disabled: true}],
      tipoUsuario: [{value: this.tipoUsuario, disabled: true}],
      contrasena: ['', []],
      contrasenaConfirm: ['', []],
      fotoSeleccionada: [null]
    }, {validators: [this.contrasenasIgualesValidator, this.imagenOContrasenaValidator() ]});

    this.formCambiarPassword.get('fotoSeleccionada')?.valueChanges.subscribe(() => {
      this.actualizarValidadoresContrasena();
    });
  
    // Inicializar los validadores en función de si hay foto seleccionada
    this.actualizarValidadoresContrasena();
  }

  actualizarValidadoresContrasena() {
    const fotoSeleccionada = this.formCambiarPassword.get('fotoSeleccionada')?.value;
    
    if (fotoSeleccionada) {
      this.formCambiarPassword.get('contrasena')?.clearValidators();
      this.formCambiarPassword.get('contrasenaConfirm')?.clearValidators();
    } else {
      this.formCambiarPassword.get('contrasena')?.setValidators([Validators.required]);
      this.formCambiarPassword.get('contrasenaConfirm')?.setValidators([Validators.required]);
    }
    this.formCambiarPassword.get('contrasena')?.updateValueAndValidity();
    this.formCambiarPassword.get('contrasenaConfirm')?.updateValueAndValidity();
  }
  
  onFotoSeleccionada(event: any) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.fotoSeleccionada = input.files[0];
      this.formCambiarPassword.patchValue({ fotoSeleccionada: input.files[0] });
    }
  }

  removerFoto(): void {
    this.fotoSeleccionada = null;
  }

  abrirInput(): void {
    this.inputFoto.nativeElement.click();
  }

  cancelar() {
    this.router.navigate(['/oportunidades']);
  }

  guardar() {
    if (this.formCambiarPassword.invalid) {
      this.markAllAsTouched(this.formCambiarPassword);
      this.mostrarToastError("Es necesario llenar los campos indicados.");
      return;
    }
    this.informacionUsuario = {
      ...this.informacionUsuario,
      password: this.formCambiarPassword.get('contrasena')?.value,
    }
    this.informacionUsuario.archivoImagen = this.fotoSeleccionada?.name;
    this.informacionUsuario.imagen = this.fotoSeleccionada ?? undefined;

    const formData = new FormData();

    formData.append('Password', this.formCambiarPassword.get('contrasena')?.value);
    if (this.fotoSeleccionada) {
      formData.append('Imagen', this.fotoSeleccionada);
      formData.append('ArchivoImagen', this.fotoSeleccionada?.name);
    }

    formData.append('idUsuario', this.informacionUsuario.idUsuario.toString());

    this.authService.cambiarPassword(formData).subscribe({
      next: (response: any) => {
        if (response.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'La operación se realizó con éxito.',
            detail: response.errorMessage,
          });
          this.formCambiarPassword.reset();
          this.router.navigate(['/oportunidades']);
        } else {
          this.mostrarToastError(response.errorMessage);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });

  }

  mostrarToastError(mensaje: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
  
      if ((control as any).controls) {
        this.markAllAsTouched(control as FormGroup);
      }
    });
  }

  contrasenasIgualesValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('contrasena')?.value;
    const confirmPassword = form.get('contrasenaConfirm')?.value;
  
    if (password && confirmPassword && password !== confirmPassword) {
      return { contrasenasNoCoinciden: true };
    }
    return null;
  }

  imagenOContrasenaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contrasena = control.get('contrasena')?.value;
      const foto = control.get('fotoSeleccionada')?.value; 
  
      if (!contrasena && !foto) {
        return { 'alMenosUnoDebeLlenarse': true };
      }
  
      return null;
    };
  }

  contrasenaRequeridaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contrasena = control.get('contrasena')?.value;
      const foto = control.get('fotoSeleccionada')?.value; 
  
      if (!foto && !contrasena) {
        return { 'contrasenaEsRequerida': true };
      }
  
      return null;
    };
  }

}
