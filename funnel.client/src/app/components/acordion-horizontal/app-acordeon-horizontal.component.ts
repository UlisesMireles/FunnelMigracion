import { transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OportunidadesPorMes } from '../../interfaces/oportunidades';
import { LoginService } from '../../services/login.service';
import { OportunidadesService } from '../../services/oportunidades.service';

@Component({
  selector: 'app-acordeon-horizontal',
  standalone: false,
  templateUrl: './app-acordeon-horizontal.component.html',
  styleUrls: ['./app-acordeon-horizontal.component.css']
})
export class AcordeonHorizontalComponent {

  // Tu objeto de meses (OportunidadesPorMes) se carga en getOportunidadesPorMes()
  elementos: OportunidadesPorMes[] = [];

  loading: boolean = true;
  errorMessage: string = '';
  connectedDropLists: string[] = [];
  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  tarjetaMovida: any;            // Tarjeta que fue movida (y sus datos)
  fechaSeleccionada: string = '';  // Fecha que se asignará en el modal
  today: string = new Date().toISOString().split('T')[0];
  idOportunidad: number = 0;

  // Variable auxiliar para llevar el seguimiento del último mes agregado (nombre y año)
  ultimoMesAgregado: string = '';

  constructor(
    private oportunidadService: OportunidadesService,
    private readonly loginService: LoginService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getOportunidadesPorMes();
  }

  getOportunidadesPorMes() {
    this.oportunidadService.getOportunidadesPorMes(this.loginService.obtenerIdEmpresa(), this.loginService.obtenerIdUsuario()).subscribe({
      next: (result: OportunidadesPorMes[]) => {
        this.elementos = [...result];
        // Aseguramos que cada mes tenga tarjetas inicializadas
        this.elementos.forEach(mes => {
          if (!Array.isArray(mes.tarjetas)) {
            mes.tarjetas = [];
          }
        });
        // Inicializa connectedDropLists
        this.connectedDropLists = this.elementos.map((_, i) => `todoList${i}`);

        // Establecer el último mes agregado (tomando el último elemento)
        if (this.elementos.length > 0) {
          this.ultimoMesAgregado = `${this.elementos[this.elementos.length - 1].nombre} ${this.elementos[this.elementos.length - 1].anio}`;
        } else {
          this.ultimoMesAgregado = 'Enero 2025';
        }

        this.actualizarExpansiones();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      },
    });
  }

  alternarItem(item: any, event: Event) {
    event.stopPropagation();
    item.expandido = !item.expandido;
  }

  drop(event: any, mesDestino: OportunidadesPorMes) {
    if (event.previousContainer === event.container) {
      return;
    }

    // Buscar el objeto mesOrigen completo usando la referencia al array de tarjetas
    const mesOrigenObj = this.elementos.find(m => m.tarjetas === event.previousContainer.data);

    this.tarjetaMovida = {
      tarjeta: event.item.data,
      mesOrigen: event.previousContainer.data,  // Array de tarjetas del mes de origen
      mesDestino: mesDestino,                      // Objeto completo del mes de destino
      indexOrigen: event.previousIndex,
      indexDestino: event.currentIndex,
      mesOrigenObj: mesOrigenObj
    };

    console.log('Tarjeta en espera de confirmación:', this.tarjetaMovida);

    // Usamos las propiedades numéricas ya definidas en el objeto:
    const mesDestinoNumero = mesDestino.mes;
    const anioDestino = mesDestino.anio;

    console.log('Mes destino:', mesDestino.nombre, 'Número del mes destino:', mesDestinoNumero, 'Año destino:', anioDestino);

    if (mesDestinoNumero < 1 || mesDestinoNumero > 12 || anioDestino < 1000 || anioDestino > 9999) {
      console.error('Mes o año inválido:', mesDestinoNumero, anioDestino);
      this.mostrarModal = false;
      return;
    }

    // Obtener el último día del mes destino (como mes es 1-indexado, usar new Date(anio, mes, 0))
    this.fechaSeleccionada = this.getUltimoDiaDelMes(mesDestinoNumero, anioDestino);
    console.log('Último día del mes destino:', this.fechaSeleccionada);

    this.mostrarModal = true;
  }

  getUltimoDiaDelMes(mes: number, anio: number): string {
    // Como 'mes' es 1-indexado (1 para enero), para obtener el último día del mes usamos:
    const fecha = new Date(anio, mes, 0);
    return fecha.toISOString().split('T')[0];
  }

  cancelar() {
    console.log('Movimiento cancelado');
    this.tarjetaMovida = null;
    this.mostrarModal = false;
  }

  guardarFecha() {
    if (this.tarjetaMovida) {
      // Transferir la tarjeta del mes de origen al mes de destino
      transferArrayItem(
        this.tarjetaMovida.mesOrigen,
        this.tarjetaMovida.mesDestino.tarjetas,
        this.tarjetaMovida.indexOrigen,
        this.tarjetaMovida.indexDestino
      );
      console.log('Movimiento confirmado:', this.tarjetaMovida);

      // --- Eliminamos los meses vacíos solo de los últimos 4 visibles ---
      // Obtenemos los últimos 4 meses de la lista
      let visibles = this.elementos.slice(-4);
      // Eliminamos de izquierda a derecha mientras estén vacíos
      while (visibles.length > 0 && visibles[0].tarjetas.length === 0) {
        const mesAEliminar = visibles[0];
        const idx = this.elementos.indexOf(mesAEliminar);
        if (idx !== -1) {
          console.log(`Eliminando mes vacío: ${mesAEliminar.nombre} ${mesAEliminar.anio}`);
          this.elementos.splice(idx, 1);
        }
        visibles = this.elementos.slice(-4);
      }

      console.log("Lista después de eliminar vacíos:", this.elementos.map(m => `${m.nombre} ${m.anio}`));

      // --- Agregar nuevos meses hasta tener 4 visibles ---
      // Aquí, para agregar meses nuevos, usamos el último mes actual de la lista.
      while (this.elementos.length < 4) {
        const nuevoMes = this.obtenerSiguienteMes();
        if (nuevoMes) {
          this.elementos.push(nuevoMes);
          console.log(`Nuevo mes añadido: ${nuevoMes.nombre} ${nuevoMes.anio}`);
        } else {
          break;
        }
      }

      // Actualizamos la variable auxiliar con el último mes de la lista
      if (this.elementos.length > 0) {
        const ultimo = this.elementos[this.elementos.length - 1];
        this.ultimoMesAgregado = `${ultimo.nombre} ${ultimo.anio}`;
      }
      console.log("Lista final de meses:", this.elementos.map(m => `${m.nombre} ${m.anio}`));
    }

    this.tarjetaMovida = null;
    this.mostrarModal = false;
    this.actualizarExpansiones();
  }

  actualizarExpansiones() {
    const total = this.elementos.length;
    this.elementos.forEach((mes, index) => {
      mes.expandido = index >= total - 4;
    });
  }

  obtenerSiguienteMes(): any {
    // Lista de meses en orden cronológico
    const mesesSecuencia = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Obtener el último mes actual en la lista
    const ultimoElemento = this.elementos[this.elementos.length - 1];
    const mesActual = ultimoElemento.nombre; // Ejemplo: "Julio"
    const anioActual = ultimoElemento.anio;    // Ejemplo: 2025

    const index = mesesSecuencia.indexOf(mesActual);
    let nuevoMes = '';
    let nuevoAnio = anioActual;

    if (index !== -1 && index < mesesSecuencia.length - 1) {
      nuevoMes = mesesSecuencia[index + 1]; // Siguiente mes
    } else {
      nuevoMes = 'Enero'; // Si el último es diciembre, reinicia en enero
      nuevoAnio += 1;
    }

    return {
      nombre: nuevoMes,
      anio: nuevoAnio,
      tarjetas: [],
      expandido: false
    };
  }

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
}
