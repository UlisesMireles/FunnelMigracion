import { OportunidadesPorEtapa } from "./oportunidades";

export interface PlantillasProcesos {
    idPlantilla: number;
    plantilla: string;
    estatus: boolean;
    desEstatus: string;
    etapas: OportunidadesPorEtapa[];
}