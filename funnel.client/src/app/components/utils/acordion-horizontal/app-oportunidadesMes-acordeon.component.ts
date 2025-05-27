import { transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Oportunidad, OportunidadesPorMes, RequestActualizarFechaEstimadaCierre, Tarjeta } from '../../../interfaces/oportunidades';
import { OportunidadesService } from '../../../services/oportunidades.service';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { ModalOportunidadesService } from '../../../services/modalOportunidades.service';

@Component({
  selector: 'app-oportunidadesMes-acordeon',
  standalone: false,
  templateUrl: './app-oportunidadesMes-acordeon.component.html',
  styleUrls: ['./app-oportunidadesMes-acordeon.component.css'] // Uso de styleUrls en plural
})
export class OortunidadesMesAcordeonComponent {


  elementos: OportunidadesPorMes[] = []; // Array que contendrá los meses con sus oportunidades (tarjetas)
  loading: boolean = true;// Bandera para mostrar el spinner de carga
  errorMessage: string = '';// Variable para almacenar mensaje de error en caso de fallo
  connectedDropLists: string[] = [];// Lista de identificadores para los dropLists de cada mes (usado por cdkDragDrop)
  mostrarModal: boolean = false;  // Bandera para controlar la visibilidad del modal de confirmación
  tarjetaMovida: any;// Objeto que almacena la tarjeta que se movió y datos relacionados (origen, destino, etc.)
  fechaSeleccionada: string = '';// Variable para almacenar la fecha (último día del mes destino) que se mostrará en el modal
  today: string = new Date().toISOString().split('T')[0];// Fecha actual en formato ISO sin tiempo (YYYY-MM-DD)
  idOportunidadTarjeta: number = 0;  // Variable para almacenar el ID de la oportunidad (tarjeta) que se está moviendo
  tarjetaEnEspera: any;  // Variable para almacenar temporalmente la tarjeta arrastrada (para poder obtener su idOportunidad)
  ultimoMesAgregado: string = '';// Variable auxiliar que guarda el nombre y año del último mes agregado (por ejemplo: "Julio 2025")
  modalEditarVisible: boolean = false;
  modalSeguimientoVisible: boolean = false;
  insertar: boolean = false;
  oportunidadSeleccionada!: Oportunidad;
  oportunidades: Oportunidad[] = [];
  seguimientoOportunidad: boolean = false;

  // Output para emitir resultados de la petición post (por ejemplo, para notificar a un padre)
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  // Inyección de servicios en el constructor
  constructor(
    private oportunidadService: OportunidadesService,private readonly loginService: LoginService,private messageService: MessageService,private cdr: ChangeDetectorRef,
    private modalOportunidadesService: ModalOportunidadesService
  ) { }

  ngOnInit() {
    // Se obtiene la información de oportunidades por mes desde el servicio
    this.getOportunidadesPorMes();
  }

  // Método que consume el servicio para obtener las oportunidades por mes
  getOportunidadesPorMes() {
    this.oportunidadService.getOportunidadesPorMes(
      this.loginService.obtenerIdEmpresa(),
      this.loginService.obtenerIdUsuario()
    ).subscribe({
      next: (result: OportunidadesPorMes[]) => {
        // Asignamos el resultado a nuestro array 'elementos'
        this.elementos = [...result];
        // Aseguramos que cada mes tenga inicializado el arreglo de tarjetas
        this.elementos.forEach(mes => {
          if (!Array.isArray(mes.tarjetas)) {
            mes.tarjetas = [];
          }
        });
        // Inicializamos la lista de identificadores para cada dropList
        this.connectedDropLists = this.elementos.map((_, i) => `todoList${i}`);
        // Establecemos 'ultimoMesAgregado' con el nombre y año del último elemento de 'elementos'
        if (this.elementos.length > 0) {
          this.ultimoMesAgregado = `${this.elementos[this.elementos.length - 1].nombre} ${this.elementos[this.elementos.length - 1].anio}`;
        } else {
          this.ultimoMesAgregado = 'Enero 2025';
        }
        // Actualizamos la propiedad 'expandido' para que se muestren los 4 últimos meses
        this.actualizarExpansiones();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        // En caso de error, se muestra un mensaje con PrimeNG MessageService
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      },
    });
  }

  // Método para alternar (abrir/cerrar) un mes en el acordeón
  alternarItem(item: any, event: Event) {
    event.stopPropagation(); // Evita propagación del evento
    item.expandido = !item.expandido; // Invierte el valor de 'expandido'
  }

  // Método que se ejecuta al soltar (drop) una tarjeta en otro mes
  drop(event: any, mesDestino: OportunidadesPorMes) {
    // Si se suelta en el mismo contenedor, no se hace nada
    if (event.previousContainer === event.container) {
      return;
    }

    // Buscar el objeto mesOrigen completo comparando el array de tarjetas
    const mesOrigenObj = this.elementos.find(m => m.tarjetas === event.previousContainer.data);

    // Almacenar información de la tarjeta y los contenedores de origen y destino
    this.tarjetaMovida = {
      tarjeta: event.item.data,
      mesOrigen: event.previousContainer.data,  // Array de tarjetas del mes origen
      mesDestino: mesDestino,                      // Objeto completo del mes destino
      indexOrigen: event.previousIndex,
      indexDestino: event.currentIndex,
      mesOrigenObj: mesOrigenObj                   // Objeto completo del mes de origen
    };

    // Guardamos también la tarjeta en espera (para usar su idOportunidad luego)
    this.tarjetaEnEspera = this.tarjetaMovida;

    //console.log('Tarjeta en espera de confirmación:', this.tarjetaMovida);


//****************ESTA LOGICA ES APRA CALCULAR FECHA */
    // Usar las propiedades numéricas ya definidas en el objeto mes destino
    const mesDestinoNumero = mesDestino.mes;  // Ejemplo: 2 para febrero (si es 1-indexado)
    const anioDestino = mesDestino.anio;

    //console.log('Mes destino:', mesDestino.nombre, 'Número del mes destino:', mesDestinoNumero, 'Año destino:', anioDestino);

    // Validar que el mes destino y el año sean correctos
    if (mesDestinoNumero < 1 || mesDestinoNumero > 12 || anioDestino < 1000 || anioDestino > 9999) {
      console.error('Mes o año inválido:', mesDestinoNumero, anioDestino);
      this.mostrarModal = false;
      return;
    }

    // Calcular el último día del mes destino usando la función getUltimoDiaDelMes
    this.fechaSeleccionada = this.getUltimoDiaDelMes(mesDestinoNumero, anioDestino);
    console.log('Último día del mes destino:', this.fechaSeleccionada);

//****************ESTA LOGICA ES APRA CALCULAR FECHA */

// Mostrar el modal de confirmación
    this.mostrarModal = true;
  }

  // Método para obtener el último día de un mes dado un número de mes (1-indexado) y un año
  getUltimoDiaDelMes(mes: number, anio: number): string {
    // new Date(anio, mes, 0) devuelve el último día del mes dado
    const fecha = new Date(anio, mes, 0);
    return fecha.toISOString().split('T')[0];
  }

  // Método para cancelar el movimiento (cierra el modal y resetea la tarjeta movida)
  cancelar() {
    console.log('Movimiento cancelado');
    this.tarjetaMovida = null;
    this.mostrarModal = false;
  }

  // Método que se ejecuta al confirmar (guardar) la fecha en el modal
  guardarFecha() {
    if (this.tarjetaMovida) {
      // Transferir la tarjeta del array de tarjetas del mes origen al del mes destino
      transferArrayItem(
        this.tarjetaMovida.mesOrigen,
        this.tarjetaMovida.mesDestino.tarjetas,
        this.tarjetaMovida.indexOrigen,
        this.tarjetaMovida.indexDestino
      );
      console.log('Movimiento confirmado:', this.tarjetaMovida);

      // Asignar el idOportunidad de la tarjeta arrastrada a la variable idOportunidadTarjeta
      if (this.tarjetaEnEspera && this.tarjetaEnEspera.tarjeta) {
        this.idOportunidadTarjeta = this.tarjetaEnEspera.tarjeta.idOportunidad;//con esto asigno el id a la tarjeta q voy a guardar
        console.log("Número de oportunidad asignado:", this.idOportunidadTarjeta);
      } else {
        console.warn("No hay tarjeta en espera.");
      }

      // Llamar al servicio para actualizar la fecha estimada de cierre (POST)
      this.actualizarPostOportunidadPorMesTarjeta();

    }

    this.tarjetaMovida = null;
    this.mostrarModal = false;
    this.actualizarExpansiones();
  }


  // Método para actualizar la propiedad 'expandido' de cada mes,
  // asegurando que solo los 4 últimos sean expandidos
  actualizarExpansiones() {
    const total = this.elementos.length;
    this.elementos.forEach((mes, index) => {
      mes.expandido = index >= total - 4;
    });
  }



  // Método que retorna la clase CSS para el nombre de la empresa, basado en la longitud de nombre y abreviatura
  getClaseNombreEmpresa(nombreEmpresa: string, nombreAbrev: string): string {
    const cantNombre = nombreEmpresa.length;
    const cantAbrev = nombreAbrev.length;
    if (cantNombre >= 30 && cantAbrev >= 4) {
      return 'clsNomEmpresa116';
    } else if (cantNombre >= 30 && cantAbrev < 4) {
      return 'clsNomEmpresa125';
    } else {
      return 'clsNomEmpresa';
    }
  }

  // Método para enviar el request POST para actualizar la fecha estimada de cierre
  actualizarPostOportunidadPorMesTarjeta() {

    // Construir el objeto request con la interfaz RequestActualizarFechaEstimadaCierre
    const request: RequestActualizarFechaEstimadaCierre = {
      bandera: "UPD-FECHAESTIMADA",
      idOportunidad: this.idOportunidadTarjeta,
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      // Convertir fechaSeleccionada (string) a Date; si la API espera Date o un string en formato ISO
      fechaEstimadaCierre: new Date(this.fechaSeleccionada),
      idUsuario: this.loginService.obtenerIdUsuario(),
    };

    //console.log("RequestActualizarFechaEstimadaCierre:", request);

    this.oportunidadService.postOportunidadPorMesTarjeta(request).subscribe({
      next: (result: baseOut) => {
        // Emitir el resultado mediante el EventEmitter
        this.result.emit(result);
        // Actualizar la lista de oportunidades
        this.getOportunidadesPorMes();
        //console.log("getOportunidadesPorMes actualizado");
      },
      error: (error: baseOut) => {
        // Mostrar mensaje de error con MessageService de PrimeNG
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        //console.log("error.errorMessage:" + error.errorMessage);
      },
    });
  }

  // Suma todos los montos de las tarjetas del mes
getTotalMonto(mes: OportunidadesPorMes): number {
  return mes.tarjetas.reduce((acc, tarjeta) => acc + (tarjeta.monto || 0), 0);
}

// Suma todos los montos normalizados de las tarjetas del mes
getTotalNormalizado(mes: OportunidadesPorMes): number {
  return mes.tarjetas.reduce((acc, tarjeta) => acc + (tarjeta.montoNormalizado || 0), 0);
}

onModalClose() {
 // this.modalEditarVisible = false;
 console.log('Modal cerrado');
 this.getOportunidadesPorMes();
}

manejarResultado(result: baseOut) {
  if (result.result) {
    this.messageService.add({
      severity: 'success',
      summary: 'La operación se realizó con éxito.',
      detail: result.errorMessage,
    });
    this.getOportunidadesPorMes();
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Se ha producido un error.',
      detail: result.errorMessage,
    });
  }
}
private crearNuevaLicencia(licencia: Tarjeta) {
  return {
    idOportunidad: licencia.idOportunidad,
    nombreEmpresa: licencia.nombreEmpresa,
    nombreAbrev: licencia.nombreAbrev,
    nombreOportunidad: licencia.nombreOportunidad,
    monto: licencia.monto,
    probabilidad: licencia.probabilidad,
    montoNormalizado: licencia.montoNormalizado,
    imagen: licencia.imagen,
    nombreEjecutivo: licencia.nombreEjecutivo,
    iniciales: licencia.iniciales,
    descripcion: licencia.descripcion,
    fechaEstimadaCierre: licencia.fechaEstimadaCierre,
    idTipoProyecto: licencia.idTipoProyecto,
    nombreContacto: licencia.nombreContacto,
    entrega: licencia.entrega,
    fechaEstimadaCierreOriginal: licencia.fechaEstimadaCierreOriginal,
    idEstatusOportunidad: licencia.idEstatusOportunidad,
    comentario: licencia.comentario,
    idProspecto: licencia.idProspecto,
    idStage: licencia.idStage,
    idTipoEntrega: licencia.idTipoEntrega,
    idEjecutivo: licencia.idEjecutivo,
    idContactoProspecto: licencia.idContactoProspecto,
    totalComentarios: licencia.totalComentarios,
    idEmpresa: this.loginService.obtenerIdEmpresa(),
    idUsuario: this.loginService.obtenerIdUsuario(),
    stage: licencia.stage,
    nombre: licencia.nombre
  };
}
actualiza(licencia: Tarjeta) {
    this.modalOportunidadesService.openModal(true, false, [], licencia);
    this.oportunidadSeleccionada = this.crearNuevaLicencia(licencia);
    this.insertar = false;
    this.modalEditarVisible = true;
}

seguimiento(licencia: Tarjeta) {

  this.oportunidadSeleccionada = this.crearNuevaLicencia(licencia);;
  this.seguimientoOportunidad = true;
  this.modalSeguimientoVisible = true;
}

}
