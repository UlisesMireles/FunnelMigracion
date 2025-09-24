import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';
import { Procesos } from '../interfaces/procesos';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class ProcesosService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient, private loginService: LoginService) { }
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

  getComboEtapas(idEmpresa: number, idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Procesos/ConsultarComboEtapas`, {
      params: { idUsuario: idUsuario.toString(), idEmpresa: idEmpresa.toString() }
    });
  }

  postGuardarEtapas(request: Procesos): Observable<any> {
      return this.http.post(`${this.baseUrl}api/Procesos/InsertarModificarProcesoEtapa`, request);
    }

     getPlantillasProcesos(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Procesos/ConsultarPlantillasProcesosEtapas`, { });
  }
  
  getCantidadProcesosPermitidos(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Procesos/CantidadProcesoPermitidosPorLicencia`, {
      params: { licencia: localStorage.getItem('licencia') ?? ""}
    });
  }
}
