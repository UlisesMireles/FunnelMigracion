import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Empresa } from '../interfaces/empresa';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }
  postEmpresa(request: Empresa): Observable<any> {
        return this.http.post(`${this.baseUrl}api/Empresa/GuardarEmpresa`, request);
      }

  guardarRegistroTemporal(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}api/Empresa/GuardarRegistroTemporal`, request);
  }
  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.baseUrl}api/Empresa/ConsultarEmpresas`);
  }
}
