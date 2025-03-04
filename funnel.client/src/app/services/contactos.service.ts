import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';

import { RequestPContacto } from '../interfaces/contactos';
import { baseOut } from '../interfaces/utils/utils/baseOut';
@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }
  getContactos(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Contacto/ConsultarContacto`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }
  
  postContacto(data: RequestPContacto): Observable <baseOut>{
    return this.http.post<baseOut>(this.baseUrl+'api/Contacto/GuardarContacto', data);
  }

  getProspectos(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Contacto/ComboProspectos`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }
}
