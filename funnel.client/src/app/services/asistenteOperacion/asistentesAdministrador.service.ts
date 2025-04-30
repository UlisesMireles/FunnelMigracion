import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ListaAsistentes } from '../../interfaces/asistenteOperacion/asistente';

@Injectable({
    providedIn: 'root'
})
export class AsistentesAdministradorService {
    private urlBotOperacion = environment.baseUrlBotOperacion;

    constructor(private http: HttpClient) { }

    obtenerAsistentesConDocumento(): Observable<ListaAsistentes> {
        return this.http.get<ListaAsistentes>(this.urlBotOperacion + '/api/Asistentes/AsistentesConDocumento');
    }

    obtenerAsistentes(): Observable<ListaAsistentes>{
        return this.http.get<ListaAsistentes>(this.urlBotOperacion + '/api/Asistentes/Asistentes');
    }

    obtenerVersionAsistentes(): Observable<{ version: string }> {
        return this.http.get<{ version: string }>(this.urlBotOperacion + '/api/WebApiBotFunnel/ObtenerVersionesAsistentes');
    }
}