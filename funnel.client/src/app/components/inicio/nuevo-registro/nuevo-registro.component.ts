import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../interfaces/empresa';


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
  
  constructor(private fb: FormBuilder, private empresaService: EmpresaService, private messageService: MessageService) {}
   
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
      //direccion: ['', Validators.required],
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
  if (this.empresaForm.invalid || this.usuarioForm.invalid) {
    this.empresaForm.markAllAsTouched();
    this.usuarioForm.markAllAsTouched();
    return;
  }

  const empresaData = this.empresaForm.value;
  const usuarioData = this.usuarioForm.value;

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
    alias: empresaData.nombreEmpresa.substring(0, 20),
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
    password: usuarioData.confirmPassword
  };

  console.log('Objeto Empresa para enviar:', nuevaEmpresa);

  this.empresaService.postEmpresa(nuevaEmpresa).subscribe({
    next: (resp) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: resp.message || 'Empresa y usuario administrador creados'
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

}
