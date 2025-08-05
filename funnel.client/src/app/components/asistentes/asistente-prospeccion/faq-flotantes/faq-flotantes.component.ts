import { Component, Input, Output, EventEmitter } from '@angular/core';
export interface Faq {
  pregunta: string;
  respuesta: string;
}
@Component({
  selector: 'app-faq-flotantes',
  standalone: false,
  templateUrl: './faq-flotantes.component.html',
  styleUrl: './faq-flotantes.component.css'
})

export class FaqFlotantesComponent {
 @Input() mostrarFaqs = false;
  @Output() preguntaSeleccionada = new EventEmitter<string>();

faqs: Faq[] = [];
todasLasFaqs: Faq[] = [
  { pregunta: '¿Cómo empiezo con LeadsEisei AI?', respuesta: 'Es un sistema para gestionar oportunidades de ventas.' },
  { pregunta: '¿Cómo puedo tener un usuario?', respuesta: 'Solicítalo a tu administrador o equipo de TI.' },
  { pregunta: '¿Cuánto cuesta el funnel?', respuesta: 'Depende del plan contratado.' },
  { pregunta: '¿Cómo se maneja mi información?', respuesta: 'Conforme a nuestra política de privacidad.' },
  { pregunta: '¿Puedo acceder desde el móvil?', respuesta: 'Sí, con conexión a internet y navegador.' },
  { pregunta: '¿Qué tipos de usuarios existen?', respuesta: 'Administrador, Comercial y Cliente.' },
  { pregunta: '¿El sistema tiene soporte?', respuesta: 'Sí, puedes contactarnos por correo o chat.' },
  { pregunta: '¿Qué datos recopila el sistema?', respuesta: 'Solo los necesarios para gestión de ventas.' },
  { pregunta: '¿Se puede integrar con CRM?', respuesta: 'Sí, contamos con APIs para ello.' },
  { pregunta: '¿Cómo reporto un problema?', respuesta: 'Desde el módulo de soporte en el sistema.' }
];
  ngOnInit() {
    this.generarPreguntasAleatorias();
  }

  cerrarFaqs() {
    this.mostrarFaqs = false;
  }

  generarPreguntasAleatorias() {
    const preguntasAleatorias = this.todasLasFaqs
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    this.faqs = preguntasAleatorias.map(faq => ({
        pregunta: faq.pregunta,
        respuesta: faq.respuesta
    }));
  }

  enviarPregunta(pregunta: string) {
    this.preguntaSeleccionada.emit(pregunta);
    this.cerrarFaqs();
  }
}
