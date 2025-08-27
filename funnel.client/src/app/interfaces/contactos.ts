export interface Contacto {
    idContactoProspecto: number;
    nombreCompleto: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    correoElectronico: string;
    estatus: number;
    desEstatus: string;
    prospecto: string;
    idProspecto: number;
    idEmpresa: number;
    bandera: string;
    usuarioCreador?: number;
    [key: string]: any; // permite agregar más propiedades
}

export interface RequestPContacto {
    bandera: string;
    idContactoProspecto?: number;
    nombre: string;
    apellidos?: string;
    telefono: string;
    correoElectronico: string;
    estatus: number;
    idProspecto: number;
    idEmpresa: number;
}
