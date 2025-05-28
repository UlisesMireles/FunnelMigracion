import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestTipoEntrega } from '../interfaces/tipo-entrega';
@Injectable({
  providedIn: 'root'
})
export class TipoEntregaService {

   baseUrl:string = environment.baseURL;
  
    constructor(private readonly http: HttpClient) { }
    getTiposEntrega(idEmpresa: number): Observable<any> {
        return this.http.get(`${this.baseUrl}api/TiposEntrega/ConsultarTiposEntrega`, {
          params: { idEmpresa: idEmpresa.toString() }
        });
      }

    postGuardarTipoEntrega(request: RequestTipoEntrega): Observable<any> {
      return this.http.post(`${this.baseUrl}api/TiposEntrega/GuardarTipoEntrega`, request);
    }

    descargarReporteTiposEntregas(data: any, idEmpresa: number): Observable<Blob> {
      return this.http.post(`${this.baseUrl}api/TiposEntrega/DescargarReporteTiposEntregas`, data,
        { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
    }

}

