import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from './services/globals';

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
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    Globals.usuario = localStorage.getItem('username') as string;
    Globals.idUsuario = parseInt(localStorage.getItem('currentUser') as string);
    Globals.tipoUsuario = localStorage.getItem('tipoUsuario') as string;

    this.router.events.subscribe(() => {
      if (this.router.url === '/' || this.router.url === '/recuperar-contrasena' || this.router.url === '/login' || this.router.url === '/two-factor') {
        this.login = true;
      } else {
        this.login = false;
      }
    });
  }

  title = 'Funnel';
}
