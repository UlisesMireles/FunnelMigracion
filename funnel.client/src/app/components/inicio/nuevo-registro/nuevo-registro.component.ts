import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

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
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
     this.inicializarFormulario();
  }
  inicializarFormulario() {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
    });
    this.empresaForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      direccion: ['', Validators.required],
      rfc: ['', Validators.required],
      sitioWeb: [''],
    });
  }

  goToStep(step: number) {
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
    this.currentStep = 1; 
  }

  registrarEmpresa(): void {
      const empresaData = this.empresaForm.value;
      const usuarioData = this.usuarioForm.value;
      console.log('Empresa a registrar:', empresaData);
      console.log('Usuario a registrar:', usuarioData);
      this.finish();
  }


}
