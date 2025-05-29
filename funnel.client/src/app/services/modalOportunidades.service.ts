import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Oportunidad } from '../interfaces/oportunidades';
import { BaseOut } from '../interfaces/utils/baseOut';
import { Prospectos } from '../interfaces/prospecto';
import { Contacto } from '../interfaces/contactos';

@Injectable({
  providedIn: 'root'
})
export class ModalOportunidadesService {

  // Observable para Oportunidades
  private modalStateSubject = new BehaviorSubject<{
    showModal: boolean, insertar: boolean, oportunidades: Oportunidad[],
    oportunidadSeleccionada: Oportunidad, result: BaseOut
  }>
    ({ showModal: false, insertar: false, oportunidades: [], oportunidadSeleccionada: {}, result: { errorMessage: '', result: false, id: -1 } });

  modalState$ = this.modalStateSubject.asObservable();


  // Observable para Prospectos
  private modalProspectoStateSubject = new BehaviorSubject<{
    showModal: boolean, insertar: boolean, prospectos: Prospectos[],
    prospectoSeleccionado: Prospectos, result: BaseOut
  }>
    ({
      showModal: false, insertar: false, prospectos: [],
      prospectoSeleccionado: { bandera: '', idProspecto: -1, nombre: '', ubicacionFisica: '', estatus: 0, desEstatus: '', nombreSector: '', idSector: 0, totalOportunidades: 0, proceso: 0, ganadas: 0, perdidas: 0, canceladas: 0, eliminadas: 0, idEmpresa: 0, porcEfectividad: 0 },
      result: { errorMessage: '', result: false, id: -1 }
    });

  modalProspectoState$ = this.modalProspectoStateSubject.asObservable();

  // Observable para Contactos desde header
  private modalContactoStateSubject = new BehaviorSubject<{
    showModal: boolean, insertar: boolean, contactos: Contacto[],
    contactoSeleccionado: Contacto, result: BaseOut
  }>
    ({
      showModal: false, insertar: false, contactos: [],
      contactoSeleccionado: { bandera: '', idContactoProspecto: -1, nombre: '', apellidos: '', telefono: '', correoElectronico: '', prospecto: '', idEmpresa: 0, idProspecto: 0, estatus: 0, desEstatus: '', nombreCompleto: '', },
      result: { errorMessage: '', result: false, id: -1 }
    });
  
  modalContactoState$ = this.modalContactoStateSubject.asObservable();

  // Observable para Contactos desde oportunidades
  private modalContactoOportunidadesStateSubject = new BehaviorSubject<{
    showModal: boolean, insertar: boolean, contactos: Contacto[],
    contactoSeleccionado: Contacto, result: BaseOut
  }>
    ({
      showModal: false, insertar: false, contactos: [],
      contactoSeleccionado: { bandera: '', idContactoProspecto: -1, nombre: '', apellidos: '', telefono: '', correoElectronico: '', prospecto: '', idEmpresa: 0, idProspecto: 0, estatus: 0, desEstatus: '', nombreCompleto: '', },
      result: { errorMessage: '', result: false, id: -1 }
    });
  
  modalContactoOportunidadesState$ = this.modalContactoOportunidadesStateSubject.asObservable();

  constructor() { }

  // Método para abrir la modal
  openModal(showModal: boolean, insertar: boolean, oportunidades: Oportunidad[], oportunidadSeleccionada: Oportunidad, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalStateSubject.next({ showModal: showModal, insertar: insertar, oportunidades: oportunidades, oportunidadSeleccionada: oportunidadSeleccionada, result: result });
  }

  // Método para cerrar la modal
  closeModal(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalStateSubject.next({ showModal: false, insertar: false, oportunidades: [], oportunidadSeleccionada: {}, result: result });
  }

  // Método para abrir la modal
  openModalProspecto(showModal: boolean, insertar: boolean, prospectos: Prospectos[], prospectoSeleccionado: Prospectos, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalProspectoStateSubject.next({ showModal: showModal, insertar: insertar, prospectos: prospectos, prospectoSeleccionado: prospectoSeleccionado, result: result });
  }

  // Método para cerrar la modal
  closeModalProspecto(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalProspectoStateSubject.next({
      showModal: false, insertar: false, prospectos: [],
      prospectoSeleccionado: { bandera: '', idProspecto: -1, nombre: '', ubicacionFisica: '', estatus: 0, desEstatus: '', nombreSector: '', idSector: 0, totalOportunidades: 0, proceso: 0, ganadas: 0, perdidas: 0, canceladas: 0, eliminadas: 0, idEmpresa: 0, porcEfectividad: 0 },
      result: result
    });
  }

  // Método para abrir la modal desde header
  openModalContacto(showModal: boolean, insertar: boolean, contactos: Contacto[], contactoSeleccionado: Contacto, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalContactoStateSubject.next({ showModal: showModal, insertar: insertar, contactos: contactos, contactoSeleccionado: contactoSeleccionado, result: result });
  }

  // Método para cerrar la modal desde header
  closeModalContacto(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalContactoStateSubject.next({
      showModal: false, insertar: false, contactos: [],
      contactoSeleccionado: { bandera: '', idContactoProspecto: -1, nombre: '', apellidos: '', telefono: '', correoElectronico: '', prospecto: '', idEmpresa: 0, idProspecto: 0, estatus: 0, desEstatus: '', nombreCompleto: '', },
      result: result
    });
  }
  // Método para abrir la modal desde oportunidades
  openModalContactoOportunidades(showModal: boolean, insertar: boolean, contactos: Contacto[], contactoSeleccionado: Contacto, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalContactoOportunidadesStateSubject.next({ showModal: showModal, insertar: insertar, contactos: contactos, contactoSeleccionado: contactoSeleccionado, result: result });
  }

  // Método para cerrar la modal desde oportunidades
  closeModalContactoOportunidades(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalContactoOportunidadesStateSubject.next({
      showModal: false, insertar: false, contactos: [],
      contactoSeleccionado: { bandera: '', idContactoProspecto: -1, nombre: '', apellidos: '', telefono: '', correoElectronico: '', prospecto: '', idEmpresa: 0, idProspecto: 0, estatus: 0, desEstatus: '', nombreCompleto: '', },
      result: result
    });
  }
}