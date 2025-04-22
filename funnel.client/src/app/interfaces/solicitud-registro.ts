export interface SolicitudRegistroSistema {
    id?: number;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    empresa: string;
    urlSitio: string;
    noEmpleados: string;
    privacidadTerminos: boolean;
    recaptcha: string;
}