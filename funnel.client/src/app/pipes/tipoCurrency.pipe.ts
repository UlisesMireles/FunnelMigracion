import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
    name: 'totalCurrency'
})
export class TipoCurrencyPipe implements PipeTransform {

    datePipeEs = new DatePipe('es-MX');
    constructor() {
    }
    transform(value: any, tipoFormato: string, currencyCode?: string, locale?: string): any {
        currencyCode = 'USD';
        locale = 'es-MX';

        switch (tipoFormato) {
            case 'boolean':
                return value ? 'Activo' : 'Inactivo';
            case 'currency':
                return new Intl.NumberFormat(locale, {
                style: 'currency', currency: currencyCode, maximumFractionDigits: 4 }).format(value);
            case 'numeric':
                return new Intl.NumberFormat(locale, {maximumFractionDigits: 4 }).format(value);
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
