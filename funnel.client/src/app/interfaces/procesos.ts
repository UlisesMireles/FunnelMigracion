import { OportunidadesPorEtapa } from "./oportunidades";

export interface Procesos {
    bandera?: string;
    idProceso: number;
    idEmpresa: number;
    idUsuario: number;
    nombre: string;
    estatus: boolean;
    desEstatus: string;
    oportunidades: number;
    oportunidadesGanadas: number;
    oportunidadesPerdidas: number;
    oportunidadesEliminadas: number;
    oportunidadesCanceladas: number;
    etapas: OportunidadesPorEtapa[];
    idPlantilla?: number;
}