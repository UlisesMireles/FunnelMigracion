import {
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
  selector: 'app-acordeon-horizontal',
  standalone: false,
  templateUrl: './app-acordeon-horizontal.component.html',
  styleUrl: './app-acordeon-horizontal.component.css'
})
export class AcordeonHorizontalComponent {


  elementos: any[] = [
    {
      nombre: 'Enero', anio: '2025 ',expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Centro de IA',
          NombreAbrev: 'CIA',
          NombreOportunidad: 'Chat Bot Empresarial',
          Monto: 450000,
          Probabilidad: '40',
          MontoNormalizado: 180000,
          imagen: 'assets/Fotografia/AlejandraCano_2.jpg',
          nombreEjecutivo: 'Juan Pérez',
          iniciales: 'JP',
          descripcion: 'Desarrollo de un chatbot para automatización empresarial.'
        },
        {
          NombreEmpresa: 'E-Commerce',
          NombreAbrev: 'ECOM',
          NombreOportunidad: 'Tienda en línea moderna',
          Monto: 200000,
          Probabilidad: '20',
          MontoNormalizado: 160000,
          imagen: 'assets/Fotografia/INGE.jpg',
          nombreEjecutivo: 'María Gómez',
          iniciales: 'MG',
          descripcion: 'Creación de una tienda en línea con capacidades de comercio internacional.'
        }
      ]
    },
    {
      nombre: 'Febrero',  anio: '2025 ',expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Análisis de Datos',
          NombreAbrev: 'AD',
          NombreOportunidad: 'Inteligencia de Negocios',
          Monto: 600000,
          Probabilidad: '35',
          MontoNormalizado: 390000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Carlos Rodríguez',
          iniciales: 'CR',
          descripcion: 'Implementación de un sistema de inteligencia empresarial basado en datos.'
        }
      ]
    },
    {
      nombre: 'Marzo',  anio: '2025 ',expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Automatización RPA',
          NombreAbrev: 'RPA',
          NombreOportunidad: 'Flujos de trabajo inteligentes',
          Monto: 300000,
          Probabilidad: '25',
          MontoNormalizado: 225000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Laura Martínez',
          iniciales: 'LM',
          descripcion: 'Automatización de procesos a través de RPA para mejorar la eficiencia.'
        },
        {
          NombreEmpresa: 'Redes Sociales IA',
          NombreAbrev: 'RSIA',
          NombreOportunidad: 'Análisis predictivo',
          Monto: 150000,
          Probabilidad: '30',
          MontoNormalizado: 105000,
          imagen: 'assets/Fotografia/UlisesMireles_1.jpg',
          nombreEjecutivo: 'Pedro Sánchez',
          iniciales: 'PS',
          descripcion: 'Uso de inteligencia artificial para prever tendencias en redes sociales.'
        },
        {
          NombreEmpresa: 'CRM Inteligente',
          NombreAbrev: 'CRM',
          NombreOportunidad: 'Gestión avanzada de clientes',
          Monto: 500000,
          Probabilidad: '20',
          MontoNormalizado: 400000,
          imagen: 'assets/Fotografia/UlisesMireles_1.jpg',
          nombreEjecutivo: 'Ana López',
          iniciales: 'AL',
          descripcion: 'Mejora en la gestión de relaciones con clientes mediante un CRM inteligente.'
        }
      ]
    },
    {
      nombre: 'Abril', anio: '2025 ', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Desarrollo Web',
          NombreAbrev: 'DW',
          NombreOportunidad: 'Sitios web personalizados',
          Monto: 800000,
          Probabilidad: '15',
          MontoNormalizado: 680000,
          imagen: 'assets/Fotografia/AlejandraCano_2.jpg',
          nombreEjecutivo: 'Luis Torres',
          iniciales: 'LT',
          descripcion: 'Desarrollo de sitios web personalizados para clientes de diversos sectores.'
        // }
        }
      ]
    },
    {
      nombre: 'Mayo',  anio: '2025 ',expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Seguridad Informática',
          NombreAbrev: 'SI',
          NombreOportunidad: 'Protección avanzada contra ciberataques',
          Monto: 700000,
          Probabilidad: '50',
          MontoNormalizado: 350000,
          imagen: 'assets/Fotografia/AlejandraCano_2.jpg',
          nombreEjecutivo: 'Ricardo Silva',
          iniciales: 'RS',
          descripcion: 'Implementación de un sistema de seguridad avanzado para proteger datos empresariales.'
        },
        {
          NombreEmpresa: 'Consultoría Empresarial',
          NombreAbrev: 'CE',
          NombreOportunidad: 'Optimización de procesos internos',
          Monto: 350000,
          Probabilidad: '60',
          MontoNormalizado: 210000,
          imagen: 'assets/Fotografia/UlisesMireles_1.jpg',
          nombreEjecutivo: 'Elena Ruiz',
          iniciales: 'ER',
          descripcion: 'Asesoría para mejorar la eficiencia operativa y los procesos internos.'
        }
      ]
    },
    {
      nombre: 'Junio',  anio: '2025 ',expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Desarrollo de Software',
          NombreAbrev: 'DS',
          NombreOportunidad: 'Aplicación móvil innovadora',
          Monto: 900000,
          Probabilidad: '70',
          MontoNormalizado: 630000,
          imagen: 'assets/Fotografia/UlisesMireles_1.jpg',
          nombreEjecutivo: 'Javier Gómez',
          iniciales: 'JG',
          descripcion: 'Desarrollo de una app móvil para mejorar la interacción con los clientes.'
        },
        {
          NombreEmpresa: 'IA en la Nube',
          NombreAbrev: 'IAC',
          NombreOportunidad: 'Plataforma de IA para análisis en tiempo real',
          Monto: 500000,
          Probabilidad: '45',
          MontoNormalizado: 225000,
          imagen: 'assets/Fotografia/UlisesMireles_1.jpg',
          nombreEjecutivo: 'Cristina Pérez',
          iniciales: 'CP',
          descripcion: 'Implementación de una plataforma de IA para mejorar los procesos en la nube.'
        }
      ]
    },
    {
      nombre: 'Julio',  anio: '2025 ',expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Energías Renovables',
          NombreAbrev: 'ER',
          NombreOportunidad: 'Soluciones sostenibles para empresas',
          Monto: 1100000,
          Probabilidad: '65',
          MontoNormalizado: 715000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Fernando Torres',
          iniciales: 'FT',
          descripcion: 'Desarrollo de soluciones energéticas sostenibles para grandes empresas.'
        },
        {
          NombreEmpresa: 'Gestión de Proyectos',
          NombreAbrev: 'GP',
          NombreOportunidad: 'Implementación de software de gestión',
          Monto: 300000,
          Probabilidad: '55',
          MontoNormalizado: 165000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Marta Pérez',
          iniciales: 'MP',
          descripcion: 'Optimización de la gestión de proyectos mediante software especializado.'
        }
      ]
    },
    {
      nombre: 'Agosto', anio: '2025 ', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Análisis de Datos',
          NombreAbrev: 'AD',
          NombreOportunidad: 'Inteligencia de Negocios',
          Monto: 600000,
          Probabilidad: '35',
          MontoNormalizado: 390000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Carlos Rodríguez',
          iniciales: 'CR',
          descripcion: 'Implementación de un sistema de inteligencia empresarial basado en datos.'
        }
      ]
    },
    {
      nombre: 'Septiembre', anio: '2025 ', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Automatización RPA',
          NombreAbrev: 'RPA',
          NombreOportunidad: 'Flujos de trabajo inteligentes',
          Monto: 300000,
          Probabilidad: '25',
          MontoNormalizado: 225000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Laura Martínez',
          iniciales: 'LM',
          descripcion: 'Automatización de procesos a través de RPA para mejorar la eficiencia.'
        },
        {
          NombreEmpresa: 'Redes Sociales IA',
          NombreAbrev: 'RSIA',
          NombreOportunidad: 'Análisis predictivo',
          Monto: 150000,
          Probabilidad: '30',
          MontoNormalizado: 105000,
          imagen: 'assets/Fotografia/UlisesMireles_1.jpg',
          nombreEjecutivo: 'Pedro Sánchez',
          iniciales: 'PS',
          descripcion: 'Uso de inteligencia artificial para prever tendencias en redes sociales.'
        },
        {
          NombreEmpresa: 'CRM Inteligente',
          NombreAbrev: 'CRM',
          NombreOportunidad: 'Gestión avanzada de clientes',
          Monto: 500000,
          Probabilidad: '20',
          MontoNormalizado: 400000,
          imagen: 'assets/Fotografia/UlisesMireles_1.jpg',
          nombreEjecutivo: 'Ana López',
          iniciales: 'AL',
          descripcion: 'Mejora en la gestión de relaciones con clientes mediante un CRM inteligente.'

        }
      ]
    },
    {
      nombre: 'Octubre', anio: '2025 ', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Análisis de Datos',
          NombreAbrev: 'AD',
          NombreOportunidad: 'Inteligencia de Negocios',
          Monto: 600000,
          Probabilidad: '35',
          MontoNormalizado: 390000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Carlos Rodríguez',
          iniciales: 'CR',
          descripcion: 'Implementación de un sistema de inteligencia empresarial basado en datos.'
        }
      ]
    },
    {
      nombre: 'Noviembre', anio: '2025 ', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Análisis de Datos',
          NombreAbrev: 'AD',
          NombreOportunidad: 'Inteligencia de Negocios',
          Monto: 600000,
          Probabilidad: '35',
          MontoNormalizado: 390000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Carlos Rodríguez',
          iniciales: 'CR',
          descripcion: 'Implementación de un sistema de inteligencia empresarial basado en datos.'
        }
      ]
    },
    {
      nombre: 'Diciembre', anio: '2025 ', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Análisis de Datos',
          NombreAbrev: 'AD',
          NombreOportunidad: 'Inteligencia de Negocios',
          Monto: 600000,
          Probabilidad: '35',
          MontoNormalizado: 390000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Carlos Rodríguez',
          iniciales: 'CR',
          descripcion: 'Implementación de un sistema de inteligencia empresarial basado en datos.'
        }
      ]
    },
    {
      nombre: 'Enero', anio: '2026 ', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Análisis de Datos',
          NombreAbrev: 'AD',
          NombreOportunidad: 'Inteligencia de Negocios',
          Monto: 600000,
          Probabilidad: '35',
          MontoNormalizado: 390000,
          imagen: 'assets/Fotografia/persona_icono_principal.png',
          nombreEjecutivo: 'Carlos Rodríguez',
          iniciales: 'CR',
          descripcion: 'Implementación de un sistema de inteligencia empresarial basado en datos.'
        }
      ]
    }
  ];


  errorMessage: string = '';
  connectedDropLists: string[] = [];
  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  tarjetaMovida: any;  // Tarjeta que fue movida
  fechaSeleccionada: string = '';  // Variable para almacenar la fecha seleccionada
  today: string = new Date().toISOString().split('T')[0];  // Fecha actual en formato YYYY-MM-DD
  idOportunidad: number = 0;  // Simulación del input oculto

   // Variable auxiliar para determinar el siguiente mes a agregar
   ultimoMesAgregado: string='';



   ngOnInit() {
    this.connectedDropLists = this.elementos.map((_, i) => `todoList${i}`);

    // Expandir los últimos 4 elementos si hay al menos 4 elementos en la lista
    const MontoNormalizadoElementos = this.elementos.length;
    this.elementos.forEach((mes, index) => {
      mes.expandido = index >= MontoNormalizadoElementos - 4; // Solo los últimos 4 se expanden aqui se cambia para si no quiero se expandan
    });
  }

  alternarItem(item: any, event: Event) {
    event.stopPropagation();
    item.expandido = !item.expandido;
  }

  // drop(event: any, mesDestino: any) {
  //   if (event.previousContainer === event.container) {
  //     return;
  //   }

  //   // Guardamos la información:
  //   // event.previousContainer.data es el array de tarjetas (mesOrigen.tarjetas)
  //   // Además, buscamos el objeto mesOrigen completo.
  //   const mesOrigenObj = this.elementos.find(m => m.tarjetas === event.previousContainer.data);

  //   this.tarjetaMovida = {
  //     tarjeta: event.item.data,
  //     mesOrigen: event.previousContainer.data,  // Array de tarjetas del mes de origen
  //     mesDestino: mesDestino,                      // Objeto mes de destino
  //     indexOrigen: event.previousIndex,
  //     indexDestino: event.currentIndex,
  //     mesOrigenObj: mesOrigenObj                   // Objeto completo del mes de origen
  //   };

  //   console.log('Tarjeta en espera de confirmación:', this.tarjetaMovida);
  //   this.fechaSeleccionada = this.today;
  //   this.mostrarModal = true;
  // }

  getUltimoDiaDelMes(mes: number, anio: number): string {
    console.log('Recibiendo valores - Mes:', mes, 'Año:', anio);  // Imprimir valores antes de crear la fecha

    // Verificar si el mes y año son válidos
    if (isNaN(mes) || mes < 0 || mes > 11) {
      console.error('Mes inválido:', mes);
      return '';  // Salir si el mes no es válido
    }

    if (isNaN(anio) || anio < 1000 || anio > 9999) {
      console.error('Año inválido:', anio);
      return '';  // Salir si el año no es válido
    }

    // Crear la fecha con el último día del mes
    const fecha = new Date(anio, mes + 1, 0);  // `mes + 1` porque enero es 0 en JavaScript
    if (isNaN(fecha.getTime())) {
      console.error('Fecha inválida:', fecha);
      return '';  // Salir si la fecha es inválida
    }

    console.log('Último día del mes:', fecha.toISOString().split('T')[0]);
    return fecha.toISOString().split('T')[0];
  }
  drop(event: any, mesDestino: any) {
    if (event.previousContainer === event.container) {
      return;
    }

    const mesOrigenObj = this.elementos.find(m => m.tarjetas === event.previousContainer.data);

    this.tarjetaMovida = {
      tarjeta: event.item.data,
      mesOrigen: event.previousContainer.data,
      mesDestino: mesDestino,
      indexOrigen: event.previousIndex,
      indexDestino: event.currentIndex,
      mesOrigenObj: mesOrigenObj
    };

    console.log('Tarjeta en espera de confirmación:', this.tarjetaMovida);

    // Asegúrate de que el año sea un número
    let anioDestino = parseInt(mesDestino.año, 10);
    if (isNaN(anioDestino)) {
      console.error('Año no válido:', mesDestino.año);
      anioDestino = new Date().getFullYear();  // Si el año no es válido, asignamos el año actual
    }

    // Obtener el número de mes y el año del mes destino
    const mesDestinoNumero = this.obtenerMesNumero(mesDestino.nombre);

    console.log('Mes destino:', mesDestino.nombre, 'Número del mes destino:', mesDestinoNumero, 'Año destino:', anioDestino);

    // Verificar que los valores sean válidos
    if (mesDestinoNumero < 0 || anioDestino < 1000 || anioDestino > 9999) {
      console.error('Mes o año inválido:', mesDestinoNumero, anioDestino);
      this.mostrarModal = false;
      return;
    }

    // Obtener el último día del mes destino
    this.fechaSeleccionada = this.getUltimoDiaDelMes(mesDestinoNumero, anioDestino);

    console.log('Último día del mes destino:', this.fechaSeleccionada);

    this.mostrarModal = true;
  }


  obtenerMesNumero(mesNombre: string): number {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Verificar si el mes es válido
    const mesIndex = meses.indexOf(mesNombre);
    if (mesIndex === -1) {
      console.error('Mes no válido:', mesNombre);
      return -1;  // Si el mes no es válido, devolvemos -1
    }

    return mesIndex;  // Devolver el índice del mes
  }



  cancelar() {
    console.log('Movimiento cancelado');
    this.tarjetaMovida = null;
    this.mostrarModal = false;
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
  guardarFecha() {
    if (this.tarjetaMovida) {
      // Transferir la tarjeta usando los arrays (ya que mesOrigen es el array de tarjetas)
      transferArrayItem(
        this.tarjetaMovida.mesOrigen,
        this.tarjetaMovida.mesDestino.tarjetas,
        this.tarjetaMovida.indexOrigen,
        this.tarjetaMovida.indexDestino
      );
      console.log('Movimiento confirmado:', this.tarjetaMovida);

      // Si el mes de origen quedó vacío, y es el primero de los 4 visibles, lo eliminamos
      if (this.tarjetaMovida.mesOrigenObj && this.tarjetaMovida.mesOrigenObj.tarjetas.length === 0) {
        // Solo eliminar si este mes es el primer mes de los últimos 4
        // Suponemos que "los últimos 4" se obtienen con elementos.slice(-4)
        const mesesVisibles = this.elementos.slice(-4);
        if (mesesVisibles[0] === this.tarjetaMovida.mesOrigenObj) {
          const index = this.elementos.findIndex(m => m === this.tarjetaMovida.mesOrigenObj);
          if (index !== -1) {
            console.log(`Mes ${this.tarjetaMovida.mesOrigenObj.nombre} eliminado`);
            this.elementos.splice(index, 1);  // Eliminar el mes vacío
            // Agregar el siguiente mes disponible (dinámicamente)
            const nuevoMes = this.obtenerProximoMes();
            if (nuevoMes) {
              this.elementos.push(nuevoMes);
              console.log(`Nuevo mes añadido: ${nuevoMes.nombre}`);
            }
          }
        }
      }
    }
    this.tarjetaMovida = null;
    this.mostrarModal = false;
    this.actualizarExpansiones();
  }
  actualizarExpansiones() {
    const total = this.elementos.length;
    // Aseguramos que solo los últimos 4 estén expandido
    this.elementos.forEach((mes, index) => {
      mes.expandido = index >= total - 4;
    });
  }

  obtenerProximoMes(): any {
    // Definimos la secuencia de meses completa
    const mesesSecuencia = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Obtener el nombre del último mes actual en la lista de elementos
    const ultimoMesActual = this.elementos[this.elementos.length - 1].nombre;
    const index = mesesSecuencia.indexOf(ultimoMesActual);

    // Obtener el siguiente mes en la secuencia
    const siguienteMes = mesesSecuencia[(index + 1) % 12];

    // Retornar un nuevo objeto mes basado en el siguiente mes disponible
    return {
      nombre: siguienteMes,
      tarjetas: [],
      expandido: false
    };
  }
}
