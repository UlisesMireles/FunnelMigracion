import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ListaAsistentes } from '../../interfaces/asistentes/asistente';

@Injectable({
    providedIn: 'root'
})
export class AsistentesAdministradorService {
    private urlBotsFunnel = environment.baseUrlBotsFunnel;

    constructor(private http: HttpClient) { }

    obtenerAsistentesConDocumento(): Observable<ListaAsistentes> {
        return this.http.get<ListaAsistentes>(this.urlBotsFunnel + '/api/Asistentes/AsistentesConDocumento');
    }

    obtenerAsistentes(): Observable<ListaAsistentes>{
        return this.http.get<ListaAsistentes>(this.urlBotsFunnel + '/api/Asistentes/Asistentes');
    }

    obtenerVersionAsistentes(): Observable<{ version: string }> {
        return this.http.get<{ version: string }>(this.urlBotsFunnel + '/api/WebApiBotFunnel/ObtenerVersionesAsistentes');
    }
}