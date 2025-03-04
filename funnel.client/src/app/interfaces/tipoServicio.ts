export interface TipoServicio {
    idTipoServicio: number;
    descripcion: string;
    abreviatura: string;
    estatus: number;
    desEstatusActivo?: string; 
    fechaModificacion: string;
    idEmpresa: number;
}

export interface RequestTipoServicio {
    bandera: string;
    idTipoServicio: number;
    descripcion: string;
    abreviatura: string;
    estatus: number;
    idEmpresa: number;
}