import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../../services/login.service';
import { environment } from '../../../../environments/environment';
import { DobleAutenticacion, LoginUser } from '../../../interfaces/usuario';

@Component({
  selector: 'app-doble-autenticacion',
  standalone: false,
  templateUrl: './doble-autenticacion.component.html',
  styleUrls: ['./doble-autenticacion.component.css']
})
export class DobleAutenticacionComponent {
  public backgroundImg: SafeStyle | undefined;
  baseUrl: string = environment.baseURLAssets;
  twoFactorForm: FormGroup = new FormGroup({});
  usuario: string = '';
  showErrors: boolean = false;
  errorLogin: string = '';
  codigo: number | null = null;
  disabled: boolean = true;
  timeLeft: number = 120;
  interval: any;
  timeExpired: boolean = false;
  datosUsuario: LoginUser = {} as LoginUser;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authenticationService: LoginService,
    private authService: LoginService,
  ) { }
  ngOnInit(): void {
    console.log("hola");
    this.twoFactorForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6)]],
      sesion: [false]
    });
    this.backgroundImg =
      'background-image: url(' +
      this.baseUrl +
      '/assets/img/PMAGRISES.png' +
      ')';
    this.usuario = localStorage.getItem('username') as string;
    this.codigo = null;
    this.disabled = true;
    this.datosUsuario = this.authService.desencriptaSesion();
    this.startTimer();
  }
  onCodigoChange(value: number): void {
    if (value && value.toString().length === 6) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  enviarCorreoTwoFactor() {
    this.authService.reenviarTwoFactor(this.datosUsuario.usuario, this.datosUsuario.password).subscribe({
      next: () => {
        this.startTimer();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'El código ha sido reenviado con éxito a tu correo electrónico.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Se ha producido un error en la generación del código: ' +
            err.errorMessage,
        });
      }
    });
  }
  

  startTimer() {
    this.timeLeft = 120;
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.timeExpired = true;
      }
    }, 1000);
  }
  EnviarCodigo() {
    if (this.twoFactorForm.invalid) {
      this.showErrors = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Debes incluir un codigo correcto: '
      });
      return;
    }
    let TwoFactor: DobleAutenticacion = { codigo: this.twoFactorForm.get('codigo')?.value, usuario: this.usuario };
    this.authenticationService.DobleAutenticacion(TwoFactor).subscribe({
      next: (data) => {
        if (data.tipoMensaje == 1) {
          this.router.navigate(['/oportunidades']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.errorMessage,
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Se ha producido un error en la validación del código: ' +
            error.errorMessage,
        });
      },
    });
  }
  cerrarModal() {
    this.router.navigate(['']);
  }
}
