import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { GraficasService } from '../../../../services/graficas.service';
import { AgenteDto, GraficasDto, RequestGraficasDto, AniosDto } from '../../../../interfaces/graficas';
import { environment } from '../../../../../environments/environment';
import * as Plotly from 'plotly.js-dist-min';
@Component({
  selector: 'app-graficas-por-agente-eliminadas',
  standalone: false,
  templateUrl: './graficas-por-agente-eliminadas.component.html',
  styleUrl: './graficas-por-agente-eliminadas.component.css'
})
export class GraficasPorAgenteEliminadasComponent {
quadrants: { cards: any[] }[] = [];
  baseUrl: string = environment.baseURL;
  agentes: AgenteDto[] = [];
  mostrarDecimales: boolean = false;


  get dropListIds() {
    return this.quadrants.map((_, index) => `cardList${index}`);
  }
  infoCargada: boolean = false;
  aniosDisponibles: { label: string, value: number }[] = [];
  anioSeleccionado!: number;
  loading: boolean = true;
  agenteSeleccionadoId: number | null = null;
  private originalParentElements = new Map<string, { parent: HTMLElement, nextSibling: Node | null }>();


  constructor( private readonly graficasService: GraficasService,private readonly sessionService: LoginService, private readonly cdr: ChangeDetectorRef, private loginService: LoginService) {
    this.quadrants = [
      { cards: [this.graficasService.createCardPorAnio(1, 'Consulta Agentes', 'tabla')] },
      { cards: [this.graficasService.createCardPorAnio(2, 'Grafica por Agente - Clientes (Seleccione un Agente)', 'grafica')] },
      { cards: [this.graficasService.createCard(3, 'Grafica por Agente - Tipo Oportunidades (Seleccione un Agente)', 'grafica')] },
    ];

  }
  ngOnInit(): void {
    this.baseUrl = this.baseUrl + '/Fotografia/';
    setTimeout(() => {this.mostrarDecimales = this.loginService.obtenerPermitirDecimales();
    this.obtenerAniosDisponibles();
    }, 500);
    //this.consultarAgente();
  }
  obtenerAniosDisponibles(): void {
  const idEmpresa = this.sessionService.obtenerIdEmpresa();
  const idEstatusOportunidad = 5;

  this.graficasService.obtenerAnios(idEmpresa, idEstatusOportunidad).subscribe({
    next: (response: any[]) => {
      this.aniosDisponibles = response.map(item => {
      const anio = Number(item.anio);
      return { label: anio === 0 ? 'Sin Fecha' : anio.toString(), value: anio };
    });

      if (this.aniosDisponibles.length > 0) {
        const aniosSoloValores = this.aniosDisponibles.map(a => a.value);
        this.anioSeleccionado = Math.max(...aniosSoloValores);
        this.consultarTodasGraficas();
      }

      this.loading = false;
    },
    error: (err) => {
      console.error('Error al obtener años disponibles:', err);
      this.loading = false;
    }
  });
}
onAnioChange(): void {
    this.consultarTodasGraficas();
  }
  consultarTodasGraficas(): void {
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
  }
  consultarAgente(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const idUsuario = this.sessionService.obtenerIdUsuario();
    const idEstatusOportunidad = 5;
    const anio = this.anioSeleccionado;
    const request: RequestGraficasDto = {
      bandera: 'SEL-AGENTES',
      idEmpresa: idEmpresa,
      idUsuario,
      idEstatusOportunidad,
      anio
    };
    this.graficasService.obtenerAgentesPorAnioData(request).subscribe({
      next: (response: AgenteDto[]) => {
        this.agentes = response;
        this.agenteSeleccionadoId = this.agentes.length > 0 ? this.agentes[0].idAgente : null;
        this.consultarGraficaAgenteCliente(this.agentes.length > 0 ? this.agentes[0].idAgente : -1);
        this.consultarGraficaAgenteTipoOportunidad(this.agentes.length > 0 ? this.agentes[0].idAgente : -1);
      },
      error: (err: any) => console.error('Error al consultar los agentes:', err)
    });
  }
seleccionarAgente(idAgente: number) {
    this.agenteSeleccionadoId = idAgente;
    this.recargarGraficasPorAgente(idAgente);
  }
  consultarGraficaAgenteCliente(idAgente: number): void {
    const idEstatusOportunidad = 5;
    const anio = this.anioSeleccionado;
    const request: RequestGraficasDto = {
      bandera: 'SEL-AGENTE-CLIENTES',
      idUsuario: idAgente,
      idEstatusOportunidad,
      anio
    };

    this.graficasService.obtenerGraficaAgentesPorAnioData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.graficasService.createBarHorizontalData(response)];
        const layOutGrafica = this.graficasService.createBarHorizontalLayout();
        this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

consultarGraficaAgenteTipoOportunidad(idAgente: number): void {
  const idEstatusOportunidad = 5;
  const anio = this.anioSeleccionado;

  const request: RequestGraficasDto = {
    bandera: 'SEL-AGENTE-TIPO',
    idEmpresa: this.sessionService.obtenerIdEmpresa(),
    idUsuario: idAgente,
    idEstatusOportunidad,
    anio
  };

  this.graficasService.obtenerGraficaAgentesPorAnioData(request).subscribe({
    next: (response: GraficasDto[]) => {
      const dataAGraficar = [
        this.graficasService.createPieData(response, this.mostrarDecimales)
      ];
      const layOutGrafica = this.graficasService.createPieLayout();
      this.setGraficaData(2, 0, dataAGraficar, layOutGrafica);
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

      const plotDiv = cardElement.querySelector('.js-plotly-plot') as HTMLElement;
      if (plotDiv) {
        setTimeout(() => {
          Plotly.relayout(plotDiv, {
            width: cardElement.clientWidth - 200,
            height: cardElement.clientHeight - 100,
            autosize: true
          });
          Plotly.Plots.resize(plotDiv);
        }, 100);
      }
    }

  } else {
    // Restaurar posición original
    const originalPosition = this.originalParentElements.get(cardId);
    if (originalPosition) {
      if (originalPosition.nextSibling) {
        originalPosition.parent.insertBefore(cardElement, originalPosition.nextSibling);
      } else {
        originalPosition.parent.appendChild(cardElement);
      }

      cardElement.style.zIndex = '';
      document.body.style.overflow = '';

      const plotDiv = cardElement.querySelector('.js-plotly-plot') as HTMLElement;
      if (plotDiv) {
        Plotly.relayout(plotDiv, {
          width: originalPosition.parent.clientWidth,
          height: 320,
          autosize: true
        });
        Plotly.Plots.resize(plotDiv);
      }
    }
  }
}
}
