import { BaseOut } from "./utils/baseOut";
export interface Usuario extends BaseOut {
  idUsuario: number;
  usuario: string;
  idRol: number;
  idEmpresa: number;
  tipoUsuario: string;
  nombre: string;
  alias: string;
}

export interface DobleAutenticacion {
  usuario: string;
  codigo: number | null;
}
export interface LoginUser {
  usuario: string;
  password: string;
}
