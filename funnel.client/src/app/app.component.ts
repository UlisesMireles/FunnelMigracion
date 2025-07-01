import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  login: boolean = false;
  dobleAutenticacion: boolean = false;
  politicaPrivacidad: boolean = false;
  terminosCondiciones: boolean = false;
  showSessionWarning = false;
  countdownMinutes = 2;
  countdownSeconds = 0;
  private countdownInterval: any;
  constructor(private http: HttpClient, private router: Router, private readonly loginService: LoginService) { }

  ngOnInit() {

    this.router.events.subscribe(() => {
      if (this.router.url === '/' || this.router.url === '/recuperar-contrasena' || this.router.url === '/login' || this.router.url === '/two-factor' || this.router.url === '/politica-privacidad' || this.router.url === '/terminos-condiciones') {
        this.login = true;
      }
      else {
        this.login = false;
      }
      this.dobleAutenticacion = this.router.url === '/two-factor';
      this.politicaPrivacidad = this.router.url === '/politica-privacidad';
      this.terminosCondiciones = this.router.url === '/terminos-condiciones';

    });
    this.loginService.sessionWarning$.subscribe(() => {
      // Aquí abre tu modal, por ejemplo usando un servicio de PrimeNG, Angular Material, etc.
      this.showSessionWarning = true;
      this.startCountdown();
    });
  }
  startCountdown() {
    this.countdownMinutes = 2;
    this.countdownSeconds = 0;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.countdownInterval = setInterval(() => {
      if (this.countdownSeconds === 0) {
        if (this.countdownMinutes === 0) {
          clearInterval(this.countdownInterval);
          this.onSessionCancel();
          return;
        }
        this.countdownMinutes--;
        this.countdownSeconds = 59;
      } else {
        this.countdownSeconds--;
      }
    }, 1000);
  }

  onSessionContinue() {
    this.showSessionWarning = false;
    clearInterval(this.countdownInterval);
    this.loginService.resetTimer();
  }

  onSessionCancel() {
    this.showSessionWarning = false;
    clearInterval(this.countdownInterval);
    this.loginService.logout('Sesión cancelada por el usuario');
  }
  title = 'Funnel';
}
