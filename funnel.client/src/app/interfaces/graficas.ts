export interface GraficasDto {
    id: number;
    label?: string;
    monto: number;
    valor: number;
    coloreSerie?: string;
    contador: number;
    area: number;
}
export interface RequestGraficasDto {
    bandera: string;
    idUsuario?: number;
    idEmpresa: number;
}