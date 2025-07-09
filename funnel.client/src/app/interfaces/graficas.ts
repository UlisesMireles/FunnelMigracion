export interface GraficasDto {
    id: number;
    label?: string;
    monto: number;
    valor: number;
    valor2: number;
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

export interface OportunidadesTipo {
    idTipoProyecto: number;
    descripcion: string;  
    monto: number;        
    montoNormalizado: number;
    porcentaje: number;
}

export interface OportunidadesTipoDetalles {
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

export interface OportunidadAgenteCliente {
  idOportunidad: number;
  nombreProspecto: string;
  nombreOportunidad: string;
  nombreAbreviado: string;
  tipoProyecto: string;
  tipoProyectoAbreviatura: string;
  entrega: string;
  entregaDescripcion: string;
  iniciales: string;
  nombreEjecutivo: string;
  monto: number;
  probabilidad: string;
  fechaModificacion: number;
  comentario: string;
  montoNormalizado: number;
  fechaRegistro: string;
  abreviaturaEstatus: string;
  descripcionEstatus: string;
  decProbabilidad: number;
  idEjecutivo: number;
  fechaEstimadaCierreUpd: string;
  fechaEstimadaCierre: string;
  probabilidadOriginal: string;
  idEstatusOportunidad: number;
  idStage: number;
  stage: string;
}

export interface TipoOportunidadAgente {
  idTipoOporAgente: number;
  descripcion: string;
  monto: number;
  montoNormalizado: number;
  porcentaje: number;
}

export interface DetalleTipoOportunidadAgente  {
  idOportunidad: number;
  nombreSector: string;
  nombreProspecto: string;
  nombreOportunidad: string;
  nombreAbreviado: string;
  tipoProyectoAbreviatura: string;
  tipoProyecto: string;
  iniciales: string;
  nombreEjecutivo: string;
  monto: number;
  probabilidad: string;
  fechaModificacion: number;
  comentario: string;
  montoNormalizado: number;
  fechaRegistro: string;
  abreviaturaEstatus: string;
  descripcionEstatus: string;
  probabilidadDecimal: number;
  idEjecutivo: number;
  fechaEstimadaCierre: string;
  probabilidadOriginal: string;
  diasFunnel: number;
  idEstatusOportunidad: number;
  idStage: number;
  stage: string;
  tooltipStage: string;
  totalComentarios: number;
  idTipoProyecto: number;
}

export interface TipoSectorAgente {
  idSector: number;
  descripcion: string;
  monto: number;
  montoNormalizado: number;
  porcentaje: number;
}

export interface DetalleSectorAgente {
  idOportunidad: number;
  nombreSector: string;
  nombreProspecto: string;
  nombreOportunidad: string;
  nombreAbreviado: string;
  tipoProyectoAbreviatura: string;
  tipoProyecto: string;
  iniciales: string;
  nombreEjecutivo: string;
  monto: number;
  probabilidad: string;
  fechaModificacion: number;
  comentario: string;
  montoNormalizado: number;
  fechaRegistro: string;
  abreviaturaEstatus: string;
  descripcionEstatus: string;
  probabilidadDecimal: number;
  idEjecutivo: number;
  fechaEstimadaCierre: string;
  probabilidadOriginal: string;
  diasFunnel: number;
  idEstatusOportunidad: number;
  idStage: number;
  stage: string;
  tooltipStage: string;
  totalComentarios: number;
  idTipoProyecto: number;
}
