export interface Prospectos {
    bandera?: string;
    idProspecto: number;
    nombre: string;
    ubicacionFisica: string;
    estatus: number;
    desEstatus: string;
    nombreSector: string;
    idSector: number;
    totalOportunidades: number;
    proceso: number;
    ganadas: number;
    perdidas: number;
    canceladas: number;
    eliminadas: number;
    idEmpresa: number;
    porcEfectividad: number;
    promDiasEtapa1: number;
    promDiasEtapa2: number;
    promDiasEtapa3: number;
    promDiasEtapa4: number;
    promDiasEtapa5: number;
    promDiasSinActividad: number;
    idNivel?: number;
    descripcion?: string;
}

export interface ClientesTopVeinte {
  idProspecto: number;
  nombre: string;
  ubicacionFisica: string;
  estatus: number;
  desEstatus: string;
  nombreSector: string;
  idSector: number;
  totalOportunidades: number;
  proceso: number;
  ganadas: number;
  perdidas: number;
  canceladas: number;
  eliminadas: number;
  porcGanadas: number;      
  porcPerdidas: number;     
  porcCanceladas: number;   
  porcEliminadas: number;   
  idEmpresa?: number;  
  ultimaFechaRegistro?: Date;     
}
export interface ProspectosCmb{
    idProspecto: number,
    nombre: string,
    ubicacionFisica: string
  }
  export interface RequestProspecto{
    bandera:string,
    idProspecto?: number,
    nombre:string,
    ubicacionFisica:string,
    estatus:number, 
    idSector: number,
   
    idEmpresa?: number
  }
  