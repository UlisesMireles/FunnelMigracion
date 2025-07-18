import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OportunidadesPorEtapa } from '../interfaces/oportunidades';
import { BaseOut } from '../interfaces/utils/baseOut';
import { Prospectos } from '../interfaces/prospecto';
import { Contacto } from '../interfaces/contactos';

@Injectable({
  providedIn: 'root'
})
export class ModalEtapasService {

  // Observable para Etapas
  private modalStateSubject = new BehaviorSubject<{
    showModal: boolean, insertarEtapas: boolean, etapas: OportunidadesPorEtapa[], result: BaseOut
  }>
    ({ showModal: false, insertarEtapas: false, etapas: [], result: { errorMessage: '', result: false, id: -1 } });

  modalState$ = this.modalStateSubject.asObservable();

  constructor() { }

  // Método para abrir la modal
  openModal(showModal: boolean, insertarEtapas: boolean, etapas: OportunidadesPorEtapa[], result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalStateSubject.next({ showModal: showModal, insertarEtapas: insertarEtapas, etapas: etapas, result: result });
    return this.modalStateSubject.asObservable();
  }

  // Método para cerrar la modal
  closeModal(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalStateSubject.next({ showModal: false, insertarEtapas: false, etapas: [], result: result });
  }

}