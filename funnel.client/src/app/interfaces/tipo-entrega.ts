export interface TipoEntrega {
    idTipoEntrega?: number;
    descripcion: string;
    abreviatura: string;
    estatus: number;
    desEstatus: string; 
    fechaModificacion?: string;
    idEmpresa: number;
}

export interface RequestTipoEntrega {
    bandera: string;
    idTipoEntrega?: number;
    descripcion: string;
    abreviatura: string;
    estatus: number;
    idEmpresa: number;
}