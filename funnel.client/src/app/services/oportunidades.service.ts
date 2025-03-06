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
}