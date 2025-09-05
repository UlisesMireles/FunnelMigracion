export interface Empresa {
  bandera?: string;
  idEmpresa: number;
  nombreEmpresa?: string;
  alias?: string;
  rfc?: string;
  vInicio?: Date;
  vTerminacion?: Date;
  idLicencia?: number;
  nombreLicencia?: string;
  administrador?: string;
  idAdministrador?: number;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  correo?: string;
  urlSitio?: string;
  activo?: number;
  permitirDecimales?: boolean;
  usuarioCreador?: number;
  iniciales?: string;
  usuario?: string;
  password?: string;
  direccion?: string;
  tamano?: string;
}
