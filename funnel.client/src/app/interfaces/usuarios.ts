export interface Usuario {
    result: boolean;
    errorMessage: string;

    idUsuario?: number;
    usuario: string;
    password: string;
    tipoUsuario: string;
    nombre: string;
    correo: string;
    alias: string;
    idEmpresa: number;
    idRol: number;
    idTipoUsuario: number;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaRegistro: string;
    fechaModificacion: string;
    estatus: number;
    desEstatus: string;
    archivoImagen?: string;
    usuarioCreador: number;
    codigoAutenticacion: string;
    fechaInicio: string;
    fechaFin: string;
    iniciales: string;
    correoElectronico: string;
    numOportunidades: number;
    id: number;
  }
  
  export interface RequestUsuario {
    bandera: string; 
    idUsuario?: number;
    usuario: string;
    password: string;
    tipoUsuario: string;
    nombre: string;
    correo: string;
    alias: string;
    idEmpresa: number;
    idRol: number;
    idTipoUsuario: number;
    apellidoPaterno: string;
    apellidoMaterno: string;
    archivoImagen?: string;
    usuarioCreador: number;
    codigoAutenticacion: string;
    fechaInicio: string;
    fechaFin: string;
    iniciales: string;
    correoElectronico: string;
    numOportunidades: number;
  }