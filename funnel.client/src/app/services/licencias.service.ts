import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LicenciasService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getLicencias(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Licencias/ConsultarLicencias`);
  }
}
