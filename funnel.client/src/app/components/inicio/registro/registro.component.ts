import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../../services/login.service';
import { MessageService } from 'primeng/api';
import { SolicitudRegistroSistema } from '../../../interfaces/solicitud-registro';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { ModalService } from '../../../services/modal-perfil.service';
import { AsistenteService } from '../../../services/asistentes/asistente.service';
import { Subscription } from 'rxjs';
import { result } from 'lodash-es';
@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  aFormGroup!: FormGroup;
  siteKey: string = '6LdlBicqAAAAABMCqyAjZOTSKrbdshNyKxwRiGL9';
 // siteKey: string = '6LcOK0crAAAAAAV02O_xnUV4xzMYR8RuTzxiG2P_'; //Prueba
  baseUrl: string = environment.baseURLAssets;
  username: string = '';
  password: string = '';
  resetUsername: string = '';
  errorMessage: string = '';
  errorLogin: string = '';
  isLoginModalOpen: boolean = false;
  isResetModalOpen: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  resetForm: FormGroup = new FormGroup({});
  showErrors: boolean = false;
  resetErrorMessage: SafeHtml = '';
  showIniciarSesion: Boolean = false;
  showPassword = false;
  public backgroundImg: SafeStyle = "";
  informacionRegistro: SolicitudRegistroSistema = {nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    empresa: '',
    urlSitio: '',
    noEmpleados: '',
    privacidadTerminos: false,
    recaptcha: ''
  };
  
 
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: LoginService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar, private messageService: MessageService,
              private modalService: ModalService, public asistenteService: AsistenteService, private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(' + this.baseUrl + '/assets/img/PMAGRISES.png' + ')');

    this.aFormGroup = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      empresa: ['', Validators.required],
      urlSitio: ['', Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/)],
      noEmpleados: ['', Validators.required],
      privacidadTerminos: [false, Validators.requiredTrue],
      recaptcha: ['']
    });

    this.showIniciarSesion = this.router.url === '/login' || this.router.url === '/' || this.router.url == '';
    localStorage.clear();
    sessionStorage.clear();
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      sesion: [false]
    }); 

    this.loginForm.get('usuario')?.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }
  ngOnDestroy(): void {
  }
  openLoginModal() {
    this.isLoginModalOpen = true;
    this.isResetModalOpen = false;
  }

  closeLoginModal() {
    this.loginForm.reset();

    this.errorMessage = '';
    this.showErrors = false;

    this.isLoginModalOpen = false;
  }

  soloNumeros(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  
    this.aFormGroup.get('telefono')?.setValue(input.value, { emitEvent: false });
  }



  guardarInformacion(event: any): void {
      if (this.aFormGroup.invalid) {
        this.markAllAsTouched(this.aFormGroup);
        this.mostrarToastError("Es necesario llenar los campos indicados.");
        return;
      }

      this.informacionRegistro = {
        nombre: this.aFormGroup.get('nombre')?.value,
        apellido: this.aFormGroup.get('apellido')?.value,
        correo: this.aFormGroup.get('correo')?.value,
        telefono: this.aFormGroup.get('telefono')?.value,
        empresa: this.aFormGroup.get('empresa')?.value,
        urlSitio: this.aFormGroup.get('urlSitio')?.value,
        noEmpleados: this.aFormGroup.get('noEmpleados')?.value,
        privacidadTerminos: this.aFormGroup.get('privacidadTerminos')?.value,
        recaptcha: this.aFormGroup.get('recaptcha')?.value
      };
      this.authService.postSolicitudRegistro(this.informacionRegistro).subscribe({
                next: (result: baseOut) => {
                  if(result.result == true) {
                  /*  this.messageService.add({
                      severity: 'success',
                      summary: 'La operación se realizó con éxito.',
                      detail: result.errorMessage,
                    });*/  
                    localStorage.setItem('correo', this.aFormGroup.get('correo')?.value);
                    this.closeLoginModal();
                    this.router.navigate(['/two-factor']);
                    this.aFormGroup.reset();
                  }
                  else {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Se ha producido un error.',
                      detail: result.errorMessage,
                    });
                  }
                  
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

  get usuario() { return this.resetForm.get('usuario'); }
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

