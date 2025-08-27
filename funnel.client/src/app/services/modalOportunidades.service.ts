import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Oportunidad } from '../interfaces/oportunidades';
import { BaseOut } from '../interfaces/utils/baseOut';
import { Prospectos } from '../interfaces/prospecto';
import { Contacto } from '../interfaces/contactos';
import { TipoServicio } from '../interfaces/tipoServicio';
import { TipoEntrega } from '../interfaces/tipo-entrega';

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
    showModal: boolean, insertarProspecto: boolean, prospectos: Prospectos[],
    prospectoSeleccionado: Prospectos, result: BaseOut, desdeSector: boolean
  }>({
    showModal: false, insertarProspecto: false, prospectos: [],
    prospectoSeleccionado: { bandera: '', idProspecto: -1, nombre: '', ubicacionFisica: '', estatus: 0, desEstatus: '', nombreSector: '', idSector: 0, totalOportunidades: 0, proceso: 0, ganadas: 0, perdidas: 0, canceladas: 0, eliminadas: 0, idEmpresa: 0, porcEfectividad: 0 },
    result: { errorMessage: '', result: false, id: -1 },
    desdeSector: false
  });


  modalProspectoState$ = this.modalProspectoStateSubject.asObservable();

  // Observable para Contactos desde header
  private modalContactoStateSubject = new BehaviorSubject<{
    showModal: boolean, insertarContacto: boolean, contactos: Contacto[],
    contactoSeleccionado: Contacto, result: BaseOut
  }>
    ({
      showModal: false, insertarContacto: false, contactos: [],
      contactoSeleccionado: { bandera: '', idContactoProspecto: -1, nombre: '', apellidos: '', telefono: '', correoElectronico: '', prospecto: '', idEmpresa: 0, idProspecto: 0, estatus: 0, desEstatus: '', nombreCompleto: '', },
      result: { errorMessage: '', result: false, id: -1 }
    });

  modalContactoState$ = this.modalContactoStateSubject.asObservable();

  // Observable para Contactos desde oportunidades
  private modalContactoOportunidadesStateSubject = new BehaviorSubject<{
    showModal: boolean, insertarContacto: boolean, contactos: Contacto[],
    contactoSeleccionado: Contacto, result: BaseOut
  }>
    ({
      showModal: false, insertarContacto: false, contactos: [],
      contactoSeleccionado: { bandera: '', idContactoProspecto: -1, nombre: '', apellidos: '', telefono: '', correoElectronico: '', prospecto: '', idEmpresa: 0, idProspecto: 0, estatus: 0, desEstatus: '', nombreCompleto: '', },
      result: { errorMessage: '', result: false, id: -1 }
    });

  modalContactoOportunidadesState$ = this.modalContactoOportunidadesStateSubject.asObservable();

  // Observable para prospectos desde oportunidades
  private modalProspectoOportunidadesStateSubject = new BehaviorSubject<{
    showModal: boolean, insertarProspecto: boolean, prospectos: Prospectos[],
    prospectoSeleccionado: Prospectos, result: BaseOut
  }>
    ({
      showModal: false, insertarProspecto: false, prospectos: [],
      prospectoSeleccionado: { bandera: '', idProspecto: -1, nombre: '', ubicacionFisica: '', estatus: 0, desEstatus: '', nombreSector: '', idSector: 0, totalOportunidades: 0, proceso: 0, ganadas: 0, perdidas: 0, canceladas: 0, eliminadas: 0, idEmpresa: 0, porcEfectividad: 0 },
      result: { errorMessage: '', result: false, id: -1 }
    });

  modalProspectoOportunidadesState$ = this.modalProspectoOportunidadesStateSubject.asObservable();

  // Observable para tipos de servicios desde oportunidades
  private modalTiposServiciosOportunidadesStateSubject = new BehaviorSubject<{
    showModal: boolean, insertarTipoServicio: boolean, tiposServicios: TipoServicio[],
    tipoServicioSeleccionado: TipoServicio, result: BaseOut
  }>
    ({
      showModal: false, insertarTipoServicio: false, tiposServicios: [],
      tipoServicioSeleccionado: { idTipoProyecto: -1, descripcion: '', abreviatura: '', estatus: 0, desEstatus : '', fechaModificacion: '', idEmpresa: 0 },
      result: { errorMessage: '', result: false, id: -1 }
    });

  modalTiposServiciosOportunidadesState$ = this.modalTiposServiciosOportunidadesStateSubject.asObservable();

    // Observable para tipos de entregas desde oportunidades
  private modalTiposEntregasOportunidadesStateSubject = new BehaviorSubject<{
    showModal: boolean, insertarTipoEntrega: boolean, tiposEntregas: TipoEntrega[],
    tipoEntregaSeleccionado: TipoEntrega, result: BaseOut
  }>
    ({
      showModal: false, insertarTipoEntrega: false, tiposEntregas: [],
      tipoEntregaSeleccionado: { idTipoEntrega: -1, descripcion: '', estatus: 0, abreviatura: '', idEmpresa: 0, fechaModificacion: '', desEstatus: ''},
      result: { errorMessage: '', result: false, id: -1 }
    });

  modalTiposEntregasOportunidadesState$ = this.modalTiposEntregasOportunidadesStateSubject.asObservable();


  constructor() { }

  // Método para abrir la modal
  openModal(showModal: boolean, insertar: boolean, oportunidades: Oportunidad[], oportunidadSeleccionada: Oportunidad, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalStateSubject.next({ showModal: showModal, insertar: insertar, oportunidades: oportunidades, oportunidadSeleccionada: oportunidadSeleccionada, result: result });
    return this.modalStateSubject.asObservable();
  }

  // Método para cerrar la modal
  closeModal(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalStateSubject.next({ showModal: false, insertar: false, oportunidades: [], oportunidadSeleccionada: {}, result: result });
  }

  // Método para abrir la modal
  openModalProspecto(showModal: boolean, insertarProspecto: boolean, prospectos: Prospectos[], prospectoSeleccionado: Prospectos, result: BaseOut = { errorMessage: '', result: false, id: -1 }, desdeSector: boolean = false) {
    this.modalProspectoStateSubject.next({
      showModal, insertarProspecto, prospectos, prospectoSeleccionado, result, desdeSector
    });
    return this.modalProspectoStateSubject.asObservable();
  }

  openModalProspectoOportunidades(showModal: boolean, insertarProspecto: boolean, prospectos: Prospectos[], prospectoSeleccionado: Prospectos, result: BaseOut = { errorMessage: '', result: false, id: -1 }, desdeSector: boolean = false) {
    this.modalProspectoOportunidadesStateSubject.next({ showModal: showModal, insertarProspecto: insertarProspecto, prospectos: prospectos, prospectoSeleccionado: prospectoSeleccionado, result: result });
  }


  // Método para cerrar la modal
  closeModalProspecto(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalProspectoStateSubject.next({
      showModal: false, insertarProspecto: false, prospectos: [],
      prospectoSeleccionado: { bandera: '', idProspecto: -1, nombre: '', ubicacionFisica: '', estatus: 0, desEstatus: '', nombreSector: '', idSector: 0, totalOportunidades: 0, proceso: 0, ganadas: 0, perdidas: 0, canceladas: 0, eliminadas: 0, idEmpresa: 0, porcEfectividad: 0 },
      result: result,
      desdeSector: false
    });
    return this.modalProspectoStateSubject.asObservable();
  }

  closeModalProspectoOportunidades(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalProspectoOportunidadesStateSubject.next({
      showModal: false, insertarProspecto: true, prospectos: [],
      prospectoSeleccionado: { bandera: '', idProspecto: -1, nombre: '', ubicacionFisica: '', estatus: 0, desEstatus: '', nombreSector: '', idSector: 0, totalOportunidades: 0, proceso: 0, ganadas: 0, perdidas: 0, canceladas: 0, eliminadas: 0, idEmpresa: 0, porcEfectividad: 0 },
      result: result
    });
  }

  // Método para abrir la modal desde header
  openModalContacto(showModal: boolean, insertarContacto: boolean, contactos: Contacto[], contactoSeleccionado: Contacto, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalContactoStateSubject.next({ showModal: showModal, insertarContacto: insertarContacto, contactos: contactos, contactoSeleccionado: contactoSeleccionado, result: result });
  }

  // Método para cerrar la modal desde header
  closeModalContacto(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalContactoStateSubject.next({
      showModal: false, insertarContacto: false, contactos: [],
      contactoSeleccionado: { bandera: '', idContactoProspecto: -1, nombre: '', apellidos: '', telefono: '', correoElectronico: '', prospecto: '', idEmpresa: 0, idProspecto: 0, estatus: 0, desEstatus: '', nombreCompleto: '', },
      result: result
    });
  }
  // Método para abrir la modal desde oportunidades
  openModalContactoOportunidades(showModal: boolean, insertarContacto: boolean, contactos: Contacto[], contactoSeleccionado: Contacto, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalContactoOportunidadesStateSubject.next({ showModal: showModal, insertarContacto: insertarContacto, contactos: contactos, contactoSeleccionado: contactoSeleccionado, result: result });
  }

  // Método para cerrar la modal desde oportunidades
  closeModalContactoOportunidades(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalContactoOportunidadesStateSubject.next({
      showModal: false, insertarContacto: true, contactos: [],
      contactoSeleccionado: { bandera: '', idContactoProspecto: -1, nombre: '', apellidos: '', telefono: '', correoElectronico: '', prospecto: '', idEmpresa: 0, idProspecto: 0, estatus: 0, desEstatus: '', nombreCompleto: '', },
      result: result
    });
  }

  // Método para abrir la modal de tipos de servicios desde oportunidades
  openModalTipoServicioOportunidades(showModal: boolean, insertarTipoServicio: boolean, tiposServicios: TipoServicio[],tipoServicioSeleccionado: TipoServicio, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalTiposServiciosOportunidadesStateSubject.next({ showModal: showModal, insertarTipoServicio: insertarTipoServicio, tiposServicios: tiposServicios, tipoServicioSeleccionado: tipoServicioSeleccionado, result: result });
  }

  // Método para cerrar la modal de tipos de servicios desde oportunidades
  closeModalTipoServicioOportunidades(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalTiposServiciosOportunidadesStateSubject.next({
      showModal: false, insertarTipoServicio: true, tiposServicios: [],
      tipoServicioSeleccionado: { idTipoProyecto: -1, descripcion: '', abreviatura: '', estatus: 0, desEstatus : '', fechaModificacion: '', idEmpresa: 0 },
      result: result
    });
  }

  // Método para abrir la modal de tipos de entregas desde oportunidades
  openModalTipoEntregasOportunidades(showModal: boolean, insertarTipoEntrega: boolean, tiposEntregas: TipoEntrega[],tipoEntregaSeleccionado: TipoEntrega, result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalTiposEntregasOportunidadesStateSubject.next({ showModal: showModal, insertarTipoEntrega: insertarTipoEntrega, tiposEntregas: tiposEntregas, tipoEntregaSeleccionado: tipoEntregaSeleccionado, result: result });
  }

  // Método para cerrar la modal de tipos de entregas desde oportunidades
  closeModalTipoEntregasOportunidades(result: BaseOut = { errorMessage: '', result: false, id: -1 }) {
    this.modalTiposEntregasOportunidadesStateSubject.next({
      showModal: false, insertarTipoEntrega: true, tiposEntregas: [],
      tipoEntregaSeleccionado: { idTipoEntrega: -1, descripcion: '', estatus: 0, abreviatura: '', idEmpresa: 0, fechaModificacion: '', desEstatus: '' },
      result: result
    });
  }


}