import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import{ Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { RequestPContacto } from '../interfaces/contactos';
import { baseOut } from '../interfaces/utils/utils/baseOut';
@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private catalogosUpdated = new Subject<void>();
  catalogosUpdated$ = this.catalogosUpdated.asObservable();

  notifyCatalogosUpdated() {
    this.catalogosUpdated.next();
  }

  baseUrl:string = environment.baseURL;

  constructor(private http: HttpClient) { }

  cargarCatalogos(idEmpresa:number) {
    this.cargarProspectos(idEmpresa);
    this.cargarServicios(idEmpresa);
    this.cargarEtapas(idEmpresa);
    this.cargarEjecutivos(idEmpresa);
    this.cargarContactos(idEmpresa);
    this.cargarEntregas(idEmpresa);
    this.cargarEstatusOportunidad(idEmpresa);
  }
  cargarProspectos(idEmpresa: number) {
    this.http.get(`${this.baseUrl}api/Oportunidades/ComboProspectos`, {
      params: { idEmpresa: idEmpresa.toString() }
    }).subscribe({
      next: (result) => {
        sessionStorage.setItem('CatalogoProspectos', window.btoa(JSON.stringify(result)));
        this.notifyCatalogosUpdated(); 
      },
      error: (error) => {
        sessionStorage.setItem('CatalogoProspectos', window.btoa(JSON.stringify([])));
        this.notifyCatalogosUpdated(); 
      }
    });
  }

  cargarServicios(idEmpresa:number) {
    this.http.get(`${this.baseUrl}api/Oportunidades/ComboServicios`, {
        params: { idEmpresa: idEmpresa.toString() }
      }).subscribe({
      next: (result) => {
        sessionStorage.setItem('CatalogoServicios', window.btoa(JSON.stringify(result)))
        this.notifyCatalogosUpdated();
      },
      error: (error) => {
        sessionStorage.setItem('CatalogoServicios', window.btoa(JSON.stringify([])))
        this.notifyCatalogosUpdated();
      }
    });
  }

  cargarEtapas(idEmpresa:number) {
    this.http.get(`${this.baseUrl}api/Oportunidades/ComboEtapas`, {
        params: { idEmpresa: idEmpresa.toString() }
      }).subscribe({
      next: (result) => {
        sessionStorage.setItem('CatalogoEtapas', window.btoa(JSON.stringify(result)))
        this.notifyCatalogosUpdated();
      },
      error: (error) => {
      sessionStorage.setItem('CatalogoEtapas', window.btoa(JSON.stringify([])))
        this.notifyCatalogosUpdated();
      }
    });
  }

  cargarEjecutivos(idEmpresa:number) {
    this.http.get(`${this.baseUrl}api/Oportunidades/ComboEjecutivos`, {
        params: { idEmpresa: idEmpresa.toString() }
      }).subscribe({
      next: (result) => {
        sessionStorage.setItem('CatalogoEjecutivos', window.btoa(JSON.stringify(result)))
        this.notifyCatalogosUpdated();
      },
      error: (error) => {
         sessionStorage.setItem('CatalogoEjecutivos', window.btoa(JSON.stringify([])))
        this.notifyCatalogosUpdated();
      }
    });
  }

  cargarContactos(idEmpresa:number) {
    this.http.get(`${this.baseUrl}api/Oportunidades/ComboContactos`, {
        params: { idEmpresa: idEmpresa.toString(), idProspecto: '0' }
      }).subscribe({
      next: (result) => {
        sessionStorage.setItem('CatalogoContactos', window.btoa(JSON.stringify(result)))
        this.notifyCatalogosUpdated();
      },
      error: (error) =>  {
        sessionStorage.setItem('CatalogoContactos', window.btoa(JSON.stringify([])))
        this.notifyCatalogosUpdated();
      }
    });
  }

  cargarEntregas(idEmpresa:number) {
    this.http.get(`${this.baseUrl}api/Oportunidades/ComboEntregas`, {
        params: { idEmpresa: idEmpresa.toString() }
      }).subscribe({
      next: (result) => {
        sessionStorage.setItem('CatalogoEntregas', window.btoa(JSON.stringify(result)))
        this.notifyCatalogosUpdated();
      },
      error: (error) =>  {
        sessionStorage.setItem('CatalogoEntregas', window.btoa(JSON.stringify([])))
        this.notifyCatalogosUpdated();
      }
    });
  }
  cargarEstatusOportunidad(idEmpresa: number) {
    this.http.get(`${this.baseUrl}api/Oportunidades/ComboTipoOportunidad`, {
      params: { idEmpresa: idEmpresa.toString() }
    }).subscribe({
      next: (result) => {
        sessionStorage.setItem('CatalogoEstatusOportunidad', window.btoa(JSON.stringify(result)))
        this.notifyCatalogosUpdated();
      },
      error: (error) =>  {
        sessionStorage.setItem('CatalogoEstatusOportunidad', window.btoa(JSON.stringify([])))
        this.notifyCatalogosUpdated();
      }
    });
  }

  obtenerProspectos(): any[] {
    const prospectos= sessionStorage.getItem('CatalogoProspectos');
    if (prospectos) {
      try {
        return JSON.parse(window.atob(prospectos));
      } catch (error) {
        return [];
      }
    }
    return [];
  }
  obtenerServicios(): any[] {
    const servicios = sessionStorage.getItem('CatalogoServicios');
    if (servicios) {
      try {
        return JSON.parse(window.atob(servicios));
      } catch (error) {
        return [];
      }
    }
    return [];
  }
  
  obtenerEtapas(): any[] {
    const etapas = sessionStorage.getItem('CatalogoEtapas');
    if (etapas) {
      try {
        return JSON.parse(window.atob(etapas));
      } catch (error) {
        return [];
      }
    }
    return [];
  }
  
  obtenerEjecutivos(): any[] {
    const ejecutivos = sessionStorage.getItem('CatalogoEjecutivos');
    if (ejecutivos) {
      try {
        return JSON.parse(window.atob(ejecutivos));
      } catch (error) {
        return [];
      }
    }
    return [];
  }
  
  obtenerContactos(idProspecto: number): any[] {
    const contactos = sessionStorage.getItem('CatalogoContactos');
    if (contactos) {
      try {
        const contactosArray = JSON.parse(window.atob(contactos));
        // Filtrar contactos por idProspecto
        let _contactos = contactosArray.filter((contacto: any) => contacto.idProspecto == idProspecto);
        // console.log(contactosArray);
        // console.log(_contactos);
        return _contactos; 
      } catch (error) {
        // console.error('Error al decodificar los contactos:', error);
        return [];
      }
    }
    return [];
  }
  
  obtenerEntregas(): any[] {
    const entregas = sessionStorage.getItem('CatalogoEntregas');
    if (entregas) {
      try {
        return JSON.parse(window.atob(entregas));
      } catch (error) {
        return [];
      }
    }
    return [];
  }
  obtenerEstatusOportunidad(): any[] {
    const estatus = sessionStorage.getItem('CatalogoEstatusOportunidad');
    if (estatus) {
      try {
        return JSON.parse(window.atob(estatus));
      } catch (error) {
        return [];
      }
    }
    return [];
  }
}
