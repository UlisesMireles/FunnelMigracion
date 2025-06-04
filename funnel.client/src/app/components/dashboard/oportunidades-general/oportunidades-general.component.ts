import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewEncapsulation } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { GraficasService } from '../../../services/graficas.service';
import { GraficasDto, RequestGraficasDto } from '../../../interfaces/graficas';
@Component({
  selector: 'app-oportunidades-general',
  standalone: false,
  templateUrl: './oportunidades-general.component.html',
  styleUrl: './oportunidades-general.component.css',
  encapsulation: ViewEncapsulation.None
})

export class OportunidadesGeneralComponent {
  quadrants: { cards: any[] }[] = [];
  get dropListIds() {
    return this.quadrants.map((_, index) => `dropList${index}`);
  }
  infoCargada: boolean = false;

  constructor(
    private readonly graficasService: GraficasService,
    private readonly sessionService: LoginService
  ) {
    this.quadrants = [
    { cards: [this.graficasService.createCard(1, 'Indicadores por Etapa', 'grafica')] },
    { cards: [this.graficasService.createCard(2, 'Oportunidades por Sector', 'grafica')] },
    { cards: [this.graficasService.createCard(3, 'Oportunidades por Tipo', 'grafica')] },
    { cards: [] }
  ];

  }
  
  public graph: any;

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
        const dataAGraficar = [this.graficasService.createFunnelData(response)];
        const layOutGrafica = this.graficasService.createFunnelLayout();
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
        const dataAGraficar = [this.graficasService.createPieData(response)];
        const layOutGrafica = this.graficasService.createPieLayout();
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
        console.log('Response de la gráfica de sectores:', filtrados);
        const dataAGraficar = [this.graficasService.createBarData(filtrados)];
        const layOutGrafica = this.graficasService.createBarLayout();
        this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
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
}
