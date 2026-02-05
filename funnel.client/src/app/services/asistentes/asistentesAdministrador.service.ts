import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ListaAsistentes } from '../../interfaces/asistentes/asistente';

@Injectable({
    providedIn: 'root'
})
export class AsistentesAdministradorService {
     baseUrl:string = environment.baseURL;
     


    constructor(private http: HttpClient) { }

    obtenerAsistentes(): Observable<ListaAsistentes>{
        return this.http.get<ListaAsistentes>(this.baseUrl + 'api/AsistenteProspeccion/Asistentes');
    }

    obtenerVersionAsistentes(): Observable<{ version: string }> {
        return this.http.get<{ version: string }>(this.baseUrl + 'api/AsistenteProspeccion/ObtenerVersionesAsistentes');
    }
}