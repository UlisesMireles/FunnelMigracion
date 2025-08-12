import { PreguntaProcesada } from "./encuesta";

export interface ChatHistorial{
    rol: string;
    mensaje: string;
    mostrarBotonDataset?: boolean;
    esPreguntaFrecuente?: boolean;
    esEncuesta?: boolean;
    preguntaEncuesta?: PreguntaProcesada;
    indicePregunta?: number;
}