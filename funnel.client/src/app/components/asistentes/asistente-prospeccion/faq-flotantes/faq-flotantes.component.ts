import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OpenIaService } from '../../../../services/asistentes/openIA.service';
import { Faq, Categoria, PaginaFaqs } from '../../../../interfaces/asistentes/pregunta';
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
 
todasLasFaqs: Faq[] = [];
faqsAgrupadas: PaginaFaqs[] = [];
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
      this.paginaActual = 0;
    }
  }
  get mostrarFaqs() {
    return this._mostrarFaqs;
  }
  obtenerFaqs(idBot: number) {
    this.openIaService.obtenerFaq(idBot).subscribe({
      next: (data: any) => {
        this.todasLasFaqs = data.filter((faq: Faq) => faq.idCategoria !== 15);
        this.agruparFaqsPorCategoria();
      },
      error: (error) => {
        console.error('Error al obtener FAQs:', error);
      }
    });
  }
   agruparFaqsPorCategoria() {
    const categoriasMap = new Map<string, Faq[]>();
    
    this.todasLasFaqs.forEach(faq => {
      if (!categoriasMap.has(faq.categoria)) {
        categoriasMap.set(faq.categoria, []);
      }
      categoriasMap.get(faq.categoria)?.push(faq);
    });

    const categorias: Categoria[] = Array.from(categoriasMap.entries()).map(
      ([nombre, faqs]) => ({ nombre, faqs })
    );
    
    this.faqsAgrupadas = [];
    let faqsRestantes = 0;
    let paginaCategorias: Categoria[] = [];
    
    for (const categoria of categorias) {
      const faqsCategoria = [...categoria.faqs];
      
      while (faqsCategoria.length > 0) {
        const espacioDisponible = this.faqsPorPagina - faqsRestantes;
        const faqsTomadas = faqsCategoria.splice(0, espacioDisponible);
        
        if (paginaCategorias.length > 0 && 
            paginaCategorias[paginaCategorias.length - 1].nombre === categoria.nombre) {
          paginaCategorias[paginaCategorias.length - 1].faqs.push(...faqsTomadas);
        } else {
          paginaCategorias.push({
            nombre: categoria.nombre,
            faqs: faqsTomadas
          });
        }
        
        faqsRestantes += faqsTomadas.length;
        
        if (faqsRestantes >= this.faqsPorPagina) {
          this.faqsAgrupadas.push({
            categorias: paginaCategorias,
            totalFaqs: faqsRestantes
          });
          paginaCategorias = [];
          faqsRestantes = 0;
        }
      }
      }
    
    if (paginaCategorias.length > 0) {
      this.faqsAgrupadas.push({
        categorias: paginaCategorias,
        totalFaqs: faqsRestantes
      });
    }
    
    this.totalPaginas = this.faqsAgrupadas.length;
  }

  cerrarFaqs() {
    this._mostrarFaqs = false;
    this.cerrar.emit();
  }
paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
    }
  }

  enviarPregunta(pregunta: string) {
    this.preguntaSeleccionada.emit(pregunta);
    this.cerrar.emit();
  }
}
