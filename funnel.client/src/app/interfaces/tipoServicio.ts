export interface TipoServicio {
    idTipoServicio?: number;
    descripcion: string;
    abreviatura: string;
    estatus: number;
    desEstatus: string; 
    fechaModificacion?: string;
    idEmpresa: number;
}

export interface RequestTipoServicio {
    bandera: string;
    idTipoServicio?: number;
    descripcion: string;
    abreviatura: string;
    estatus: number;
    idEmpresa: number;
}