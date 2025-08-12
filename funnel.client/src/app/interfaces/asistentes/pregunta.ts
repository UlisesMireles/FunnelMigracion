export interface Pregunta {
  id_bot: number,
  pregunta: string,
  respuesta: string,
  esPreguntaFrecuente: boolean
}
export interface Faq {
  pregunta: string;
  respuesta: string;
  categoria: string;
}

export interface Categoria {
  nombre: string;
  faqs: Faq[];
}

export interface PaginaFaqs {
  categorias: Categoria[];
  totalFaqs: number;
}