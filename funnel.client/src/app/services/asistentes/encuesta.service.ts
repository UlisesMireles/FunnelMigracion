import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EncuestaService {
    constructor(private http: HttpClient) { }
    baseUrl:string = environment.baseURL;

    getPreguntasEncuesta(): Observable<any> {
        return this.http.get(`${this.baseUrl}api/Encuesta/ConsultarPreguntasEncuesta`);
    }
}