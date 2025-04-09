import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../../services/login.service';

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
  showPassword = false;
  public backgroundImg: SafeStyle = "";
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: LoginService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(' + this.baseUrl + '/assets/img/PMAGRISES.png' + ')');

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

}
