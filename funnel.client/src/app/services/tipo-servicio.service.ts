import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestTipoServicio } from '../interfaces/tipoServicio';

@Injectable({
  providedIn: 'root'
})
export class TipoServicioService {

   baseUrl:string = environment.baseURL;
  
    constructor(private readonly http: HttpClient) { }
    getTipoServicios(idEmpresa: number): Observable<any> {
      return this.http.get(`${this.baseUrl}api/Servicios/ConsultarServicios/` + idEmpresa.toString());
    }

    postGuardarServicio(request: RequestTipoServicio): Observable<any> {
      return this.http.post(`${this.baseUrl}api/Servicios/GuardarServicio`, request);
    }

    descargarReporteServicios(data: any, idEmpresa: number): Observable<Blob> {
      return this.http.post(`${this.baseUrl}api/Servicios/DescargarReporteServicios`, data,
        { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
    }

}
