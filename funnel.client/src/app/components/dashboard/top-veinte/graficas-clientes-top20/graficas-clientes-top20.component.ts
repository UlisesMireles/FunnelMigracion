import { Component, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { GraficasService } from '../../../../services/graficas.service';
import { LoginService } from '../../../../services/login.service';
import { GraficasDto, RequestGraficasDto } from '../../../../interfaces/graficas';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProspectoService } from '../../../../services/prospecto.service';
import { MessageService } from 'primeng/api';
import * as Plotly from 'plotly.js-dist-min';

interface OriginalCardPosition {
  parent: HTMLElement;
  nextSibling: Node | null;
  originalStyle: string | null;
  modalElement?: HTMLElement;
}

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
  originalParentElements: Map<string, OriginalCardPosition> = new Map();

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
        console.log("anios", this.yearsGrafica)
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

  ToggleMaximizar(i: number, j: number, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const card = this.quadrants[i].cards[j];
    card.isMaximized = !card.isMaximized;

    const cardId = `graficas-clientes-top20-card-${i}-${j}`;
    const cardElement = document.querySelector(`[data-id="${cardId}"]`) as HTMLElement;
    if (!cardElement) return;

    if (card.isMaximized) {
      const originalParent = cardElement.parentElement;
      const nextSibling = cardElement.nextSibling;

      if (originalParent) {
        this.originalParentElements.set(cardId, {
          parent: originalParent,
          nextSibling,
          originalStyle: cardElement.getAttribute('style')
        });

        const modalContainer = document.createElement('div');
        modalContainer.className = 'maximized-card';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'card-header';

        const title = document.createElement('h5');
        title.textContent = card.title || 'Gráfica';
        title.style.margin = '0';
        modalHeader.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.className = 'maximize-btn';
        closeButton.addEventListener('click', () => this.ToggleMaximizar(i, j, event));
        modalHeader.appendChild(closeButton);

        modalContainer.appendChild(modalHeader);

        const modalContent = document.createElement('div');
        modalContent.className = 'maximized-content';

        const plotWrapper = document.createElement('div');
        plotWrapper.className = 'plot-wrapper';

        plotWrapper.appendChild(cardElement);
        modalContent.appendChild(plotWrapper);
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
          const plotDiv = cardElement.querySelector('.js-plotly-plot') as HTMLElement;
          if (plotDiv) {
            Plotly.relayout(plotDiv, {
              width: plotWrapper.clientWidth -300,
              height: plotWrapper.clientHeight -100,
              autosize: true
            });
            Plotly.Plots.resize(plotDiv);
          }
        }, 100);
      }

    } else {
      const originalPosition = this.originalParentElements?.get(cardId);
      if (originalPosition) {
        const plotDiv = cardElement.querySelector('.js-plotly-plot') as HTMLElement;
        if (plotDiv) {
          Plotly.relayout(plotDiv, {
            width: originalPosition.parent.clientWidth,
            height: 320,
            autosize: true,
          });
          Plotly.Plots.resize(plotDiv);

          this.cdr.detectChanges();
        }
        const modal = document.querySelector('.maximized-card');
        if (modal) document.body.removeChild(modal);

        if (originalPosition.nextSibling) {
          originalPosition.parent.insertBefore(cardElement, originalPosition.nextSibling);
        } else {
          originalPosition.parent.appendChild(cardElement);
        }

        if (originalPosition.originalStyle !== null) {
          cardElement.setAttribute('style', originalPosition.originalStyle);
        } else {
          cardElement.removeAttribute('style');
        }

        cardElement.classList.remove('maximized-card', 'maximized-content', 'plot-wrapper');
        document.body.style.overflow = '';


        this.originalParentElements.delete(cardId);
      }
    }
  }
}