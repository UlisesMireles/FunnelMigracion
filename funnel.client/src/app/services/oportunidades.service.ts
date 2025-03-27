import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestActualizarFechaEstimadaCierre, RequestOportunidad } from '../interfaces/oportunidades';
import { baseOut } from '../interfaces/utils/utils/baseOut';

@Injectable({
  providedIn: 'root'
})
export class OportunidadesService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }
    getOportunidades(idEmpresa: number, idUsuario: number, idEstatus: number): Observable<any> {
      return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarOportunidadesEnProceso`, {
        params: { idEmpresa: idEmpresa.toString(), idUsuario: idUsuario.toString(), idEstatus: idEstatus.toString() }
      });
    }

    postOportunidad(data: RequestOportunidad): Observable <baseOut>{
      return this.http.post<baseOut>(this.baseUrl+'api/Oportunidades/GuardarOportunidad', data);
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

    postHistorial(data: any): Observable <baseOut>{
      return this.http.post<baseOut>(this.baseUrl+'api/Oportunidades/GuardarHistorico', data);
    }

    getDocumentos(idOportunidad: number): Observable<any> {
      return this.http.get(`${this.baseUrl}api/Archivos/ConsultarArchivo/`+ idOportunidad);
    }

    getOportunidadesPorMes(idEmpresa: number, idUsuario: number): Observable<any> {
      return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarOportunidadesPorMes`, {
        params: {idUsuario: idUsuario.toString(),idEmpresa: idEmpresa.toString() }
      });
    }

    postOportunidadPorMesTarjeta(data: RequestActualizarFechaEstimadaCierre): Observable <baseOut>{
      return this.http.post<baseOut>(this.baseUrl+'api/Oportunidades/ActualizarFechaEstimada', data);
    }

}
