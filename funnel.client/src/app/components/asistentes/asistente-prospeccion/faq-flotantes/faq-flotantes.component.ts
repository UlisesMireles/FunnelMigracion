import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OpenIaService } from '../../../../services/asistentes/openIA.service';
import { Faq } from '../../../../interfaces/asistentes/pregunta';
@Component({
  selector: 'app-faq-flotantes',
  standalone: false,
  templateUrl: './faq-flotantes.component.html',
  styleUrl: './faq-flotantes.component.css'
})

export class FaqFlotantesComponent {
 //@Input() mostrarFaqs = false;
 private _mostrarFaqs = false;
 @Output() preguntaSeleccionada = new EventEmitter<string>();
 @Output() cerrar = new EventEmitter<void>();
 
faqs: Faq[] = [];
todasLasFaqs: Faq[] = [];
paginaActual: number = 0;
faqsPorPagina: number = 8;
totalPaginas: number = 0;

constructor(private openIaService: OpenIaService) {}
  ngOnInit() {
    const idBot= 7;
    this.obtenerFaqs(idBot);
  }
  @Input()
  set mostrarFaqs(value: boolean) {
    this._mostrarFaqs = value;
    if (value) {
      this.cargarPagina(0); 
    }
  }
  get mostrarFaqs() {
    return this._mostrarFaqs;
  }
   obtenerFaqs(idBot: number) {
    this.openIaService.obtenerFaq(idBot).subscribe({
      next: (data: any) => {
        this.todasLasFaqs = data;
        this.totalPaginas = Math.ceil(this.todasLasFaqs.length / this.faqsPorPagina);
        this.cargarPagina(0);
      },
      error: (error) => {
        console.error('Error al obtener FAQs:', error);
      }
    });
  }

  cerrarFaqs() {
    this.mostrarFaqs = false;
    this.cerrar.emit();
  }
  cargarPagina(pagina: number) {
    const inicio = pagina * this.faqsPorPagina;
    const fin = inicio + this.faqsPorPagina;
    this.faqs = this.todasLasFaqs.slice(inicio, fin);
    this.paginaActual = pagina;
  }

  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.cargarPagina(this.paginaActual - 1);
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.cargarPagina(this.paginaActual + 1);
    }
  }
  /*generarPreguntasAleatorias() {
    const preguntasAleatorias = this.todasLasFaqs
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    this.faqs = preguntasAleatorias.map(faq => ({
        pregunta: faq.pregunta,
        respuesta: faq.respuesta
    }));
  }*/

  enviarPregunta(pregunta: string) {
    this.preguntaSeleccionada.emit(pregunta);
    this.cerrar.emit();
  }
}
