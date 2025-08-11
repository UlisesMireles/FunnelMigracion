export interface PreguntaEncuesta {
  idPregunta: number;
  pregunta: string;
  tipoRespuesta: string;
  idRespuesta: number | null;
  respuesta: string;
  // otros campos si tienes
}
