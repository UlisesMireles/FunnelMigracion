import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';
import { baseOut } from '../interfaces/utils/utils/baseOut';

@Injectable({
  providedIn: 'root'
})
export class CamposAdicionalesService {

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }

  postCamposAdicionales(data: any): Observable <baseOut> {
    return this.http.post<baseOut>(this.baseUrl+'api/InputsAdicionales/GuardarInputsAdicionales', data);
  }
}
