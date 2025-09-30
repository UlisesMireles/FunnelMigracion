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
  registroContactos: boolean = false;
  nuevoRegistro: boolean = false;
  showSessionWarning = false;
  countdownMinutes = 2;
  countdownSeconds = 0;
  private countdownInterval: any;
  constructor(private http: HttpClient, private router: Router, private readonly loginService: LoginService) { }

ngOnInit() {
  this.router.events.subscribe(() => {
    const baseUrl = this.router.url.split('?')[0];
    
    if (baseUrl === '/' || baseUrl === '/recuperar-contrasena' || baseUrl === '/login' ||   baseUrl === '/two-factor' || baseUrl === '/politica-privacidad' || 
        baseUrl === '/terminos-condiciones' || baseUrl === '/registro-contactos '|| baseUrl === '/nuevo-registro') {
      this.login = true;
    }
    else {
      this.login = false;
    }
    
    this.dobleAutenticacion = baseUrl === '/two-factor';
    this.politicaPrivacidad = baseUrl === '/politica-privacidad';
    this.terminosCondiciones = baseUrl === '/terminos-condiciones';
    this.registroContactos = baseUrl === '/registro-contactos';
    this.nuevoRegistro = baseUrl === '/nuevo-registro';
  });
  
  this.loginService.sessionWarning$.subscribe(() => {
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
  close() {
    this.showSessionWarning = false;
  }
}
