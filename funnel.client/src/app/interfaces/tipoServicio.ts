export interface TipoServicio {
    idTipoProyecto?: number;
    descripcion: string;
    abreviatura: string;
    estatus: number;
    desEstatus: string; 
    fechaModificacion?: string;
    idEmpresa: number;
}

export interface RequestTipoServicio {
    bandera: string;
    idTipoProyecto?: number;
    descripcion: string;
    abreviatura: string;
    estatus: number;
    idEmpresa: number;
}