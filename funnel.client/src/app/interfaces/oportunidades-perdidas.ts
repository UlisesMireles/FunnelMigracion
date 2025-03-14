export interface OportunidadPerdida {
    idUsuario?: number;
    idEmpresa?: number;
    idEstatus?: number;
    idOportunidad?: number;
    prospecto?: string;
    nombreOportunidad?: string;
    monto?: number;
    fechaEstimadaCierre?: Date;
    diasFunnel?: number;
    ejecutivo?: string;
    fechainicio?: Date;
    fechacierre?: Date;
    ultimocomentario?: string;
}

export interface RequestOportunidadPerdida {
    
}
