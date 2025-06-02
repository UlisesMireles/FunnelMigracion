
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { GraficasService } from '../../../services/graficas.service';
import { AgenteDto, GraficasDto, RequestGraficasDto } from '../../../interfaces/graficas';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-oportunidades-por-agente',
  standalone: false,
  templateUrl: './oportunidades-por-agente.component.html',
  styleUrl: './oportunidades-por-agente.component.css'
})
export class OportunidadesPorAgenteComponent {
  
  baseUrl: string = environment.baseURL;
  agentes: AgenteDto[] = [];
  quadrants = [
    { cards: [this.createCard(1, 'Consulta Agentes')] },
    { cards: [this.createCard(2, 'Grafica por Agente - Clientes')] },
    { cards: [this.createCard(3, 'Grafica por Agente - Tipo Oportunidad')] },
    { cards: [this.createCard(4, 'Grafica por Agente - Sector')]  }
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
        this.consultarGraficaAgenteCliente(this.agentes.length > 0 ? this.agentes[0].idAgente : -1);
        this.consultarGraficaAgenteTipoOportunidad(this.agentes.length > 0 ? this.agentes[0].idAgente : -1);
        this.consultarGraficaAgenteSector(this.agentes.length > 0 ? this.agentes[0].idAgente : -1);
      },
      error: (err: any) => console.error('Error al consultar los agentes:', err)
    });
  }

  consultarGraficaAgenteCliente(idAgente: number): void {
    const request: RequestGraficasDto = {
      bandera: 'SEL-AGENTE-CLIENTES',
      idUsuario: idAgente
    };

    this.graficasService.obtenerGraficaAgentesData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.createBarData(response), this.createBarNormalizadoData(response)];
        const layOutGrafica = this.createBarLayout();
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
        const dataAGraficar = [this.createPieData(response)]; 
        const layOutGrafica = this.createPieLayout();
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
        console.log('Respuesta de la gráfica por tipo de oportunidad:', response);
        const dataAGraficar = [this.createPieData(response)]; 
        const layOutGrafica = this.createPieLayout();
        this.setGraficaData(3, 0, dataAGraficar, layOutGrafica);
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
  private createBarData(items: GraficasDto[]) {
    return {
      type: 'bar',
      y: items.map(item => item.valor),
      x: items.map(item => item.label ?? 'Sin etiqueta'),
      name: 'Monto',
      marker: {
        color: items.map(item => OportunidadesPorAgenteComponent.getRandomColor())
      }
    };
  }
    private createBarNormalizadoData(items: GraficasDto[]) {
    return {
      type: 'bar',
      y: items.map(item => item.montoNormalizado),
      x: items.map(item => item.label ?? 'Sin etiqueta'),
      name: 'Monto Normalizado',
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
  private createBarLayout() {
    return {
      margin: { t: 50, b: 50, l: 50, r: 150 },
      height: 330,
      barmode: 'group'
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
