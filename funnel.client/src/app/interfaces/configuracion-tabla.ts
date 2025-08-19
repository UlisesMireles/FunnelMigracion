export interface ConfiguracionTabla {
    idTabla: number;
    idColumna: number;
    idUsuario: number;
    key: string;
    valor: string;
    tipoFormato: string;
    isChecked: boolean;
    isIgnore: boolean;
    isTotal: boolean;
    groupColumn: boolean;
    orden: number;
    fechaRegistro: Date;
}

export interface ConfiguracionTablaResponse {
    idTabla: number;
    idUsuario: number;
    configuracionTabla: ConfiguracionTabla[];
}