import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProcesosService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }
  getProcesos(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Procesos/ConsultarProcesos`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  getOportunidadesPorEtapa(idProceso: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Procesos/ConsultarEtapasPorProceso`, {
      params: { idProceso: idProceso }
    });
  }

  descargarReporteProcesos(data: any, idEmpresa: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Procesos/DescargarReporteProcesos`, data,
      { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
  }
}
