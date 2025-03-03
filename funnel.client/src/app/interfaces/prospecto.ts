export interface Prospectos {
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
export interface ProspectosCmb{
    idProspecto: number,
    nombre: string,
    ubicacionFisica: string
  }
  export interface RequestProspecto{
    bandera:string,
    idProspecto: number,
    nombre:string,
    ubicacionFisica:string,
    proceso:number,
    ganadas: number;
    perdidas: number;
    canceladas: number;
    eliminadas: number;
    estatus: number,
    idSector: number,
    idEmpresa: number
  }
  