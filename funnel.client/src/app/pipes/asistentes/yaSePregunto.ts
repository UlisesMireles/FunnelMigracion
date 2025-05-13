
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'yaSePregunto'
})
export class YaSePreguntoPipe implements PipeTransform {


    transform(value: any): any {
        if (value) {
            return value.filter((v: any) => {
                return v.yaSePregunto === false;
            });
        }
    }


}
