import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ingresos } from '../interfaces/ingresos';
import { EjecucionProcesosReportes } from '../interfaces/ejecucion-procesos-reportes';
import { baseOut } from '../interfaces/utils/utils/baseOut';
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

    getCorreosUsuariosActivos(idEmpresa: number): Observable<any> {
        return this.http.get(`${this.baseUrl}api/Herramientas/ConsultarComboCorreosUsuariosActivos`, {
            params: { idEmpresa: idEmpresa.toString() }
        });
    }

    getCorreosUsuariosReporteAuto(idEmpresa: number, idReporte: number): Observable<any> {
        return this.http.get(`${this.baseUrl}api/Herramientas/ConsultarCorreosUsuariosReporteAuto`, {
            params: { idEmpresa: idEmpresa.toString(), idReporte : idReporte.toString() }
        });
    }

    getEjecucionProcesos(idEmpresa: number): Observable<EjecucionProcesosReportes[]> {
        return this.http.get<EjecucionProcesosReportes[]>(`${this.baseUrl}api/Herramientas/ConsultarEjecucionProcesosPorEmpresa`, {
            params: { idEmpresa: idEmpresa }
        });
    }

    descargarReporteIngresos(data: any): Observable<Blob> {
        return this.http.post(`${this.baseUrl}api/Herramientas/DescargarReporteIngresosUsuarios`, data, { responseType: 'blob' });
    }

    guardarEjecucionProcesos(data: EjecucionProcesosReportes): Observable<baseOut> {
        return this.http.post<baseOut>(this.baseUrl + 'api/Herramientas/GuardarDiasReportesEstatus', data);
    }

    enviarCorreosInmediatos(correos: string[],idEmpresa: number, idReporte: number): Observable<baseOut> {
        return this.http.post<baseOut>(this.baseUrl + 'api/Herramientas/EnvioCorreosReporteSeguimiento', correos, 
            {params: {idEmpresa: idEmpresa.toString(), idReporte: idReporte.toString()}});
    }
}