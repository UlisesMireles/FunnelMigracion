import { BaseOutDto } from "../../app/clases/baseOut.class";
export interface CategoriasDto extends BaseOutDto {
    idCategoria: number;
    descripcion: string;
    mensajePrincipal: string;
    totalPreguntas: number;
    idBot?: number;
    nombreBot?: string;
    limitePreguntas: number;
}

export interface ListaCategoriasDto extends BaseOutDto {
    categorias: CategoriasDto[];
}

export interface EliminaCategoriaDto extends BaseOutDto{
    idCategoria: number;
}

export interface InsertaModificaCategoriaDto extends BaseOutDto{
    idCategoria: number;
    descripcion: string;
    mensajePrincipal: string;
    limitePreguntas: number;
    idBot: number;
}