export interface IngresosUsuarios {
    idUsuario: number;
    usuario: string;
    anios: number[];
    total: number
    data: IngresosUsuariosPorMes[]
    ip: string[];
    ips: string[];
    ubicaciones: string[];
}

export interface IngresosUsuariosPorMes {
    usuario: string;
    anio: number;
    mes: number;
    mesTexto: string;
    totalAccesos: number;
}

