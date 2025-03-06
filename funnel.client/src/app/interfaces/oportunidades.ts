export interface Oportunidad {
    idUsuario?: number;
    idEmpresa?: number;
    idEstatus?: number;
    idOportunidad?: number;
    idProspecto?: number;
    nombreSector?: string;
    ident?: string;
    nombre?: string;
    nombreOportunidad?: string;
    archivoDescripcion?: string;
    nombreAbreviado?: string;
    abreviatura?: string;
    descripcion?: string;
    entrega?: string;
    entregaDescripcion?: string;
    iniciales?: string;
    nombreContacto?: string;
    nombreEjecutivo?: string;
    monto?: number;
    probabilidad?: string;
    fechaModificacion?: number;
    comentario?: string;
    montoNormalizado?: number;
    fechaRegistro?: Date;
    fechaRegistroDate?: Date;
    abreviaturaEstatus?: string;
    descripcionEstatus?: string;
    decProbabilidad?: number;
    idEjecutivo?: number;
    fechaEstimadaCierreUpd?: string;
    fechaEstimadaCierre?: Date;
    fechaEstimadaCierreOriginal?: Date;
    probabilidadOriginal?: string;
    diasFunnel?: number;
    diasFunnelOriginal?: number;
    idEstatusOportunidad?: number;
    idStage?: number;
    stage?: string;
    tooltipStage?: string;
    totalComentarios?: number;
    totalArchivos?: number;
    idTipoProyecto?: number;
    idTipoEntrega?: number;
    diasEtapa1?: number;
    diasEtapa2?: number;
    diasEtapa3?: number;
    diasEtapa4?: number;
    diasEtapa5?: number;
    idContactoProspecto?: number;
    primerNombreContacto?: string;
    nombreContactoCompleto?: string;
}

export interface RequestOportunidad {

}
