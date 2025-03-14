import { Injectable, isDevMode } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { PrimeNG } from "primeng/config";

@Injectable({
    providedIn: "root",
})
export class PrimeNgConfiguracionService {

    constructor(private config: PrimeNG) {
    }
    //funcion que se usa al cargar la app
    load(): Promise<any> {
        return this.getUserInformation();
    }

    //Funcion
    getUserInformation = () => {
        return new Promise((resolve) => {

            this.config.setTranslation({
                startsWith: "Empieza con",
                contains: "Contiene",
                notContains: "No contiene",
                endsWith: "Termina con",
                equals: "Igual",
                notEquals: "No igual",
                noFilter: "Sin filtro",
                lt: "Menor que",
                lte: "Menor que o igual a",
                gt: "Mayor que",
                gte: "Mayor que o igual a",
                is: "Es",
                isNot: "No es",
                before: "Antes",
                after: "Despues",
                dateIs: "Esta fecha",
                dateIsNot: "Fecha no es",
                dateBefore: "Anterior a fecha",
                dateAfter: "Despues de fecha",
                clear: "Limpiar",
                apply: "Aplicar",
                matchAll: "Coincidir todo",
                matchAny: "Coincidir cualquiera",
                addRule: "Agregar regla",
                removeRule: "Quitar regla",
                accept: "Aceptar",
                reject: "Cancelar",
                choose: "Escoge",
                upload: "Subir",
                cancel: "Cancelar",
                dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"],
                dayNamesShort: ["Dom", ":Lun", "Mar", "Mier", "Jue", "Vier", "Sáb"],
                dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
                monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
                monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun","jul", "ago", "sep", "oct", "nov", "dic"],
                dateFormat: "dd-M-yy",
                firstDayOfWeek: 0,
                today: "Hoy",
                weekHeader: "Sm",
                weak: "Semana",
                medium: "Medio",
                strong: "Fuerte",
                passwordPrompt: "Escribe una contraseña",
                emptyMessage: "No se han encontrado resultados",
                emptyFilterMessage: "No se han encontrado resultados"
            });
            resolve(true);
        });
    };


}
