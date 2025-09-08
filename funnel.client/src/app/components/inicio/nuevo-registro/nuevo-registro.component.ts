import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../interfaces/empresa';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import { tail } from 'lodash-es';


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

  codigoTemporal: string | null = null; 
  codigoExpiracion: Date | null = null;
  codigoCompleto: boolean = false;

  idRegistroTemporal: number | null = null;
  mostrarModalRFC: boolean = false;
  rfcEmpresaExistente: string | null = null; 
  rfcExistente: boolean = false; 
  mostrarMensajeNuevaEmpresa: boolean = false;
  constructor(private fb: FormBuilder, private empresaService: EmpresaService, private messageService: MessageService, private usuariosService: UsuariosService,
    private router: Router
   ) {}
   
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
      bandera: ['INS-EMPRESA-GLU']
    },{ validator: this.passwordMatchValidator });
    this.empresaForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      direccion: ['', Validators.required],
      tamano:['', Validators.required],
      rfc: ['', {
    validators: [Validators.required],
    asyncValidators: [this.validarRfcExistente.bind(this)],
    updateOn: 'blur' 
    }],
      sitioWeb: [''],
    });
  }

  goToStep(step: number) {
    if (this.currentStep === 1) {
      if (this.usuarioForm.get('nombre')?.invalid || this.usuarioForm.get('correo')?.invalid) {
        this.usuarioForm.markAllAsTouched();
        return;
      }

      const datosPaso1 = {
        bandera: "INSERTAR",
        idRegistro: null,
        nombre: this.usuarioForm.get('nombre')?.value,
        correo: this.usuarioForm.get('correo')?.value
      };

      this.empresaService.guardarRegistroTemporal(datosPaso1).subscribe({
        next: (resp) => {
          this.idRegistroTemporal = resp.id;
          this.currentStep = step;
        },
        error: (err) => {
          console.error("Error en paso 1:", err);
        }
      });

      return;
    }
  if (this.currentStep === 3)
    {
      if (this.currentStep === 3 && this.usuarioForm.invalid) {
        this.usuarioForm.markAllAsTouched();
        return;
      }

      const datosPaso3 = {
        bandera: "ACTUALIZAR",
        idRegistro: this.idRegistroTemporal,
        usuario: this.usuarioForm.get('usuario')?.value,
    };
      this.empresaService.guardarRegistroTemporal(datosPaso3).subscribe({
        next: (resp) => {
          console.log("Datos de usuario guardados temporalmente:", resp);
          this.currentStep = step;
        },
        error: (err) => {
          console.error("Error en paso 3:", err);
        }
      });
      return;
    }
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
    setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
  }

registrarEmpresa(): void {
  if (this.empresaForm.invalid || this.usuarioForm.invalid) {
    this.empresaForm.markAllAsTouched();
    this.usuarioForm.markAllAsTouched();
    return;
  }

  const empresaData = this.empresaForm.value;
  const usuarioData = this.usuarioForm.value;

   const datosPaso4 = {
    bandera: "ACTUALIZAR",
    idRegistro: this.idRegistroTemporal,
    nombreEmpresa: empresaData.nombreEmpresa,
    direccion: empresaData.direccion,
    rfc: empresaData.rfc,
    urlSitio: empresaData.sitioWeb,
    tamano: empresaData.tamano
  };
  this.empresaService.guardarRegistroTemporal(datosPaso4).subscribe({
    next: (resp) => {
      console.log("Datos de empresa guardados temporalmente:", resp);
    },
    error: (err) => {
      console.error("Error al guardar datos de empresa temporalmente:", err);
    }
  });

  if (usuarioData.nombre) {
    const partes = usuarioData.nombre.trim().split(/\s+/);

    if (partes.length >= 3) {
      usuarioData.nombre = partes[0];
      usuarioData.apellidoPaterno = partes[1];
      usuarioData.apellidoMaterno = partes.slice(2).join(' ');
    } else if (partes.length === 2) {
      usuarioData.nombre = partes[0];
      usuarioData.apellidoPaterno = partes[1];
      usuarioData.apellidoMaterno = '';
    } else if (partes.length === 1) {
      usuarioData.nombre = partes[0];
      usuarioData.apellidoPaterno = '';
      usuarioData.apellidoMaterno = '';
    }
  }

  const iniciales = this.obtenerIniciales(
    usuarioData.nombre,
    usuarioData.apellidoPaterno,
    usuarioData.apellidoMaterno
  );

  const nuevaEmpresa: Empresa = {
    bandera: usuarioData.bandera,
    idEmpresa: 0,
    nombreEmpresa: empresaData.nombreEmpresa,
    idAdministrador: 0,
    alias: this.generarInicialesEmpresa(empresaData.nombreEmpresa),
    idLicencia: 0,
    rfc: empresaData.rfc,
    vInicio: new Date(),
    vTerminacion: new Date(),
    usuarioCreador: 0,
    nombre: usuarioData.nombre,
    apellidoPaterno: usuarioData.apellidoPaterno,
    apellidoMaterno: usuarioData.apellidoMaterno,
    iniciales: iniciales,
    correo: usuarioData.correo,
    usuario: usuarioData.usuario,
    urlSitio: empresaData.sitioWeb,
    activo:0,
    permitirDecimales: false,
    password: usuarioData.confirmPassword,
    direccion: empresaData.direccion,
    tamano: empresaData.tamano
  };

  console.log('Objeto Empresa para enviar:', nuevaEmpresa);

  this.empresaService.postEmpresa(nuevaEmpresa).subscribe({
    next: (resp) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: resp.message || 'Registro completado exitosamente'
      });
      this.finish();
    },
    error: (err) => {
      console.error('Error al registrar empresa:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'No se pudo registrar'
      });
    }
  });
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
  codigoValidadorCorreo(correo: string): void {
    this.usuariosService.validacionCorreoRegistro(correo).subscribe({
      next: (result: any) => {
        if (result.errorMessage) {
         
          this.codigoTemporal = result.errorMessage; 
          this.codigoExpiracion = new Date();
          this.codigoExpiracion.setMinutes(this.codigoExpiracion.getMinutes() + 2);
  

          this.messageService.add({
            severity: 'success',
            summary: 'Código enviado',
            detail: 'Revisa tu correo para obtener el código de verificación.',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al enviar código',
            detail: result.errorMessage || 'No se pudo enviar el código.',
          });
        }
      },
      error: (error) => {
        console.error('Error al validar correo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: 'Error desconocido al validar correo',
        });
      }
    });
  }
   verificarCodigoUsuario(codigoIngresado: string, inputs?: HTMLInputElement[]): boolean {
    if (!this.codigoTemporal || !this.codigoExpiracion) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Código no generado',
        detail: 'Primero solicita el código de verificación.',
      });
      return false;
    }

    const ahora = new Date();
    if (ahora > this.codigoExpiracion) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Código expirado',
        detail: 'El código ha expirado. Solicita uno nuevo.',
      });
      this.codigoTemporal = null;
      this.codigoExpiracion = null;
      return false;
    }

    if (codigoIngresado === this.codigoTemporal) {
      this.goToStep(3);
      return true;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Código incorrecto',
        detail: 'El código ingresado no es válido.',
      });

    if (inputs) {
      inputs.forEach(input => input.value = '');
      inputs[0].focus(); 
      this.codigoCompleto = false;
    }
      return false;
    }
  }
  checkCodigoInputs(...inputs: HTMLInputElement[]) {
    this.codigoCompleto = inputs.every(input => input.value.length === 1);
  }
     
  private generarInicialesEmpresa(nombreEmpresa: string): string {
  if (!nombreEmpresa) return '';

  const palabras = nombreEmpresa
    .trim()
    .split(/\s+/)
    .filter(p => !['de', 'la', 'los', 'del', 'y'].includes(p.toLowerCase()));

  const iniciales = palabras
    .map(p => p[0].toUpperCase())
    .join('')
    .substring(0, 5);

  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomChar = caracteres.charAt(Math.floor(Math.random() * caracteres.length));

  return `${iniciales}${randomChar}`;
}

  reenviarCodigo(inputs: HTMLInputElement[]) {
    inputs.forEach(input => input.value = '');
    inputs[0].focus();
    this.codigoCompleto = false;

    const correo = this.usuarioForm.get('correo')?.value;
    if (correo) {
      this.codigoValidadorCorreo(correo);
    }
  }
 validarRfcExistente(control: any) {
  return new Promise((resolve) => {
    const rfc = control.value?.trim();
    if (!rfc) {
     this.rfcExistente = false;
     resolve(null);
      return;
      
    }

    this.empresaService.getEmpresas().subscribe({
      next: (empresas) => {
        const existe = empresas.some(e => e.rfc!.toUpperCase() === rfc.toUpperCase());
        if (existe) {
          this.rfcEmpresaExistente = rfc;
          this.rfcExistente = true;
          this.mostrarModalRFC = true; 
          resolve({ rfcExistente: true });
        } else {
          this.rfcExistente = false;
          resolve(null);
        }
      },
      error: () => {
        resolve(null); 
      }
    });
  });
}
 onNoUnirse(): void {
    this.mostrarModalRFC = false;
    this.limpiarFormularioEmpresa();
    this.rfcExistente = false;
    this.mostrarMensajeNuevaEmpresa = true;
    
  setTimeout(() => {
      this.mostrarMensajeNuevaEmpresa = false;
    }, 5000);
  }
  
  private limpiarFormularioEmpresa(): void {
    this.empresaForm.reset({
      nombreEmpresa: '',
      direccion: '',
      rfc: '',
      sitioWeb: '',
      tamano: ''
    });
    
    Object.keys(this.empresaForm.controls).forEach(key => {
      const control = this.empresaForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        control.setErrors(null);
      }
    });
  }
  unirse(): void {
    //this.usuarioForm();
    this.mostrarModalRFC = false;
     this.messageService.add({
      severity: 'success',
      summary: 'Solicitud enviada',
      detail: 'Tu solicitud para unirte a la empresa ha sido enviada.',
    });
  }

}
