import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GraficasDto, RequestGraficasDto, AgenteDto } from '../interfaces/graficas';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  baseUrl: string = environment.baseURL;

  constructor(private readonly http: HttpClient) { }

  obtenerGraficaData(data: RequestGraficasDto): Observable<GraficasDto[]> {
    return this.http.post<GraficasDto[]>(`${this.baseUrl}api/Graficas/ObtenerGraficaOportunidades`, data);
  }
  obtenerGraficaAgentesData(data: RequestGraficasDto): Observable<GraficasDto[]> {
    return this.http.post<GraficasDto[]>(`${this.baseUrl}api/Graficas/ObtenerGraficaAgentes`, data);
  }
  obtenerAgentesData(data: RequestGraficasDto): Observable<AgenteDto[]> {
    return this.http.post<AgenteDto[]>(`${this.baseUrl}api/Graficas/ObtenerAgentes`, data);
  }
}
