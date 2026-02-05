import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseOut } from '../interfaces/utils/baseOut';
import { CamposAdicionales } from '../interfaces/campos-adicionales';

@Injectable({
  providedIn: 'root'
})
export class ModalCamposAdicionalesService {

  // Observable para Campos Adicionales
  private modalStateSubject = new BehaviorSubject<{
    showModal: boolean, campos: CamposAdicionales[],camposPorCatalogo: CamposAdicionales[], pantalla: string, valorSeleccionado: any, result: BaseOut
  }>
    ({ showModal: false, campos: [], camposPorCatalogo: [], pantalla: '', valorSeleccionado: null, result: { errorMessage: '', result: false, id: -1 } });

  modalState$ = this.modalStateSubject.asObservable();

  constructor() { }

  // Método para abrir la modal
  openModal(showModal: boolean, campos: CamposAdicionales[], camposPorCatalogo: CamposAdicionales[], pantalla: string, valorSeleccionado: any, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalStateSubject.next({ showModal: showModal, campos: campos, camposPorCatalogo: camposPorCatalogo, pantalla: pantalla, valorSeleccionado: valorSeleccionado, result: result });
    return this.modalStateSubject.asObservable();
  }

  // Método para cerrar la modal
  closeModal(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalStateSubject.next({ showModal: false, campos: [], camposPorCatalogo: [], pantalla: '', valorSeleccionado: null, result: result });
  }

}