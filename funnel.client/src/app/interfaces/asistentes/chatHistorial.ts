import { PreguntaProcesada } from "./encuesta";

export interface ChatHistorial{
    rol: string;
    mensaje: string;
    mostrarBotonDataset?: boolean;
    mostrarBotonCopiar?: boolean;
    esPreguntaFrecuente?: boolean;
    esEncuesta?: boolean;
    preguntaEncuesta?: PreguntaProcesada;
    indicePregunta?: number;
    tipoEncuesta?: string;     
    respuestaAbierta?: string;  
    respuestaComentarios?: string;
    respuestaEnviada?: boolean;
}