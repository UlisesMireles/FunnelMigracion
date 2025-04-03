import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';
import { RequestOportunidad } from '../interfaces/oportunidades';
import { baseOut } from '../interfaces/utils/utils/baseOut';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  
  baseUrl: string = environment.baseURL;

  constructor(private http: HttpClient) { }
  getDocumentos(idOportunidad: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Archivos/ConsultarArchivo/${idOportunidad}`);
  }
  descargarDocumento(nombreArchivo: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}api/Archivos/descargaArchivo/${nombreArchivo}`, {
      responseType: 'blob'
    });}

    eliminarDocumento(idArchivo: number): Observable<any> {
      return this.http.post(`${this.baseUrl}api/Archivos/EliminarArchivo/${idArchivo}`, {});
    
  }
  guardarDocumento(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}api/Archivos/GuardarArchivos`, formData);
  }
}
