import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Oportunidad, RequestActualizarFechaEstimadaCierre, RequestActualizarEtapa, RequestOportunidad } from '../interfaces/oportunidades';
import { baseOut } from '../interfaces/utils/utils/baseOut';

@Injectable({
  providedIn: 'root'
})
export class OportunidadesService {

  baseUrl: string = environment.baseURL;

  constructor(private http: HttpClient) { }
  getOportunidades(idEmpresa: number, idUsuario: number, idEstatus: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarOportunidadesEnProceso`, {
      params: { idEmpresa: idEmpresa.toString(), idUsuario: idUsuario.toString(), idEstatus: idEstatus.toString() }
    });
  }

  postOportunidad(data: Oportunidad): Observable<baseOut> {
    return this.http.post<baseOut>(this.baseUrl + 'api/Oportunidades/GuardarOportunidad', data);
  }

  getProspectos(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ComboProspectos`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  getServicios(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ComboServicios`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  getEtapas(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ComboEtapas`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  getEntregas(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ComboEntregas`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  getEjecutivos(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ComboEjecutivos`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  getContactos(idEmpresa: number, idProspecto: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ComboContactos`, {
      params: { idEmpresa: idEmpresa.toString(), idProspecto: idProspecto.toString() }
    });
  }

  getEstatus(idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ComboTipoOportunidad`, {
      params: { idEmpresa: idEmpresa.toString() }
    });
  }

  getHistorial(idOportunidad: number, idEmpresa: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarHistoricoOportunidades`, {
      params: { idOportunidad: idOportunidad.toString(), idEmpresa: idEmpresa.toString() }
    });
  }

  postHistorial(data: any): Observable<baseOut> {
    return this.http.post<baseOut>(this.baseUrl + 'api/Oportunidades/GuardarHistorico', data);
  }

  getDocumentos(idOportunidad: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Archivos/ConsultarArchivo/` + idOportunidad);
  }

  getOportunidadesPorMes(idEmpresa: number, idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarOportunidadesPorMes`, {
      params: { idUsuario: idUsuario.toString(), idEmpresa: idEmpresa.toString() }
    });
  }

  postOportunidadPorMesTarjeta(data: RequestActualizarFechaEstimadaCierre): Observable<baseOut> {
    return this.http.post<baseOut>(this.baseUrl + 'api/Oportunidades/ActualizarFechaEstimada', data);
  }

  getOportunidadesPorEtapa(idEmpresa: number, idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarOportunidadesPorEtapa`, {
      params: { idUsuario: idUsuario.toString(), idEmpresa: idEmpresa.toString() }
    });
  }

  actualizarEtapa(data: RequestActualizarEtapa): Observable<baseOut> {
    return this.http.post<baseOut>(this.baseUrl + 'api/Oportunidades/ActualizarEtapa', data);
  }

  descargarReporteSeguimientoOportunidades(idOportunidad: number, idEmpresa: number, _empresa: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/DescargarReporteSeguimientoOportunidades`, {
      params: { idOportunidad: idOportunidad.toString(), idEmpresa: idEmpresa.toString(), empresa: _empresa }, responseType: 'blob'
    });
  }

  descargarReporteOportunidadesEnProceso(data: any, idEmpresa: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Oportunidades/DescargarReporteOportunidadesEnProceso`, data,
      { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
  }

  descargarReporteOportunidadesPorEtapa(data: any, idEmpresa: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Oportunidades/DescargarReporteOportunidadesPorEtapa`, data,
      { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
  }

  descargarReporteOportunidadesGanadas(data: any, idEmpresa: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Oportunidades/DescargarReporteOportunidadesGanadas`, data,
      { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
  }

  descargarReporteOportunidadesPerdidas(data: any, idEmpresa: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Oportunidades/DescargarReporteOportunidadesPerdidas`, data,
      { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
  }

  descargarReporteOportunidadesCanceladas(data: any, idEmpresa: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Oportunidades/DescargarReporteOportunidadesCanceladas`, data,
      { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
  }

  descargarReporteOportunidadesEliminadas(data: any, idEmpresa: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}api/Oportunidades/DescargarReporteOportunidadesEliminadas`, data,
      { params: { idEmpresa: idEmpresa.toString() }, responseType: 'blob' });
  }
  consultarEtiquetasOportunidades(idEmpresa: number, idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarEtiquetasOportunidades`, {
      params: { idEmpresa: idEmpresa.toString(), idUsuario: idUsuario}
    });
  }
  consultarEstancamiento(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarEstancamientoEstadisticaOportunidades`);
  }

  consultarEstancamientoPorOportunidad(idOportunidad: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarEstancamientoPorOportunidad`, {
      params: { idOportunidad: idOportunidad.toString() }
    });
  }
}
