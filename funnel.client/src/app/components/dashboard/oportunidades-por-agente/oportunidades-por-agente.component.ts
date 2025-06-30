
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChildren , Renderer2, QueryList, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { GraficasService } from '../../../services/graficas.service';
import { AgenteDto, GraficasDto, RequestGraficasDto } from '../../../interfaces/graficas';
import { environment } from '../../../../environments/environment';
import * as Plotly from 'plotly.js-dist-min';
@Component({
  selector: 'app-oportunidades-por-agente',
  standalone: false,
  templateUrl: './oportunidades-por-agente.component.html',
  styleUrl: './oportunidades-por-agente.component.css'
})
export class OportunidadesPorAgenteComponent {
  quadrants: { cards: any[] }[] = [];
  baseUrl: string = environment.baseURL;
  agentes: AgenteDto[] = [];
  agenteSeleccionadoId: number | null = null;
  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;
  originalParentElements = new Map<string, { parent: HTMLElement, nextSibling: Node | null }>();
  modalAgenteClienteVisible: boolean = false;



  get dropListIds() {
    return this.quadrants.map((_, index) => `cardList${index}`);
  }
  infoCargada: boolean = false;

  constructor( private readonly graficasService: GraficasService,private readonly sessionService: LoginService, private renderer: Renderer2, private el: ElementRef, private readonly cdr: ChangeDetectorRef,) {
    this.quadrants = [
      { cards: [this.graficasService.createCard(1, 'Consulta Agentes', 'tabla')] },
      { cards: [this.graficasService.createCard(2, 'Grafica por Agente - Clientes', 'grafica')] },
      { cards: [this.graficasService.createCard(3, 'Grafica por Agente - Tipo Oportunidad', 'grafica')] },
      { cards: [this.graficasService.createCard(4, 'Grafica por Agente - Sector', 'grafica')] }
    ];

  }

  ngOnInit(): void {
    this.baseUrl = this.baseUrl + '/Fotografia/';
    this.consultarAgente();
  }

  private setGraficaData(quadrantIdx: number, cardIdx: number, data: any, layout: any) {
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.data = data;
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.layout = layout;
    this.quadrants[quadrantIdx].cards[cardIdx].infoCargada = true;
  }
  recargarGraficasPorAgente(idAgente: number) {
    this.consultarGraficaAgenteCliente(idAgente);
    this.consultarGraficaAgenteTipoOportunidad(idAgente);
    this.consultarGraficaAgenteSector(idAgente);
  }
  consultarAgente(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SEL-AGENTES',
      idEmpresa: idEmpresa
    };

    this.graficasService.obtenerAgentesData(request).subscribe({
      next: (response: AgenteDto[]) => {
        this.agentes = response;
        this.agenteSeleccionadoId = this.agentes.length > 0 ? this.agentes[0].idAgente : null;
        this.consultarGraficaAgenteCliente(this.agentes.length > 0 ? this.agentes[0].idAgente : -1);
        this.consultarGraficaAgenteTipoOportunidad(this.agentes.length > 0 ? this.agentes[0].idAgente : -1);
        this.consultarGraficaAgenteSector(this.agentes.length > 0 ? this.agentes[0].idAgente : -1);
      },
      error: (err: any) => console.error('Error al consultar los agentes:', err)
    });
  }
  seleccionarAgente(idAgente: number) {
    this.agenteSeleccionadoId = idAgente;
    this.recargarGraficasPorAgente(idAgente);
  }

  consultarGraficaAgenteCliente(idAgente: number): void {
    const request: RequestGraficasDto = {
      bandera: 'SEL-AGENTE-CLIENTES',
      idUsuario: idAgente
    };

    this.graficasService.obtenerGraficaAgentesData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.graficasService.createBarHorizontalNormalizadoData(response), this.graficasService.createBarHorizontalData(response)];
        const layOutGrafica = this.graficasService.createBarHorizontalLayout();
        this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

  consultarGraficaAgenteTipoOportunidad(idAgente: number): void {
    const request: RequestGraficasDto = {
      bandera: 'SEL-AGENTE-TIPO',
      idEmpresa: this.sessionService.obtenerIdEmpresa(),
      idUsuario: idAgente
    };

    this.graficasService.obtenerGraficaAgentesData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.graficasService.createPieData(response)];
        const layOutGrafica = this.graficasService.createPieLayout();
        this.setGraficaData(2, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

  consultarGraficaAgenteSector(idAgente: number): void {
    const request: RequestGraficasDto = {
      bandera: 'SEL-AGENTE-SECTOR-PERSONAL',
      idEmpresa: this.sessionService.obtenerIdEmpresa(),
      idUsuario: idAgente
    };

    this.graficasService.obtenerGraficaAgentesData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.graficasService.createBarData(response)];
        const layOutGrafica = this.graficasService.createBarLayout();
        layOutGrafica.margin = { t: 20, r: 20, b: 120, l: 50 };
        this.setGraficaData(3, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedItem = event.previousContainer.data[event.previousIndex];
      const targetList = event.container.data;
      if (targetList.length > 0 && targetList[0] !== undefined) {
        const targetItem = targetList[0];
        event.previousContainer.data[event.previousIndex] = targetItem;
        targetList[0] = draggedItem;
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }
toggleMaximizar(i: number, j: number, event: MouseEvent): void {
  event.stopPropagation();
  event.preventDefault();

  const card = this.quadrants[i].cards[j];
  card.isMaximized = !card.isMaximized;

  const cardId = `card-${i}-${j}`;
  const cardElement = document.querySelector(`[data-id="${cardId}"]`) as HTMLElement;

  if (!cardElement) return;

  if (card.isMaximized) {
    // Guardar posición original
    const originalParent = cardElement.parentElement;
    const nextSibling = cardElement.nextSibling;
    
    if (originalParent) {
      this.originalParentElements.set(cardId, {
        parent: originalParent,
        nextSibling: nextSibling
      });
      
      // Mover al body y aplicar estilos
      document.body.appendChild(cardElement);
      document.body.style.overflow = 'hidden';
      cardElement.style.zIndex = '9999';
      
      // Ajustar el tamaño del gráfico Plotly
      setTimeout(() => {
        const plotDiv = cardElement.querySelector('.js-plotly-plot') as HTMLElement;
        if (plotDiv) {
          const parentHeight = cardElement.clientHeight - 100;
          const parentWidth = cardElement.clientWidth - 500;

          Plotly.relayout(plotDiv, {
            height: parentHeight,
            width: parentWidth,
            autosize: true
          });
          
          this.cdr.detectChanges();
        }
      }, 100);
    }
  } else {
    // Restaurar posición original
    const originalPosition = this.originalParentElements.get(cardId);
    if (originalPosition) {
      // Ajustar el gráfico Plotly al tamaño original
      const plotDiv = cardElement.querySelector('.js-plotly-plot') as HTMLElement;
      if (plotDiv) {
        const parentWidth = originalPosition.parent.clientWidth;

        Plotly.relayout(plotDiv, {
          height: 320,
          width: parentWidth,
          autosize: true
        });
        Plotly.Plots.resize(plotDiv);

        this.cdr.detectChanges();
      }
      
      if (originalPosition.nextSibling) {
        originalPosition.parent.insertBefore(cardElement, originalPosition.nextSibling);
      } else {
        originalPosition.parent.appendChild(cardElement);
      }
      
      cardElement.style.zIndex = '';
      document.body.style.overflow = '';
      this.originalParentElements.delete(cardId);
    }
  }
}

openAgenteClienteModal() {
  if (this.agenteSeleccionadoId) {
    this.modalAgenteClienteVisible = true;
  }
}

onModalAgenteClienteClose() {
  this.modalAgenteClienteVisible = false;
}
}