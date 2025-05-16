import { BaseOut } from "./utils/baseOut";
export interface licencia extends BaseOut {
    idLicencia: number;
    nombreLicencia: string;
    cantidadUsuarios: number;
    cantidadOportunidades: number;
    activo: boolean;
}
