import { Component, ChangeDetectorRef  } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { GraficasService } from '../../../../services/graficas.service';
import { LoginService } from '../../../../services/login.service';
import { GraficasDto, RequestGraficasDto } from '../../../../interfaces/graficas';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProspectoService } from '../../../../services/prospecto.service';
import { MessageService } from 'primeng/api';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-graficas-clientes-top20',
  standalone: false,
  templateUrl: './graficas-clientes-top20.component.html',
  styleUrl: './graficas-clientes-top20.component.css'
})
export class GraficasClientesTop20Component {
  quadrants: { cards: any[] }[] = [];
  baseUrl: string = environment.baseURL;

  get dropListIds() {
    return this.quadrants.map((_, index) => `cardList${index}`);
  }
  infoCargada: boolean = false;

  yearsGrafica: string[] = [];
  selectedYear: string = 'Todos los Años';
  private originalParentElements = new Map<string, { parent: Node, nextSibling: Node | null }>();


  constructor(private messageService: MessageService, private readonly graficasService: GraficasService, private prospectoService: ProspectoService, private loginService: LoginService, private readonly sessionService: LoginService, private readonly cdr: ChangeDetectorRef) {
    this.quadrants = [
      { cards: [this.graficasService.createCard(0, 'Distribución de Oportunidades por Sector (Alto Rendimiento)', 'grafica')] },
      { cards: [this.graficasService.createCard(1, 'Top 10 Clientes', 'grafica')] }
    ];
  }

  ngOnInit(): void {
    this.baseUrl = this.baseUrl + '/Fotografia/';
    this.getAniosGraficas();
  }

  getAniosGraficas() {
    this.prospectoService.getAniosGraficas(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any[]) => {
        this.yearsGrafica = result.map((item: any) => item.anio.toString());
        this.yearsGrafica.unshift("Todos los Años");
        console.log("anios",this.yearsGrafica)
        this.consultarGraficaOportunidadesPorSector()
        this.consultarGraficaPorcentajeOportunidadesGanadas()
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });

  }

  consultarGraficaOportunidadesPorSector() {
    let anioSeleccionado = this.selectedYear === "Todos los Años" ? undefined : parseInt(this.selectedYear);
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SELECT-TOPVEINTE-SECTORES',
      idEmpresa: idEmpresa,
      anio: anioSeleccionado
    };

    this.graficasService.obtenerGraficaClientesTopVeinteData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.graficasService.createPieDataTop20(response)];
        const layOutGrafica = this.graficasService.createPieLayout(true);
        this.setGraficaData(0, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });

  }

  consultarGraficaPorcentajeOportunidadesGanadas(): void {
    let anioSeleccionado = this.selectedYear === "Todos los Años" ? undefined : parseInt(this.selectedYear);
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SELECT-TOPDIEZ-CLIENTES-ORDER',
      idEmpresa: idEmpresa,
      anio: anioSeleccionado
    };

    this.graficasService.obtenerGraficaClientesTopVeinteData(request).subscribe({
      next: (response: GraficasDto[]) => {
        let text = response.map(item => item.valor.toString())
        let text2 = response.map(item => item.valor2.toString())
        let customdata = response.map(item => item.porcentaje?.toFixed(2) ?? "")
        let hovertemplate = 'Porcentaje Ganado: <b>%{customdata}</b><extra></extra>';
        const dataAGraficar = [
          this.graficasService.createBarVerticalData(response, "#b94d0a", "Oportunidades Solicitadas", hovertemplate, text, customdata, false),
          this.graficasService.createBarVerticalData(response, "#1F77B4", "Oportunidades Ganadas", hovertemplate, text2, customdata, true)
        ];
        const layOutGrafica = this.graficasService.createBarGroupLayout();
        this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

  private setGraficaData(quadrantIdx: number, cardIdx: number, data: any, layout: any) {
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.data = data;
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.layout = layout;
    this.quadrants[quadrantIdx].cards[cardIdx].infoCargada = true;
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

  onYearChangeGrafica() {
    this.consultarGraficaOportunidadesPorSector()
    this.consultarGraficaPorcentajeOportunidadesGanadas()
  }

  toggleMaximizar(i: number, j: number, event: MouseEvent): void {
  event.stopPropagation();
  event.preventDefault();

  const card = this.quadrants[i].cards[j];
  card.isMaximized = !card.isMaximized;

  const componentId = 'graficas-clientes-top20';
  const cardId = `${componentId}-card-${i}-${j}`;
  const cardElement = document.querySelector(`[data-id="${cardId}"]`) as HTMLElement;

  if (!cardElement) return;

  if (card.isMaximized) {
    const overlay = document.createElement('div');
    overlay.id = `${cardId}-overlay`;
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '9998';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    document.body.appendChild(overlay);

    const clonedCard = cardElement.cloneNode(true) as HTMLElement;
    const maximizeBtn = clonedCard.querySelector('.maximize-btn');

    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.toggleMaximizar(i, j, e as MouseEvent);
      });
    }

    clonedCard.id = `${cardId}-maximized`;
    clonedCard.style.position = 'fixed';
    clonedCard.style.top = '50%';
    clonedCard.style.left = '50%';
    clonedCard.style.transform = 'translate(-50%, -50%)';
    clonedCard.style.width = '100vw';
    clonedCard.style.height = '100vh';
    clonedCard.style.zIndex = '9999';
    clonedCard.style.backgroundColor = 'white';
    clonedCard.style.borderRadius = '8px';
    clonedCard.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
    clonedCard.style.overflow = 'auto';

    overlay.appendChild(clonedCard);
    card.maximizedElements = { overlay, clonedCard };


    setTimeout(() => {
      const plotlyComponent = clonedCard.querySelector('plotly-plot') as any;
      if (plotlyComponent?.shadowRoot) {
        const plotDiv = plotlyComponent.shadowRoot.querySelector('.js-plotly-plot') as HTMLElement;
        if (plotDiv) {
          const ancho = clonedCard.clientWidth;
          const alto = clonedCard.clientHeight - 60;

          plotDiv.style.width = `${ancho}px`;
          plotDiv.style.height = `${alto}px`;

          Plotly.relayout(plotDiv, {
            width: ancho,
            height: alto,
            autosize: true
          }).then(() => {
            Plotly.Plots.resize(plotDiv);
          });
        }
      }
    }, 300);
  } else {
    if (card.maximizedElements) {
      const { overlay, clonedCard } = card.maximizedElements;
      if (overlay?.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (clonedCard?.parentNode) {
        clonedCard.parentNode.removeChild(clonedCard);
      }
      delete card.maximizedElements;
    }

    setTimeout(() => {
      const plotlyComponent = cardElement.querySelector('plotly-plot') as any;
      if (plotlyComponent?.shadowRoot) {
        const plotDiv = plotlyComponent.shadowRoot.querySelector('.js-plotly-plot') as HTMLElement;
        if (plotDiv) {
          plotDiv.style.width = '100%';
          plotDiv.style.height = '330px';

          Plotly.relayout(plotDiv, {
            width: cardElement.clientWidth,
            height: 330,
            autosize: true
          }).then(() => {
            Plotly.Plots.resize(plotDiv);
          });
        }
      }
    }, 300);
  }
}
}