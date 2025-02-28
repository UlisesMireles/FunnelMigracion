import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoServicioService {

   baseUrl:string = environment.baseURL;
  
    constructor(private readonly http: HttpClient) { }
    getTipoServicios(idEmpresa: number): Observable<any> {
      return this.http.get(`${this.baseUrl}api/Servicios/ConsultarServicios/` + idEmpresa.toString());
    }
}
