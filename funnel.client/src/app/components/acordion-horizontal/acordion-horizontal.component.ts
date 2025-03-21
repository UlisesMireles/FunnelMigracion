import {
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
  selector: 'app-acordion-horizontal',
  standalone: false,
  templateUrl: './acordion-horizontal.component.html',
  styleUrl: './acordion-horizontal.component.css'
})
export class AcordionHorizontalComponent {


  elementos: any[] = [
    {
      nombre: 'Enero', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Centro de IA',
          NombreAbrev: 'CIA',
          NombreOportunidad: 'Chat Bot Empresarial',
          Monto: 450000,
          Probabilidad: '40%',
          MontoNormalizado: 180000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Juan Pérez',
          iniciales: 'JP',
          descripcion: 'Desarrollo de un chatbot para automatización empresarial.'
        },
        {
          NombreEmpresa: 'E-Commerce',
          NombreAbrev: 'ECOM',
          NombreOportunidad: 'Tienda en línea moderna',
          Monto: 200000,
          Probabilidad: '20%',
          MontoNormalizado: 160000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'María Gómez',
          iniciales: 'MG',
          descripcion: 'Creación de una tienda en línea con capacidades de comercio internacional.'
        }
      ]
    },
    {
      nombre: 'Febrero', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Análisis de Datos',
          NombreAbrev: 'AD',
          NombreOportunidad: 'Inteligencia de Negocios',
          Monto: 600000,
          Probabilidad: '35%',
          MontoNormalizado: 390000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Carlos Rodríguez',
          iniciales: 'CR',
          descripcion: 'Implementación de un sistema de inteligencia empresarial basado en datos.'
        }
      ]
    },
    {
      nombre: 'Marzo', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Automatización RPA',
          NombreAbrev: 'RPA',
          NombreOportunidad: 'Flujos de trabajo inteligentes',
          Monto: 300000,
          Probabilidad: '25%',
          MontoNormalizado: 225000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Laura Martínez',
          iniciales: 'LM',
          descripcion: 'Automatización de procesos a través de RPA para mejorar la eficiencia.'
        },
        {
          NombreEmpresa: 'Redes Sociales IA',
          NombreAbrev: 'RSIA',
          NombreOportunidad: 'Análisis predictivo',
          Monto: 150000,
          Probabilidad: '30%',
          MontoNormalizado: 105000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Pedro Sánchez',
          iniciales: 'PS',
          descripcion: 'Uso de inteligencia artificial para prever tendencias en redes sociales.'
        },
        {
          NombreEmpresa: 'CRM Inteligente',
          NombreAbrev: 'CRM',
          NombreOportunidad: 'Gestión avanzada de clientes',
          Monto: 500000,
          Probabilidad: '20%',
          MontoNormalizado: 400000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Ana López',
          iniciales: 'AL',
          descripcion: 'Mejora en la gestión de relaciones con clientes mediante un CRM inteligente.'
        }
      ]
    },
    {
      nombre: 'Abril', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Desarrollo Web',
          NombreAbrev: 'DW',
          NombreOportunidad: 'Sitios web personalizados',
          Monto: 800000,
          Probabilidad: '15%',
          MontoNormalizado: 680000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Luis Torres',
          iniciales: 'LT',
          descripcion: 'Desarrollo de sitios web personalizados para clientes de diversos sectores.'
        },
        {
          NombreEmpresa: 'Marketing Digital',
          NombreAbrev: 'MD',
          NombreOportunidad: 'Estrategias de marketing efectivas',
          Monto: 400000,
          Probabilidad: '20%',
          MontoNormalizado: 320000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Sofía Hernández',
          iniciales: 'SH',
          descripcion: 'Creación de campañas digitales para mejorar la presencia online.'
        },
        {
          NombreEmpresa: 'Análisis de Datos',
          NombreAbrev: 'AD',
          NombreOportunidad: 'Inteligencia de Negocios',
          Monto: 600000,
          Probabilidad: '35%',
          MontoNormalizado: 390000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Carlos Rodríguez',
          iniciales: 'CR',
          descripcion: 'Solución avanzada de inteligencia de negocios utilizando análisis de datos.'
        },
        {
          NombreEmpresa: 'Redes Sociales IA',
          NombreAbrev: 'RSIA',
          NombreOportunidad: 'Análisis predictivo',
          Monto: 150000,
          Probabilidad: '30%',
          MontoNormalizado: 105000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Pedro Sánchez',
          iniciales: 'PS',
          descripcion: 'Utilización de IA para analizar datos de redes sociales y predecir comportamientos.'
        },
        {
          NombreEmpresa: 'CRM Inteligente',
          NombreAbrev: 'CRM',
          NombreOportunidad: 'Gestión avanzada de clientes',
          Monto: 500000,
          Probabilidad: '20%',
          MontoNormalizado: 400000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Ana López',
          iniciales: 'AL',
          descripcion: 'Implementación de un sistema CRM para optimizar la relación con los clientes.'
        },
        {
          NombreEmpresa: 'Automatización RPA',
          NombreAbrev: 'RPA',
          NombreOportunidad: 'Flujos de trabajo inteligentes',
          Monto: 300000,
          Probabilidad: '25%',
          MontoNormalizado: 225000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Laura Martínez',
          iniciales: 'LM',
          descripcion: 'Implementación de flujos de trabajo automatizados para reducir costos operativos.'
        }
      ]
    },
    {
      nombre: 'Mayo', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Seguridad Informática',
          NombreAbrev: 'SI',
          NombreOportunidad: 'Protección avanzada contra ciberataques',
          Monto: 700000,
          Probabilidad: '50%',
          MontoNormalizado: 350000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Ricardo Silva',
          iniciales: 'RS',
          descripcion: 'Implementación de un sistema de seguridad avanzado para proteger datos empresariales.'
        },
        {
          NombreEmpresa: 'Consultoría Empresarial',
          NombreAbrev: 'CE',
          NombreOportunidad: 'Optimización de procesos internos',
          Monto: 350000,
          Probabilidad: '60%',
          MontoNormalizado: 210000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Elena Ruiz',
          iniciales: 'ER',
          descripcion: 'Asesoría para mejorar la eficiencia operativa y los procesos internos.'
        }
      ]
    },
    {
      nombre: 'Junio', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Desarrollo de Software',
          NombreAbrev: 'DS',
          NombreOportunidad: 'Aplicación móvil innovadora',
          Monto: 900000,
          Probabilidad: '70%',
          MontoNormalizado: 630000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Javier Gómez',
          iniciales: 'JG',
          descripcion: 'Desarrollo de una app móvil para mejorar la interacción con los clientes.'
        },
        {
          NombreEmpresa: 'IA en la Nube',
          NombreAbrev: 'IAC',
          NombreOportunidad: 'Plataforma de IA para análisis en tiempo real',
          Monto: 500000,
          Probabilidad: '45%',
          MontoNormalizado: 225000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Cristina Pérez',
          iniciales: 'CP',
          descripcion: 'Implementación de una plataforma de IA para mejorar los procesos en la nube.'
        }
      ]
    },
    {
      nombre: 'Julio', expandido: false, tarjetas: [
        {
          NombreEmpresa: 'Energías Renovables',
          NombreAbrev: 'ER',
          NombreOportunidad: 'Soluciones sostenibles para empresas',
          Monto: 1100000,
          Probabilidad: '65%',
          MontoNormalizado: 715000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Fernando Torres',
          iniciales: 'FT',
          descripcion: 'Desarrollo de soluciones energéticas sostenibles para grandes empresas.'
        },
        {
          NombreEmpresa: 'Gestión de Proyectos',
          NombreAbrev: 'GP',
          NombreOportunidad: 'Implementación de software de gestión',
          Monto: 300000,
          Probabilidad: '55%',
          MontoNormalizado: 165000,
          imagen: 'https://via.placeholder.com/150',
          nombreEjecutivo: 'Marta Pérez',
          iniciales: 'MP',
          descripcion: 'Optimización de la gestión de proyectos mediante software especializado.'
        }
      ]
    }
  ];


  connectedDropLists: string[] = [];

  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  tarjetaMovida: any;  // Tarjeta que fue movida
  fechaSeleccionada: string = '';  // Variable para almacenar la fecha seleccionada
  today: string = new Date().toISOString().split('T')[0];  // Fecha actual en formato YYYY-MM-DD
  idOportunidad: number = 0;  // Simulación del input oculto

  // ngOnInit() {
  //   this.connectedDropLists = this.elementos.map((_, i) => `todoList${i}`);
  // }

  ngOnInit() {
    this.connectedDropLists = this.elementos.map((_, i) => `todoList${i}`);

    // Expandir los últimos 4 elementos si hay al menos 4 elementos en la lista
    const MontoNormalizadoElementos = this.elementos.length;
    this.elementos.forEach((mes, index) => {
      mes.expandido = index >= MontoNormalizadoElementos - 4; // Solo los últimos 4 se expanden
    });
  }

  alternarItem(item: any, event: Event) {
    event.stopPropagation(); // Evita que otros clics afecten
    item.expandido = !item.expandido;
  }
 // Método que maneja el movimiento de la tarjeta


 drop(event: any, mesDestino: any) {
  if (event.previousContainer === event.container) {
    return; // No hacer nada si es el mismo contenedor
  }

  // Guardamos la información sin mover la tarjeta aún
  this.tarjetaMovida = {
    tarjeta: event.item.data,
    mesOrigen: event.previousContainer.data,
    mesDestino: mesDestino,
    indexOrigen: event.previousIndex,
    indexDestino: event.currentIndex
  };

  console.log('Tarjeta en espera de confirmación:', this.tarjetaMovida);

  this.fechaSeleccionada = this.today;
  this.mostrarModal = true;
}

// Guardar fecha y confirmar el movimiento
guardarFecha() {
  if (this.tarjetaMovida) {
    // Transferir la tarjeta al mes de destino
    transferArrayItem(
      this.tarjetaMovida.mesOrigen,
      this.tarjetaMovida.mesDestino.tarjetas,
      this.tarjetaMovida.indexOrigen,
      this.tarjetaMovida.indexDestino
    );

    console.log('Movimiento confirmado:', this.tarjetaMovida);
  }

  // Limpiar y cerrar modal
  this.tarjetaMovida = null;
  this.mostrarModal = false;
}

// Cancelar y descartar el movimiento
cancelar() {
  console.log('Movimiento cancelado');
  this.tarjetaMovida = null;
  this.mostrarModal = false;
}
}
