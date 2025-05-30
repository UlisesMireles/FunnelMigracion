
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { GraficasService } from '../../../services/graficas.service';
import { GraficasDto, RequestGraficasDto } from '../../../interfaces/graficas';
@Component({
  selector: 'app-oportunidades-por-agente',
  standalone: false,
  templateUrl: './oportunidades-por-agente.component.html',
  styleUrl: './oportunidades-por-agente.component.css'
})
export class OportunidadesPorAgenteComponent {
 quadrants = [
    { cards: [this.createCard(1, 'Indicadores por Etapa')] },
    { cards: [this.createCard(2, 'Oportunidades por Sector')] },
    { cards: [this.createCard(3, 'Oportunidades por Tipo')] },
    { cards: [] }
  ];

  get dropListIds() {
    return this.quadrants.map((_, index) => `cardList${index}`);
  }
  infoCargada: boolean = false;

  constructor(
    private readonly graficasService: GraficasService,
    private readonly sessionService: LoginService
  ) {}

  public graph: any;

  static getRandomColor() {
    let color = '#';
    let letters = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private createCard(id: number, titulo: string) {
    return {
      id,
      titulo,
      infoCargada: false,
      grafica: {
        data: [],
        layout: {},
        config: { displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: true, displayModeBar: true }
      }
    };
  }

  ngOnInit(): void {
    this.consultarGraficaStage();
    this.consultarGraficaTipo();
    this.consultarGraficaSector();
  }

  private setGraficaData(quadrantIdx: number, cardIdx: number, data: any, layout: any) {
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.data = data;
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.layout = layout;
    this.quadrants[quadrantIdx].cards[cardIdx].infoCargada = true;
  }

  consultarGraficaStage(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SEL-OPORTUNIDAD-STAGE',
      idEmpresa
    };

    this.graficasService.obtenerGraficaData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [{
          type: 'funnel',
          x: response.map(item => item.valor),
          text: response.map(item => item.label ?? 'Sin etiqueta'),
          textfont: { family: "Old Standard TT", size: 13, color: "black" },
          hoverinfo: 'percent total+x',
          marker: {
            color: response.map(item => item.coloreSerie ?? OportunidadesPorAgenteComponent.getRandomColor())
          }
        }];
        const layOutGrafica = {
          margin: { l: 50, r: 50, b: 70, t: 30 },
          height: 400,
          yaxis: { visible: false, showticklabels: false, showgrid: false, zeroline: false }
        };
        this.setGraficaData(0, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

  consultarGraficaTipo(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SEL-TIPO-SIN-MONTOS-CEROS',
      idEmpresa
    };

    this.graficasService.obtenerGraficaData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.createPieData(response)];
        const layOutGrafica = this.createPieLayout();
        this.setGraficaData(2, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

  consultarGraficaSector(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SEL-AGENTE-SECTOR',
      idEmpresa
    };

    this.graficasService.obtenerGraficaAgentesData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const filtrados = response.filter(item => item.valor > 0);
        const dataAGraficar = [this.createPieData(filtrados)];
        const layOutGrafica = this.createPieLayout();
        this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

  private createPieData(items: GraficasDto[]) {
    return {
      type: 'pie',
      values: items.map(item => item.valor),
      labels: items.map(item => item.label ?? 'Sin etiqueta'),
      textposition: "outside",
      textinfo: "label+percent",
      automargin: true,
      marker: {
        color: items.map(item => item.coloreSerie ?? OportunidadesPorAgenteComponent.getRandomColor())
      }
    };
  }

  private createPieLayout() {
    return {
      margin: { t: 0, b: 100, l: 0, r: 100 },
      height: 330,
      showlegend: false
    };
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
}
