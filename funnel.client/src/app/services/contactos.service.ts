import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';

import { RequestPContacto } from '../interfaces/contactos';
import { baseOut } from '../interfaces/utils/utils/baseOut';
import { InpoutAdicionalData } from '../interfaces/input-adicional-data';
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

  getInputsAdicionales(idEmpresa: number, tipoCatalogo: string, idReferencia:number): Observable<InpoutAdicionalData[]> {
    return this.http.get<InpoutAdicionalData[]>(`${this.baseUrl}api/InputsAdicionales/ConsultarDataInputsAdicionales`, {
      params: { idEmpresa: idEmpresa.toString(), tipoCatalogo: tipoCatalogo, idReferencia: idReferencia }
    });
  }
  
  postContacto(data: RequestPContacto): Observable <baseOut>{
    return this.http.post<baseOut>(this.baseUrl+'api/Contacto/GuardarContacto', data);
  }

  guardarInputsAdicionalesData(data: InpoutAdicionalData[]): Observable <baseOut>{
    return this.http.post<baseOut>(this.baseUrl+'api/InputsAdicionales/GuardarInputsAdicionalesData', data);
  }

  getProspectos(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Contacto/ComboProspectos`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  descargarReporteContactos(data: any, idEmpresa: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Contacto/DescargarReporteContactos`, data,
      { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
  }
}
