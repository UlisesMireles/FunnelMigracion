import { BaseOut } from "./utils/baseOut";
export interface Usuario extends BaseOut {
  idUsuario: number;
  usuario: string;
  idRol: number;
  idEmpresa: number;
  tipoUsuario: string;
  idTipoUsuario: number;
  nombre: string;
  alias: string;
  ip?: string;
}

export interface DobleAutenticacion {
  usuario: string;
  codigo: number | null;
}
export interface LoginUser {
  usuario: string;
  password: string;
  idEmpresa: number;
  empresa: string;
  idUsuario: number;
  idRol: number;
  alias: string;
  ip?: string;
}
