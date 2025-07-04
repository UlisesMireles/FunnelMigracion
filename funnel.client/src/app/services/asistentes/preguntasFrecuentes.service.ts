import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EliminaPreguntaFrecuenteDto, InsertaPreguntaFrecuenteDto, ListaPreguntasFrecuentesDto, ModificaPreguntaFrecuenteDto, GeneraConsultaDto, ListaPreguntasFrecuentesCategoriaDto } from '../../interfaces/asistentes/preguntasFrecuentes';
import { PreguntasFrecuentesClassDto } from '../../app/clases/PreguntasFrecuentes.class';

@Injectable({
  providedIn: 'root'
})
export class PreguntasFrecuentesService {
  private urlBotsFunnel = environment.baseUrlBotsFunnel;
  constructor(private http: HttpClient) { }

  obtenPreguntasFrecuentes(): Observable<ListaPreguntasFrecuentesDto> {
    return this.http.get<ListaPreguntasFrecuentesDto>(this.urlBotsFunnel + '/api/PreguntasFrecuentes/PreguntasFrecuentes').pipe(map((obj: any) => {
      obj.preguntasFrecuentes.forEach((pf: any) => {
        pf.yaSePregunto = false
      });
      return obj
    }));
  }


  obtenPreguntasFrecuentesPorId(id: number): Observable<PreguntasFrecuentesClassDto> {
    return this.http.get<PreguntasFrecuentesClassDto>(this.urlBotsFunnel + '/api/PreguntasFrecuentes/PreguntasFrecuentesPorId/' + id);
  }

  insertaPreguntaFrecuente(inserta: InsertaPreguntaFrecuenteDto): Observable<InsertaPreguntaFrecuenteDto> {
    return this.http.post<InsertaPreguntaFrecuenteDto>(this.urlBotsFunnel + '/api/PreguntasFrecuentes/InsertaPreguntaFrecuente', inserta);
  }

  modificaPreguntaFrecuente(actualiza: ModificaPreguntaFrecuenteDto): Observable<ModificaPreguntaFrecuenteDto> {
    return this.http.post<ModificaPreguntaFrecuenteDto>(this.urlBotsFunnel + '/api/PreguntasFrecuentes/ModificaPreguntaFrecuente', actualiza);
  }

  eliminaPreguntaFrecuente(elimina: EliminaPreguntaFrecuenteDto): Observable<EliminaPreguntaFrecuenteDto> {
    return this.http.post<EliminaPreguntaFrecuenteDto>(this.urlBotsFunnel + '/api/PreguntasFrecuentes/EliminaPreguntaFrecuenteDto', elimina);
  }

  generaConsulta(genera: GeneraConsultaDto): Observable<GeneraConsultaDto> {
    return this.http.post<GeneraConsultaDto>(this.urlBotsFunnel + '/api/PreguntasFrecuentes/GeneraConsulta', genera);
  }

  obtenListaPreguntasFrecuentesCategoria(): Observable<ListaPreguntasFrecuentesCategoriaDto>{
    return this.http.get<ListaPreguntasFrecuentesCategoriaDto>(this.urlBotsFunnel + '/api/PreguntasFrecuentes/ListaPreguntasFrecuentesCategoria');
  }
}
