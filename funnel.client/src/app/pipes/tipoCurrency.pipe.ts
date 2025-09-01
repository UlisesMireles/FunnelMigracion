import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'totalCurrency',
    standalone: false
})
export class TipoCurrencyPipe implements PipeTransform {

    datePipeEs = new DatePipe('es-MX');

    constructor() {}

    transform(
        value: any,
        tipoFormato: string,
        mostrarDecimales: boolean = false,
        currencyCode: string = 'MXN',
        locale: string = 'es-MX'
    ): any {

        if (value === null || value === undefined || value === '') return '';

        const maxFractionDigits = mostrarDecimales ? 2 : 0;

        switch (tipoFormato) {
            case 'boolean':
                return value ? 'Activo' : 'Inactivo';

            case 'currency':
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currencyCode,
                    minimumFractionDigits: maxFractionDigits,
                    maximumFractionDigits: maxFractionDigits
                }).format(value);

            case 'numeric':
                return new Intl.NumberFormat(locale, {
                    minimumFractionDigits: maxFractionDigits,
                    maximumFractionDigits: maxFractionDigits
                }).format(value);

            case 'date':
                const valueTransform = this.datePipeEs.transform(value, 'dd-MM-yyyy');
                if (valueTransform === "01-01-0001") {
                    return '';
                }
                return this.datePipeEs.transform(value, 'd-MMM-y')?.toLocaleLowerCase() || '';

            default:
                return value;
        }
    }

}
