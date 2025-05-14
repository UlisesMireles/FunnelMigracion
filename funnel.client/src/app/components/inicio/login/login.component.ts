import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
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


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  aFormGroup!: FormGroup;
  siteKey: string = '6LdlBicqAAAAABMCqyAjZOTSKrbdshNyKxwRiGL9';
  //siteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; //Prueba
  baseUrl: string = environment.baseURLAssets;
  enableAsistenteBienvenida = false; // Inicia oculto
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
              private modalService: ModalService, private asistenteService: AsistenteService
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


  openResetModal() {
    this.isResetModalOpen = true;
    this.isLoginModalOpen = false;
  }

  closeResetModal() {
    this.resetUsername = ''; 

    this.resetErrorMessage = '';
    this.showErrors = false;

    this.isResetModalOpen = false;
  }

  login() {
    localStorage.clear();
    sessionStorage.clear();
    if (this.loginForm.invalid) {
      this.showErrors = true;
      this.errorMessage = "Por favor ingrese su usuario y contraseña"
      return;
    }
    this.showErrors = false;
    this.authService.login(this.loginForm.get('usuario')?.value, this.loginForm.get('password')?.value).subscribe({
      next: (data: any) => {
        if (data.result && data.idUsuario > 0 && data.id == 0) {
          // if (environment.production) {
          //   this.closeLoginModal();
          //   this.router.navigate(['/two-factor']);
          // } else {
            this.closeLoginModal();
            this.modalService.closeModal(); 
            this.router.navigate(['/oportunidades']);
          // }
        } else {
          this.showErrors = true;
          this.errorMessage = data.errorMessage ? data.errorMessage : "Usuario y/o Contraseña no validos."
        }
      },
      error: (err: Error) => {
        this.showErrors = true;
        this.errorMessage = "Ocurrio un error, intentalo más tarde."
      }
    });
  }

  resetPassword() {
    // Aquí puedes agregar la lógica para resetear la contraseña
    if (this.resetForm.invalid) {
      this.showErrors = true;
      this.resetErrorMessage = "Por favor ingrese su Usuario";
      return;
    }
    this.showErrors = false;
    const user = this.resetUsername;//this.resetForm.get('usuario')?.value;
    this.authService.recuperarContrasena(user).subscribe({
      next: (data: any) => {
        this.snackBar.open(data.errorMessage, 'X', { 
          horizontalPosition: 'end', 
          verticalPosition: 'top', 
          duration: 300000,
          panelClass: 'success-snackbar'
        });
        //this.snackbarService.showSnackbar(data.errorMessage, 'success');

      },
      error: (err: Error) => {
        this.showErrors = true;
        this.resetErrorMessage = "Ocurrio un error, intentalo más tarde.";
        console.log(err);
      }

    });
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleChat(): void {
    this.enableAsistenteBienvenida = !this.enableAsistenteBienvenida;
    // Si necesitas notificar al servicio
    this.asistenteService.asistenteSubject.next(this.enableAsistenteBienvenida ? 1 : -1);
  }

}
