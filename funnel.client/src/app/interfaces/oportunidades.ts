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
    bandera: string;
    idOportunidad?: number;
    idEstatus?: number;
    idEstatusOportunidad?: number;
    idEjecutivo?: number;
    idContactoProspecto?: number;
    idStage?: number;
    idEmpresa?: number;
    idTipoProyecto?: number;
    idTipoEntrega?: number;
    descripcion?: string;
    monto?: number;
    fechaEstimadaCierre?: Date;
    comentario?: string;
}

export interface Archivos {
    bandera: string;
    eliminado: number;
    idArchivo: number;
    nombreArchivo: string;
    idOportunidad: number;
    idUsuario: number;
    fechaRegistro: Date;
    nombreArchivoFormateado: string;
    iniciales: string;
    numArchivos: number;
    diasParaEliminacion: string;
}
export interface Tarjeta {
  idOportunidad: number;
  nombreEmpresa: string;
  nombreAbrev: string;
  nombreOportunidad: string;
  monto: number;
  probabilidad: string;
  montoNormalizado: number;
  imagen: string;
  nombreEjecutivo: string;
  iniciales: string;
  descripcion: string;
  fechaEstimadaCierre?: Date;
  idTipoProyecto : number;
  nombreContacto: string;
  entrega: string;
  fechaEstimadaCierreOriginal?: Date;
  idEstatusOportunidad?: number;
  comentario?: string;
  idProspecto?: number;
  idStage?: number;
  idTipoEntrega?: number;
  idEjecutivo?: number;
  idContactoProspecto?: number;
  totalComentarios?: number;
  idUsuario?: number;
  idEmpresa?: number;
  stage?: string;
  nombre?: string;
}

export  interface OportunidadesPorMes {
  nombre: string;
  expandido: boolean;
  mes: number;
  anio: number;
  tarjetas: Tarjeta[];
}


export interface RequestActualizarFechaEstimadaCierre {
  bandera: string;
  idOportunidad?: number;
  idEmpresa?: number;
  fechaEstimadaCierre?: Date;
  idUsuario?: number;
}
