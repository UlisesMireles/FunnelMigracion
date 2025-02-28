export interface SEL_Prospectos {
    bandera: string;
    idProspecto: number;
    nombre: string;
    ubicacionFisica: string;
    esatus: number;
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
}
export interface SEL_Prospectos_CMB{
    idProspecto: number,
    nombre: string,
    ubicacionFisica: string
  }
  export interface requestProspecto{
    bandera:string,
    idProspecto: number,
    nombre:string,
    ubicacionFisica:string,
    estatus: number,
  }
  