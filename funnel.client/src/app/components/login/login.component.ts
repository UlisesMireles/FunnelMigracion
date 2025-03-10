import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  aFormGroup!: FormGroup;
  siteKey: string = '6LdlBicqAAAAABMCqyAjZOTSKrbdshNyKxwRiGL9';
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
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: LoginService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
    this.showIniciarSesion = this.router.url === '/login' || this.router.url === '/' || this.router.url == '';
    localStorage.clear();
    sessionStorage.clear();
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      sesion: [false]
    }); 
  }
  openLoginModal() {
    this.isLoginModalOpen = true;
    this.isResetModalOpen = false;
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
  }


  openResetModal() {
    this.isResetModalOpen = true;
    this.isLoginModalOpen = false;
  }

  closeResetModal() {
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
          if (environment.production) {
            this.closeLoginModal();
            this.router.navigate(['/two-factor']);
          } else {
            this.closeLoginModal();
            this.router.navigate(['/oportunidades']);
          }
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
    const user = this.resetForm.get('usuario')?.value;
    this.authService.recuperarContrasena(user).subscribe({
      next: (data: any) => {
        this.showErrors = true;
        this.resetErrorMessage = this.sanitizer.bypassSecurityTrustHtml(data.errorMessage);

      },
      error: (err: Error) => {
        this.showErrors = true;
        this.resetErrorMessage = "Ocurrio un error, intentalo más tarde.";
        console.log(err);
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
