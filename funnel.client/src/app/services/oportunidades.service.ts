import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';

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


}