import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalOportunidadesService {
  private modalStateSubject = new BehaviorSubject<{ showModal: boolean, insertar: boolean }>({ showModal: false, insertar: false });

  // Observable para que otros componentes puedan suscribirse
  modalState$ = this.modalStateSubject.asObservable();

  constructor() { }

  // Método para abrir la modal
  openModal(insertar: boolean) {
    this.modalStateSubject.next({ showModal: true, insertar: insertar });
  }

  // Método para cerrar la modal
  closeModal() {
    this.modalStateSubject.next({ showModal: false, insertar: false });
  }
}