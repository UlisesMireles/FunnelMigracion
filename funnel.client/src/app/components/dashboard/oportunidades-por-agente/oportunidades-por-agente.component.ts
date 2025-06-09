
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
  quadrants: { cards: any[] }[] = [];
  baseUrl: string = environment.baseURL;
  agentes: AgenteDto[] = [];
  agenteSeleccionadoId: number | null = null;

  get dropListIds() {
    return this.quadrants.map((_, index) => `cardList${index}`);
  }
  infoCargada: boolean = false;

  constructor( private readonly graficasService: GraficasService,private readonly sessionService: LoginService) {
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
        const dataAGraficar = [this.graficasService.createPieData(response)];
        const layOutGrafica = this.graficasService.createPieLayout();
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
}
