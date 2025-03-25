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
    return this.http.get(`${this.baseUrl}api/Permisos`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }
}
