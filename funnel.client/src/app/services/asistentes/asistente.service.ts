import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {Pregunta} from "../../interfaces/asistentes/pregunta";
@Injectable({
    providedIn: 'root'
  })
  
export class AsistenteService {
  private baseUrlBotsFunnel = 'https://sfs-funnel.com/adminchats-qa';

  public asistenteSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public asistenteObservable: Observable<number>;
  public asistenteBienvenidaSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public asistenteBienvenidaObservable: Observable<number>;

  public preguntaSeleccionadaSubject: BehaviorSubject<Pregunta> = new BehaviorSubject<Pregunta>({ id_bot: 0, pregunta: "", esPreguntaFrecuente: false, respuesta: "" });
  public preguntaSeleccionadaObservable: Observable<Pregunta>;
  public preguntaSeleccionadaBienvenidaSubject: BehaviorSubject<Pregunta> = new BehaviorSubject<Pregunta>({ id_bot: 0, pregunta: "", esPreguntaFrecuente: false, respuesta: "" });
  public preguntaSeleccionadaBienvenidaObservable: Observable<Pregunta>;

  
  constructor() { 
    this.asistenteObservable = this.asistenteSubject.asObservable();
    this.asistenteBienvenidaObservable = this.asistenteBienvenidaSubject.asObservable();
    this.preguntaSeleccionadaObservable = this.preguntaSeleccionadaSubject.asObservable();
    this.preguntaSeleccionadaBienvenidaObservable = this.preguntaSeleccionadaBienvenidaSubject.asObservable();
  }
  getBaseUrl() {
    return this.baseUrlBotsFunnel;
  }
}
