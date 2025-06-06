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
    bandera?: string;
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
export interface AniosDto{
    idEmpresa: number;
    idEstatusOportunidad: number;
    anio: number;
}
export interface Sectores{
    idSector: number;
    nombreSector: string;  
    monto: number;        
    montoNormalizado: number;
}

export interface SectoresDetalles{
    idOportunidad: number;
    nombreProspecto: string;     
    nombreOportunidad: string;
    tipoProyecto: string; 
    tipoProyectoAbreviatura: string;       
    ejecutivo: string;   
    iniciales: string;       
    monto: number;
    fechaEstimadaCierre: string;
    montoNormalizado: number;
    probabilidad: string;
    stage: string;
}