export interface Usuarios {
    result?: boolean;
    errorMessage?: string;

    idUsuario: number;
    usuario: string;
    password: string;
    tipoUsuario: string;
    nombre: string;
    correo: string;
    idEmpresa: number;
    idTipoUsuario: number;
    descripcion: string;
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
    id?: number;
    imagen?: File;
    cantidadOportunidades?: number;
  }
  
  export interface RequestUsuario {
    bandera: string; 
    idUsuario: number;
    usuario: string;
    password: string;
    tipoUsuario: string;
    nombre: string;
    correo: string;
    idEmpresa: number;
    idTipoUsuario: number;
    apellidoPaterno: string;
    apellidoMaterno: string;
    archivoImagen?: string;
    usuarioCreador: number;
    codigoAutenticacion: string;
    fechaInicio: string;
    fechaFin: string;
    iniciales: string;
    id?: number;
  }