export interface IngresosUsuarios {
    idUsuario: number;
    usuario: string;
    anios: number[];
    total: number
    data: IngresosUsuariosPorMes[]
}

export interface IngresosUsuariosPorMes {
    usuario: string;
    anio: number;
    mes: number;
    mesTexto: string;
    totalAccesos: number;
}

