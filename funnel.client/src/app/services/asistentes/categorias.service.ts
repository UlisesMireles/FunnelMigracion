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
  baseUrl:string = environment.baseURL;


  constructor(private http: HttpClient) {

  }

  obtenCategorias(): Observable<ListaCategoriasDto> {
    return this.http.get<ListaCategoriasDto>(this.baseUrl + 'api/Categorias/Categorias');
  }

  obtenPreguntasFrecuentesPorIdCategoriaAsistenteBienvenida(): Observable<ListaPreguntasPorCategoriaDto> {
    return this.http.get<ListaPreguntasPorCategoriaDto>(this.baseUrl + 'api/Categorias/PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida');
  }

  obtenCategoriaPorId(idCategoria: number): Observable<CategoriasDto> {
    return this.http.get<CategoriasDto>(this.baseUrl + 'api/Categorias/CategoriaPorId/' + idCategoria);
  }

  obtenCategoriaPorBot(idBot: number): Observable<CategoriasDto> {
    return this.http.get<CategoriasDto>(this.baseUrl + 'api/Categorias/CategoriaPorBot/' + idBot);
  }
}