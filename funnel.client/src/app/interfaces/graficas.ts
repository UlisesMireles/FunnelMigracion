export interface GraficasDto {
    id: number;
    label?: string;
    monto: number;
    valor: number;
    coloreSerie?: string;
    contador: number;
    area: number;
    montoNormalizado?: number;
    porcentaje?: number;
}
export interface RequestGraficasDto {
    bandera: string;
    idUsuario?: number;
    idEmpresa?: number;
    idEstatusOportunidad?: number;
    anio?: number;
}
export interface AgenteDto {
    idAgente: number;
    nombre?: string;
    totalAgente: number;
    montoNormalizado?: number;
    archivoImagen?: string;
}