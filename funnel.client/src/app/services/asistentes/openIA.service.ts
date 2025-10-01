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
  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) {

  }

  obtenOpenIaConsultaAsistente(data : ConsultaAsistenteDto): Observable<ConsultaAsistenteDto>{
    return this.http.post<ConsultaAsistenteDto>(this.urlBotsFunnel + '/api/WebApiBotFunnel/OpenIA',data);
  }


  AsistenteHistorico(data : ConsultaAsistenteDto): Observable<ConsultaAsistenteDto>{
    return this.http.post<ConsultaAsistenteDto>(this.baseUrl + 'api/AsistenteHistorico/OpenIA',data);
  }

  asistenteProspeccion(data: ConsultaAsistenteDto): Observable<ConsultaAsistenteDto> {
    return this.http.post<ConsultaAsistenteDto>(this.baseUrl + 'api/AsistenteProspeccion/OpenIA',data);
  }
  obtenerFaq(idBot: number) {
    return this.http.get(this.baseUrl + 'api/AsistenteProspeccion/ObtenerFaq', { params: { idBot: idBot.toString() } });
  }
  limpiarCacheBot(userId: number, idBot: number): Observable<any> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('idBot', idBot.toString());
    return this.http.post(this.baseUrl + 'api/AsistenteProspeccion/LimpiarCacheBot', formData);
  }
  
  inicializarCacheIdsAsync(userId: number, idBot: number): Observable<any> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('idBot', idBot.toString());
    return this.http.post(this.baseUrl + 'api/AsistenteProspeccion/InicializarCacheIdsAsync', formData);
  }
  asistenteOperaciones(data: ConsultaAsistenteDto): Observable<ConsultaAsistenteDto> {
    return this.http.post<ConsultaAsistenteDto>(this.baseUrl + 'api/AsistenteOperacion/AsistenteOperacion',data);
  }
}
