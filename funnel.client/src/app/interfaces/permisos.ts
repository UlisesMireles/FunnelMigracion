export interface Permiso {
    bandera?: string;
    idEmpresa?: number;
    idRol?: number;
    estatus?: boolean;
    idPagina?: number;
    descripcion?: string;
    idMenu?: number;
    menu?: string;
    pagina?: string;
    administrador?: boolean;
    gerente?: boolean;
    agente?: boolean;
    invitado?: boolean;
}

export interface PermisoSeleccionado {
    idPagina?: number;
    idRol?: number;
    idEmpresa?: number;
    estatus?: boolean;
  }