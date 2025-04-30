export interface ConsultaAsistente {
    exitoso: boolean;
    error_mensaje: string;
    id_bot: number;
    pregunta: string;
    respuesta: string;
    tokens_entrada: number;
    tokens_salida: number;
    id_usuario: number;
  }
  
  export interface ConsultaAsistenteDto {
    exitoso: boolean;
    errorMensaje: string;
    idBot: number;
    pregunta: string;
    fechaPregunta: Date;
    respuesta: string;
    fechaRespuesta: Date;
    tokensEntrada: number;
    tokensSalida: number;
    idUsuario: number;
    idTipoUsuario: number;
    idEmpresa: number;
    esPreguntaFrecuente: boolean;
  }
