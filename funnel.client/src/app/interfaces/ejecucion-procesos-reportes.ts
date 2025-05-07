export interface EjecucionProcesosReportes {
    bandera?: string;
    idUsuario: number;
    idEmpresa: number;
    idReporte: number;
    nombre: string;
    horaEjecucion: string;
    frecuencia: number;
    diasInactividad: number;
    diasFechaVencida: number;
    ejecucionJob: boolean;
}