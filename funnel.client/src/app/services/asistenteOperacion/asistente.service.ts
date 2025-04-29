import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {Pregunta} from "../../interfaces/asistenteOperacion/pregunta";
@Injectable({
    providedIn: 'root'
  })
  
export class AsistenteService {
  private baseUrlBotOperacion = 'https://sfs-funnel.com/adminchats-qa';
  public asistenteSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public asistenteObservable: Observable<number>;

  public preguntaSeleccionadaSubject: BehaviorSubject<Pregunta> = new BehaviorSubject<Pregunta>({ id_bot: 0, pregunta: "", esPreguntaFrecuente: false, respuesta: "" });
  public preguntaSeleccionadaObservable: Observable<Pregunta>;

  
  constructor() { 
    this.asistenteObservable = this.asistenteSubject.asObservable();
    this.preguntaSeleccionadaObservable = this.preguntaSeleccionadaSubject.asObservable();
  }
}
