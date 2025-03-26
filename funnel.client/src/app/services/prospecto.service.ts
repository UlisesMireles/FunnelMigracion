import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';

import { RequestProspecto } from '../interfaces/prospecto';
import { baseOut } from '../interfaces/utils/utils/baseOut';
@Injectable({
  providedIn: 'root'
})
export class ProspectoService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }
  getProspectos(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Prospectos/ConsultarProspectos`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }
  getSectores(idEmpresa: number): Observable<any>{
    return this.http.get(`${this.baseUrl}api/Prospectos/ComboSectores`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  postInsertProspecto(data: RequestProspecto): Observable <baseOut>{
    console.log(data);
    return this.http.post<baseOut>(this.baseUrl+'api/Prospectos/GuardarProspecto', data);
  }

  getTopVeinte(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Prospectos/ConsultarTopVeinte`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }
}
