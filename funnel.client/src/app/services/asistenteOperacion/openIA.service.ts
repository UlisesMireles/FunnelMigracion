import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConsultaAsistente, ConsultaAsistenteDto } from '../../interfaces/asistenteOperacion/consultaAsistente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenIaService {
  public urlBotOperacion = environment.baseUrlBotOperacion;
  private urlPython = environment.baseUrlPython;

  constructor(private http: HttpClient) {

  }

  obtenOpenIaConsultaAsistente(data : ConsultaAsistenteDto): Observable<ConsultaAsistenteDto>{
    return this.http.post<ConsultaAsistenteDto>(this.urlBotOperacion + '/api/WebApiBotFunnel/OpenIA',data);
  }

  getOpenIaConsultaAsistente(data : ConsultaAsistente): Observable<ConsultaAsistente>{
    return this.http.post<ConsultaAsistente>(this.urlBotOperacion + '/api/WebApiBotWP/OpenIAWP',data);
  }

  asistentePython(data : ConsultaAsistente): Observable<ConsultaAsistente>{
    return this.http.post<ConsultaAsistente>(this.urlPython,data);
  }

  obtenerPreguntas() {
    return this.http.get(this.urlBotOperacion + '/api/WebApiBotWP/ObtenerPreguntasWP');
  }
}
