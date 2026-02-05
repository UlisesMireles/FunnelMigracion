import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {Pregunta} from "../../interfaces/asistentes/pregunta";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  
export class AsistenteService {
   baseUrl:string = environment.baseURL;
  

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
    return this.baseUrl;
  }

  /**
   * Obtiene el mensaje de bienvenida personalizado para Bruno
   * @param nombreUsuario - Nombre del usuario para personalizar el saludo
   * @returns HTML string con el mensaje de bienvenida formateado
   */
  getMensajeBienvenidaBruno(nombreUsuario: string): string {
    return `
      <div style="line-height: 1.6; font-family: Arial, sans-serif;">
        <div style="margin-bottom: 15px;">
          <span style="font-size: 18px;">👋 ¡Hola <strong>${nombreUsuario}</strong>!</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          ✨ Soy <strong style="color: #2563eb;">Bruno</strong>, tu asistente comercial especializado en convertir contactos en oportunidades reales.
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #059669;">🎯 Estoy aquí para ayudarte con:</strong>
        </div>
        
        <ul style="margin: 10px 0; padding-left: 20px; list-style-type: none;">
          <li style="margin-bottom: 8px;">
            <span style="color: #dc2626;">📧</span> <strong>Generar correos estratégicos</strong> personalizados para tus prospectos
          </li>
          <li style="margin-bottom: 8px;">
            <span style="color: #7c3aed;">🔍</span> <strong>Identificar oportunidades con IA</strong> analizando patrones de comportamiento
          </li>
          <li style="margin-bottom: 8px;">
            <span style="color: #ea580c;">💡</span> <strong>Proponer soluciones por sector</strong> adaptadas a cada industria
          </li>
          <li style="margin-bottom: 8px;">
            <span style="color: #059669;">🤝</span> <strong>Optimizar tus ventas consultivas</strong> con estrategias personalizadas
          </li>
        </ul>
        
        <div style="margin-top: 15px; padding: 10px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px;">
          💬 Puedes consultar <strong>preguntas frecuentes</strong> en el icono <i class="bi bi-question-circle h4"></i> de la parte superior o compárteme un <strong>sector específico</strong> para comenzar una conversación estratégica.
        </div>
      </div>
    `;
  }

  /**
   * Obtiene la configuración del mensaje inicial del chat
   * @param nombreUsuario - Nombre del usuario
   * @returns Objeto con la configuración del primer mensaje del chat
   */
  getConfiguracionMensajeInicial(nombreUsuario: string) {
    return {
      rol: "asistente",
      mensaje: this.getMensajeBienvenidaBruno(nombreUsuario),
      mostrarBotonDataset: true,
      mostrarBotonCopiar: false
    };
  }
}
