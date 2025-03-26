import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';

import { RequestPContacto } from '../interfaces/contactos';
import { baseOut } from '../interfaces/utils/utils/baseOut';
@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }
  getPermisos(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Permisos/ConsultarPermisos`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  getRoles(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Permisos/ComboRoles`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  postPermisos(data: any): Observable <baseOut> {
    return this.http.post<baseOut>(this.baseUrl+'api/Permisos/GuardarPermisos', data);
  }

  getPermisosPorRol(idRol: number, idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Permisos/ConsultarPermisosPorRol`, {
      params: { idRol: idRol.toString(), idEmpresa: idEmpresa.toString() }
    });
  }
}
