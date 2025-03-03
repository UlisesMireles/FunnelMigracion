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
  getProspectos(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/Prospectos/ConsultarProspectos');
  }
  getProspectos_cmb(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/Prospectos/ComboProspectos');
  }
  postINSUPProspecto(data: RequestProspecto): Observable <baseOut>{
    return this.http.post<baseOut>(this.baseUrl+'api/Prospectos/GuardarProspecto', data);
  }
}
