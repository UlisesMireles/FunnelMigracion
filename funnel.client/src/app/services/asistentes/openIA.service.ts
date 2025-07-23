import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConsultaAsistente, ConsultaAsistenteDto } from '../../interfaces/asistentes/consultaAsistente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenIaService {
  public urlBotsFunnel = environment.baseUrlBotsFunnel;
  private urlPython = environment.baseUrlPython;
  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) {

  }

  obtenOpenIaConsultaAsistente(data : ConsultaAsistenteDto): Observable<ConsultaAsistenteDto>{
    return this.http.post<ConsultaAsistenteDto>(this.urlBotsFunnel + '/api/WebApiBotFunnel/OpenIA',data);
  }

  getOpenIaConsultaAsistente(data : ConsultaAsistente): Observable<ConsultaAsistente>{
    return this.http.post<ConsultaAsistente>(this.urlBotsFunnel + '/api/WebApiBotWP/OpenIAWP',data);
  }

  asistentePython(data : ConsultaAsistente): Observable<ConsultaAsistente>{
    return this.http.post<ConsultaAsistente>(this.urlPython,data);
  }

  obtenerPreguntas() {
    return this.http.get(this.urlBotsFunnel + '/api/WebApiBotWP/ObtenerPreguntasWP');
  }

  AsistenteHistorico(data : ConsultaAsistenteDto): Observable<ConsultaAsistenteDto>{
    return this.http.post<ConsultaAsistenteDto>(this.baseUrl + 'api/AsistenteHistorico/OpenIA',data);
  }

  asistenteProspeccion(data: ConsultaAsistenteDto): Observable<ConsultaAsistenteDto> {
    return this.http.post<ConsultaAsistenteDto>(this.baseUrl + 'api/AsistenteProspeccion/OpenIA',data);
  }
  
  limpiarCacheBot(userId: number, idBot: number): Observable<any> {
    return this.http.post(this.baseUrl + 'api/AsistenteProspeccion/LimpiarCacheBot', { userId, idBot });
  }
}
