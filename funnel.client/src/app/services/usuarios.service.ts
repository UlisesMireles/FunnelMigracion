import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestUsuario } from '../interfaces/usuarios';
import { baseOut } from '../interfaces/utils/utils/baseOut';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  baseUrl: string = environment.baseURL;

  constructor(private readonly http: HttpClient) { }
  getUsuarios(IdEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Usuarios/ConsultarUsuarios/${IdEmpresa}`);
  }
  getTiposUsuarios(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Usuarios/ComboTiposUsuarios`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  postGuardarUsuario(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}api/Usuarios/GuardarImagen`, formData);
  }

  validarInicialesExistente(iniciales: string, idEmpresa: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}api/Usuarios/validar-iniciales`, {
      params: {
        iniciales: iniciales,
        idEmpresa: idEmpresa.toString()
      }
    });
  }

  descargarReporteUsuarios(data: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Usuarios/DescargarReporteUsuarios`, data, { responseType: 'blob' });
  }

}