import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Usuarios } from '../../../interfaces/usuarios';
import { LoginService } from '../../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagenActualizadaService } from '../../../services/imagen-actualizada.service';
import { environment } from '../../../../environments/environment';

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
  nombre: string = "";
  apellidoPaterno: string = "";
  apellidoMaterno: string = "";
  fotoSeleccionada: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  baseUrl: string = environment.baseURL;
  rutaImgenDefault: string = this.baseUrl + 'Fotografia/persona_icono_principal.png';
  rutaImgen: string = this.baseUrl + '/Fotografia/';
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
  validarGuardar: boolean = false;
  valoresIniciales: Record<string, any> = {};
  showPassword = false;
  showPasswordConfirm = false;
  contrasenaNoCoinciden: boolean = false;
  fotoSeleccionadaOriginal: File | null = null;

  constructor(private readonly fb: FormBuilder,  private readonly router: Router, private readonly messageService: MessageService, private readonly authService: LoginService, private readonly imagenService: ImagenActualizadaService) {
  }

  ngOnInit(): void {
    this.validarGuardar = false;
    this.contrasenaNoCoinciden = false;
    this.usuario = localStorage.getItem('username') as string;
    this.correo = localStorage.getItem('correo') as string;
    this.tipoUsuario = localStorage.getItem('tipoUsuario') as string;
    this.idUsuario = localStorage.getItem('currentUser') as string;
    this.nombre = localStorage.getItem('nombre') as string;
    this.apellidoPaterno = localStorage.getItem('apellidoPaterno') as string;
    this.apellidoMaterno = localStorage.getItem('apellidoMaterno') as string;
    this.informacionUsuario.usuario = this.usuario;
    this.informacionUsuario.correo = this.correo;
    this.informacionUsuario.tipoUsuario = this.tipoUsuario;
    this.informacionUsuario.idUsuario = Number(this.idUsuario);
    this.informacionUsuario.nombre = this.nombre;
    this.informacionUsuario.apellidoPaterno = this.apellidoPaterno;
    this.informacionUsuario.apellidoMaterno = this.apellidoMaterno;

    this.formCambiarPassword = this.fb.group({
      usuario: [{value:this.usuario, disabled: true}],
      correo: [{value: this.correo, disabled: true}],
      tipoUsuario: [{value: this.tipoUsuario, disabled: true}],
      contrasena: ['', []],
      contrasenaConfirm: ['', []],
      fotoSeleccionada: [this.fotoSeleccionada]
    }, { validators: this.contrasenasIgualesValidator });
    const imagenPerfil = localStorage.getItem('imagenPerfil');
    if (imagenPerfil) {
      this.fotoSeleccionada = { name: imagenPerfil } as File;
      this.formCambiarPassword.patchValue({ fotoSeleccionada: this.fotoSeleccionada });
      this.imagePreview =  this.baseUrl + '/Fotografia/' + imagenPerfil;
    }else{
    this.imagePreview = this.rutaImgenDefault;
  
    }
      
      this.valoresIniciales = this.formCambiarPassword.getRawValue();

    this.fotoSeleccionadaOriginal = this.fotoSeleccionada;

    this.formCambiarPassword.valueChanges.subscribe((changes) => {
      this.validarCambios(this.valoresIniciales, changes);
    });

    this.formCambiarPassword.valueChanges.subscribe((val) => {
      const contrasena = val.contrasena;
      const foto = val.fotoSeleccionada;
    
      const contrasenaCambiada = contrasena && contrasena.trim() !== '';
      const fotoCambiada = foto && foto !== this.fotoSeleccionadaOriginal;
    
      this.validarGuardar = contrasenaCambiada ?? fotoCambiada;
    
      this.formCambiarPassword.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
    

  }

  validarCambios(valoresIniciales: any, cambios: any) {
    let dataInicial = { contrasena: valoresIniciales.contrasena, fotoSeleccionada: valoresIniciales.fotoSeleccionada };
    let dataCambiada = { contrasena: cambios.contrasena, fotoSeleccionada: cambios.fotoSeleccionada };
  
    const valoresDiferentes = this.compararValores(dataCambiada, dataInicial);
  
    if (!valoresDiferentes) {
      this.validarGuardar = false;
    } else {
      this.contrasenasIgualesValidator(this.formCambiarPassword);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibilityConfirm() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  compararValores(valoresIniciales: any, valoresActuales: any) {
    let valoresInicialesJson = JSON.stringify(valoresIniciales);
    let valoresActualesJson = JSON.stringify(valoresActuales);

  return valoresInicialesJson !== valoresActualesJson;
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
      this.validarGuardar = true;
    }
    // Generar vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(this.fotoSeleccionada!);
  
  }
  

  removerFoto() {
    this.fotoSeleccionada = null;
    this.imagePreview =null;
    this.formCambiarPassword.get('fotoSeleccionada')?.setValue(null);
    this.validarGuardar = true;
    if (this.inputFoto) {
      this.inputFoto.nativeElement.value = '';
    }
    
  }
  

  abrirInput(): void {
    this.inputFoto.nativeElement.click();
  }
mostrarImagenDefault(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target && target.src !== this.rutaImgenDefault) {
    target.src = this.rutaImgenDefault;
  }
}

  cancelar() {
    this.router.navigate(['/oportunidades']);
  }

  guardar() {
    if (this.formCambiarPassword.invalid || this.contrasenaNoCoinciden) {
      this.markAllAsTouched(this.formCambiarPassword);
      this.mostrarToastError("Es necesario llenar los campos indicados.");
      return;
    }
    this.informacionUsuario = {
      ...this.informacionUsuario,
      password: this.formCambiarPassword.get('contrasena')?.value,
    }
     if (this.fotoSeleccionada) {
    const extension = this.fotoSeleccionada.name.split('.').pop();
    const nombreFormateado = `${this.informacionUsuario.apellidoPaterno}_${this.informacionUsuario.apellidoMaterno}_${this.informacionUsuario.nombre}`;
    this.informacionUsuario.archivoImagen = `${nombreFormateado}.${extension}`;
    this.informacionUsuario.imagen = this.fotoSeleccionada;
    } else {
    this.informacionUsuario.archivoImagen = '';
    this.informacionUsuario.imagen = undefined;
    }

    if (this.informacionUsuario.password != '')
    {
      let valorContrasena = this.contrasenasIgualesValidator(this.formCambiarPassword);
      if (valorContrasena != null )
      {
        this.validarGuardar = false;
        this.mostrarToastError("Las contraseñas no coinciden.");
        return;
      }
    }

    const formData = new FormData();

    formData.append('Password', this.formCambiarPassword.get('contrasena')?.value);
    if (this.fotoSeleccionada) {
      formData.append('Imagen', this.fotoSeleccionada);
      formData.append('ArchivoImagen', this.informacionUsuario.archivoImagen);
    }

    formData.append('idUsuario', this.informacionUsuario.idUsuario.toString());
    formData.append('Nombre', this.nombre); 
    formData.append('ApellidoPaterno', this.apellidoPaterno); 
    formData.append('ApellidoMaterno', this.apellidoMaterno); 

    this.authService.cambiarPassword(formData).subscribe({
      next: (response: any) => {
        if (response.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'La operación se realizó con éxito.',
            detail: response.errorMessage,
          });
          if(this.fotoSeleccionada) {
            this.imagenService.actualizarImagenPerfil(this.informacionUsuario.archivoImagen!);
          }
          else if (this.fotoSeleccionada == null && response.errorMessage == "La imagen se actualizó correctamente.") {
            this.imagenService.actualizarImagenPerfil('')
          }
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

  contrasenasIgualesValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const contrasena = group.get('contrasena')?.value;
    const contrasenaConfirm = group.get('contrasenaConfirm')?.value;
    if (contrasena && contrasenaConfirm && contrasena !== contrasenaConfirm) {
      this.contrasenaNoCoinciden = true;
      return { contrasenasNoCoinciden: true };
    }
    this.contrasenaNoCoinciden = false;
    return null;
  };

  imagenOContrasenaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contrasena = control.get('contrasena')?.value;
      const foto = control.get('fotoSeleccionada')?.value; 
  
      if (!contrasena && !foto) {
        return { 'imagenOContrasena': true };
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
