import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClientesTopVeinte } from '../interfaces/prospecto';

@Injectable({
  providedIn: 'root'
})
export class TopVeinteDataService {

  // BehaviorSubject emite el último valor a nuevos suscriptores
  private top20Data = new BehaviorSubject<ClientesTopVeinte[]>([]);
  
  // Observable al que otros componentes se suscribirán
  currentTop20Data = this.top20Data.asObservable();

  // Método para actualizar los datos
  updateTop20Data(data: ClientesTopVeinte[]) {
    this.top20Data.next(data);
  }
}