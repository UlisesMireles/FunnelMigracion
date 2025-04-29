import { BaseOutDto } from "./baseOut.class";

export class PreguntasFrecuentesClassDto extends BaseOutDto {
    id!: number;
    idBot!: number;
    asistente!: string;
    pregunta!: string;
    respuesta!: string;
    fechaCreacion!: Date;
    fechaModificacion!: Date;
    activo!: boolean;
    categoria!: string;
    estatus!: boolean;
    yaSePregunto: boolean;
    constructor() {
        super();
        this.yaSePregunto = false
    }
}