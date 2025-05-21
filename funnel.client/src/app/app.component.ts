import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {

    this.router.events.subscribe(() => {
      if (this.router.url === '/' || this.router.url === '/recuperar-contrasena' || this.router.url === '/login' || this.router.url === '/two-factor' || this.router.url ==='/politica-privacidad' || this.router.url ==='/terminos-condiciones') {
        this.login = true;
      }
      else {
        this.login = false;
      }
      this.dobleAutenticacion = this.router.url === '/two-factor';
      this.politicaPrivacidad = this.router.url === '/politica-privacidad';
      this.terminosCondiciones = this.router.url === '/terminos-condiciones';
      
    });
  }

  title = 'Funnel';
}
