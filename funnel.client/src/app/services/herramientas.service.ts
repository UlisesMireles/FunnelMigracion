import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ingresos } from '../interfaces/ingresos';
@Injectable({
    providedIn: 'root'
})
export class HerramientasService {
    baseUrl: string = environment.baseURL;

    constructor(private http: HttpClient) { }

    getIngresos(idUsuario: number, idEmpresa: number): Observable<Ingresos[]> {
        return this.http.get<Ingresos[]>(`${this.baseUrl}api/Herramientas/ConsultarIngresos`, {
            params: { idUsuario: idUsuario, idEmpresa: idEmpresa.toString() }
        });
    }

    descargarReporteIngresos(data: any): Observable<Blob> {
        return this.http.post(`${this.baseUrl}api/Herramientas/DescargarReporteIngresosUsuarios`, data, { responseType: 'blob' });
    }
}