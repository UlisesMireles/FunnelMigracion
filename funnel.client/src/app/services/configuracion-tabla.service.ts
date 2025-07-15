import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ catchError, map, Observable, throwError } from 'rxjs';

import { RequestPContacto } from '../interfaces/contactos';
import { baseOut } from '../interfaces/utils/utils/baseOut';
import { ConfiguracionTabla, ConfiguracionTablaResponse } from '../interfaces/configuracion-tabla';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class ConfiguracionTablaService {

  baseUrl:string = environment.baseURL;

  constructor(private readonly http: HttpClient, private readonly loginService: LoginService) { }

  obtenerConfiguracionTabla(idTabla: number, idUsuario: number):Observable<any> {
    return this.http.get(`${this.baseUrl}api/ConfiguracionTablas/ObtenerConfiguracionTabla`, {
      params: { idTabla: idTabla.toString(), idUsuario: idUsuario.toString() }
    });
  }
  
  guardarConfiguracionTabla(data: ConfiguracionTablaResponse): Observable <baseOut>{
    return this.http.post<baseOut>(this.baseUrl+'api/ConfiguracionTablas/GuardarConfiguracionTabla', data);
  }
  obtenerColumnasAMostrar(idTabla: number): Observable<{ todas: any[], mostrar: any[] }> {
    const idUsuario = this.loginService.obtenerIdUsuario();
    return this.obtenerConfiguracionTabla(idTabla, idUsuario).pipe(
      map((configuraciones: any[]) => {
        const todas = configuraciones;
        const mostrar = todas.filter(col => col.isCheck);
        return { todas, mostrar };
      }),
      catchError(error => throwError(() => error))
    );
  }
}
