import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CategoriasDto, EliminaCategoriaDto, InsertaModificaCategoriaDto, ListaCategoriasDto } from '../../interfaces/asistentes/categorias';
import { ListaPreguntasPorCategoriaDto } from '../../interfaces/asistentes/categoriaPreguntas';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private urlBotsFunnel = environment.baseUrlBotsFunnel;

  constructor(private http: HttpClient) {

  }

  obtenCategorias(): Observable<ListaCategoriasDto> {
    return this.http.get<ListaCategoriasDto>(this.urlBotsFunnel + '/api/Categorias/Categorias');
  }

  obtenPreguntasFrecuentesPorIdCategoriaAsistenteBienvenida(): Observable<ListaPreguntasPorCategoriaDto> {
    return this.http.get<ListaPreguntasPorCategoriaDto>(this.urlBotsFunnel + '/api/Categorias/PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida');
  }

  obtenCategoriaPorId(idCategoria: number): Observable<CategoriasDto> {
    return this.http.get<CategoriasDto>(this.urlBotsFunnel + '/api/Categorias/CategoriaPorId/' + idCategoria);
  }

  InsertaCategoria(inserta: InsertaModificaCategoriaDto): Observable<InsertaModificaCategoriaDto> {
    return this.http.post<InsertaModificaCategoriaDto>(this.urlBotsFunnel + '/api/Categorias/InsertaCategoria', inserta);
  }

  ModificaCategoria(modifica: InsertaModificaCategoriaDto): Observable<InsertaModificaCategoriaDto> {
    return this.http.post<InsertaModificaCategoriaDto>(this.urlBotsFunnel + '/api/Categorias/ModificaCategoria', modifica);
  }

  EliminaCategoria(elimina: EliminaCategoriaDto): Observable<EliminaCategoriaDto> {
    return this.http.post<EliminaCategoriaDto>(this.urlBotsFunnel + '/api/Categorias/EliminaCategoria', elimina);
  }

  obtenCategoriaPorBot(idBot: number): Observable<CategoriasDto> {
    return this.http.get<CategoriasDto>(this.urlBotsFunnel + '/api/Categorias/CategoriaPorBot/' + idBot);
  }
}