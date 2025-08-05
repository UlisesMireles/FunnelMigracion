export interface Pregunta {
  id_bot: number,
  pregunta: string,
  respuesta: string,
  esPreguntaFrecuente: boolean
}
export interface Faq {
  pregunta: string;
  respuesta: string;
}