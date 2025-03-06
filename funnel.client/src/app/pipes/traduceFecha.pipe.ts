import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'traduceFechaPipe'
})
export class TraduceFechaPipe implements PipeTransform {
  datePipeEs = new DatePipe('es-MX');
  
  transform(value: any, tipo?: string): string {
    if(tipo){
      if(tipo === 'date'){
       return this.traduceFechaLarga(value);
      }
    }
    if(value == 0){
      return value;
    }
    let isNumber = Number(value);

    if(isNumber){
      return value;
    }
    let f = new Date(value);

    if(f.toString() === "Invalid Date"){
      return value;
    }
    const valueTransform = this.datePipeEs.transform(value, 'dd-MM-yyyy');
    if (valueTransform === "01-01-0001") {
      return '';
    }
    return this.traduceFechaLarga(value);
  }

  traduceFechaLarga(value: Date): string {
    let fechaFin;
    const fecha = this.datePipeEs.transform(value, 'd-MMM-y')?.toLocaleLowerCase() || '';
  //  const tiempo = this.datePipeEs.transform(value, 'h:mm a')?.toLocaleLowerCase() || '';
    //fechaFin = fecha + (tiempo ? ' ' + tiempo : '');
    fechaFin = fecha;
    return fechaFin;
  }
}
