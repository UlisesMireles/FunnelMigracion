import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RequestOportunidadPerdida } from '../interfaces/oportunidades-perdidas';
import { baseOut } from '../interfaces/utils/utils/baseOut';


@Injectable({
    providedIn: 'root'
  })

export class OportunidadesPerdidasService {

    baseUrl:string = environment.baseURL
    constructor(private http: HttpClient) { }
    getOportunidadesPerdidas(idEmpresa: number, idUsuario: number, idEstatus: number): Observable<any> {
        return this.http.get(`${this.baseUrl}api/Oportunidades/ConsultarOportunidadesPerdidas`, {
          params: { idEmpresa: idEmpresa.toString(), idUsuario: idUsuario.toString(), idEstatus: idEstatus.toString() }
        });
      }

}