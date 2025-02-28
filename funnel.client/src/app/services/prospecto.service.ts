import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';

import { requestProspecto } from '../interfaces/prospecto';
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
  getSProspectos_cmb(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/Prospectos/ComboProspectos');
  }
  postProspecto(data: requestProspecto): Observable <baseOut>{
    return this.http.post<baseOut>(this.baseUrl+'api/Prospectos/GuardarProspecto', data);
  }
}
