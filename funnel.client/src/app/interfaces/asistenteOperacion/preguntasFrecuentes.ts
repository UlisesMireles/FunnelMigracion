import { BaseOutDto } from "../../app/clases/baseOut.class";
import { PreguntasFrecuentesClassDto } from "../../app/clases/PreguntasFrecuentes.class";
import { AsitenteCategoriasDto } from "./asistente";
import { BaseOut } from "./baseOut";

/* export interface PreguntasFrecuentesDto extends BaseOutDto{
    id: number;
    idBot: number;
    asistente: string;
    pregunta: string;
    respuesta: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    activo: boolean;
    categoria: string;
    estatus: boolean;
} */

export interface ListaPreguntasFrecuentesDto extends BaseOutDto {
    preguntasFrecuentes: PreguntasFrecuentesClassDto[];
}

export interface InsertaPreguntaFrecuenteDto extends BaseOutDto {
    id: number;
    idBot: number;
    pregunta: string;
    respuesta: string;
    idCategoria: string;
    limitePreguntas: number;
}

export interface ModificaPreguntaFrecuenteDto extends BaseOutDto {
    id: number;
    idBot: number;
    pregunta: string;
    respuesta: string;
    idCategoria: number;
    limitePreguntas: number;
}

export interface EliminaPreguntaFrecuenteDto extends BaseOutDto {
    id: number;
}

export interface GeneraConsultaDto extends BaseOut {
    idBot: number;
    pregunta: string;
    fechaPregunta: Date;
    consulta: string;
    fechaRespuesta: Date;
    tokensEntrada: number;
    tokensSalida: number;
}

export interface PreguntasFrecuentesCategoriaDto extends BaseOutDto {
    id: number;
    idBot: number;
    asistente: string;
    idCategoeria: number;
    descripcion: string;
    mensajePrincipal: string;
    pregunta: string;
    respuesta: string;
}

export interface ListaPreguntasFrecuentesCategoriaDto extends BaseOutDto {
    asistentes: AsitenteCategoriasDto[];
}

export interface ListaPreguntasFrecuentesCategoria extends BaseOutDto {
    Lista: PreguntasFrecuentesCategoriaDto[];
}