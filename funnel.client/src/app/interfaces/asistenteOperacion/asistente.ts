import { BaseOut } from "./baseOut";
import { CategoriaPreguntasDto } from "./categoriaPreguntas";

export interface Asistente {
  tipo: number,
  nombre: string
}

export interface AsistentesDto {
  idBot: number;
  nombreAsistente: string;
  documento: boolean;
  nombreDocumento: string;
  fechaModificacion: Date;
  realizadoPor: string;
  nombreTablaAsistente: string;
  mensajePrincipalAsistente: string;
  ultimoNombreDocumento: string;
  tamanoUltimoDocumento: number
  isDescargando: boolean;
  idAdministrador: number;
  rutaDocumento: string;
}
export interface ListaAsistentes extends BaseOut {
  asistentes: AsistentesDto[];
}

export interface ActualizarArchivoAsistente extends AsistentesDto {
  archivo: File;
}

export interface AsitenteCategoriasDto
{
  idBot: number;
  asistente: string;
  documento: boolean;
  preguntasPorCategoria: CategoriaPreguntasDto[];
}