export interface PreguntaEncuesta {
  idPregunta: number;
  pregunta: string;
  tipoRespuesta: string;
  idRespuesta: number | null;
  respuesta: string;
}
export interface PreguntaProcesada {
  idPregunta: number;
  pregunta: string;
  tipoRespuesta: string;
  respuestas: string[];
}