import { BaseOut } from "./baseOut";
import { PreguntasPorCategoriaDto } from "./preguntasPorCategoria";

export interface CategoriaPreguntasDto{
    idCategoria: number;
    descripcion: string;
    mensajePrincipal: string;
    listaPreguntasPorCategoria: PreguntasPorCategoriaDto[];
}

export interface ListaPreguntasPorCategoriaDto extends BaseOut{
    preguntasPorCategoria: CategoriaPreguntasDto[];
}
