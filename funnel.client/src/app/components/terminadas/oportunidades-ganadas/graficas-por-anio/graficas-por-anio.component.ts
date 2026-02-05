import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewEncapsulation, Inject, Renderer2, ChangeDetectorRef} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../../../services/login.service';
import { GraficasService } from '../../../../services/graficas.service';
import { GraficasDto, RequestGraficasDto, AniosDto } from '../../../../interfaces/graficas';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-graficas-por-anio',
  standalone: false,
  templateUrl: './graficas-por-anio.component.html',
  styleUrl: './graficas-por-anio.component.css',
  encapsulation: ViewEncapsulation.None
})
export class GraficasPorAnioComponent {
quadrants: { cards: any[] }[] = [];
mostrarDecimales: boolean = false;
  get dropListIds() {
    return this.quadrants.map((_, index) => `dropList${index}`);
  }
  infoCargada: boolean = false;
  aniosDisponibles: { label: string, value: number }[] = [];
  anioSeleccionado!: number;
  loading: boolean = true;
  originalParentElements = new Map<string, { parent: HTMLElement, nextSibling: Node | null }>();


  constructor(
    private readonly graficasService: GraficasService,
    private readonly sessionService: LoginService,
    private loginService: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document

  ) {
    this.quadrants = [
    { cards: [this.graficasService.createCard(1, 'Gráfica Anual por Clientes', 'grafica')] },
    { cards: [this.graficasService.createCard(2, 'Gráfica Anual por Tipo de Proyecto', 'grafica')] },
    { cards: [this.graficasService.createCard(3, 'Ventas Anuales', 'grafica')] },
  ];

  }
  
  public graph: any;

  ngOnInit(): void {
    setTimeout(() => {this.mostrarDecimales = this.loginService.obtenerPermitirDecimales();
    this.obtenerAniosDisponibles();
    this.consultarGraficaClientes();
    this.consultarGraficaTipoProyecto();
    this.consultarGraficaVentasAnuales();
    }, 500);
  }
 

obtenerAniosDisponibles(): void {
  const idEmpresa = this.sessionService.obtenerIdEmpresa();
  const idEstatusOportunidad = 2;
  const idProceso = Number(localStorage.getItem('idProceso'));

  this.graficasService.obtenerAnios(idEmpresa, idEstatusOportunidad, idProceso).subscribe({
    next: (response: any[]) => {
      this.aniosDisponibles = response.map(item => {
        const anio = Number(item.anio);
        return { label: anio.toString(), value: anio };
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
    this.consultarGraficaClientes();
    this.consultarGraficaTipoProyecto();
    this.consultarGraficaVentasAnuales();
  }
  private setGraficaData(quadrantIdx: number, cardIdx: number, data: any, layout: any, sinDatos: boolean = false) {
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.data = data;
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.layout = layout;
    this.quadrants[quadrantIdx].cards[cardIdx].infoCargada = true;
    this.quadrants[quadrantIdx].cards[cardIdx].sinDatos = sinDatos;
  }

  
  consultarGraficaClientes(): void {
  const idEmpresa = this.sessionService.obtenerIdEmpresa();
  const idUsuario = this.sessionService.obtenerIdUsuario();
  const idEstatusOportunidad = 2;
  const anio = this.anioSeleccionado;
  const idProceso = Number(localStorage.getItem('idProceso'));

  const request: RequestGraficasDto = {
    bandera: 'SEL-CLIENTES-ANIO',
    idEmpresa,
    idUsuario,
    idEstatusOportunidad,
    anio,
    idProceso
  };

  this.graficasService.obtenerGraficaGanadasData(request).subscribe({
    next: (response: GraficasDto[]) => {
      const filtrados = response.filter(item => item.valor > 0);
      const dataAGraficar = [
        this.graficasService.createBarPorcentajeData(filtrados, this.mostrarDecimales)
      ];

      if(dataAGraficar[0].text.length > 0) {
        const layOutGrafica = this.graficasService.createFunnelLayout();
        this.setGraficaData(0, 0, dataAGraficar, layOutGrafica);
      }
      else{
        this.setGraficaData(0, 0, [], {}, true);        
      }

      // const layOutGrafica = this.graficasService.createBarLayout();
      // this.setGraficaData(0, 0, dataAGraficar, layOutGrafica);
    },
    error: (err: any) => console.error('Error al consultar la gráfica:', err)
  });
}

  consultarGraficaTipoProyecto(): void {
  const idEmpresa = this.sessionService.obtenerIdEmpresa();
  const idUsuario = this.sessionService.obtenerIdUsuario();
  const idEstatusOportunidad = 2;
  const anio = this.anioSeleccionado;
  const idProceso = Number(localStorage.getItem('idProceso'));

  const request: RequestGraficasDto = {
    bandera: 'SEL-TIPO-ANIO',
    idEmpresa,
    idUsuario,
    idEstatusOportunidad,
    anio,
    idProceso
  };

  this.graficasService.obtenerGraficaGanadasData(request).subscribe({
    next: (response: GraficasDto[]) => {
      const dataAGraficar = [
        this.graficasService.createPieMontoData(response, this.mostrarDecimales)
      ];

      if(dataAGraficar[0].text.length > 0) {
        const layOutGrafica = this.graficasService.createFunnelLayout();
        this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
      }
      else{
        this.setGraficaData(1, 0, [], {}, true);        
      }

      // const layOutGrafica = this.graficasService.createPieLayout();
      // this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
    },
    error: (err: any) => console.error('Error al consultar la gráfica proyecto:', err)
  });
}

 consultarGraficaVentasAnuales(): void {
  const idEmpresa = this.sessionService.obtenerIdEmpresa();
  const idEstatusOportunidad = 2;
  const idProceso = Number(localStorage.getItem('idProceso'));

  const request: RequestGraficasDto = {
    bandera: 'SEL-TOTALES-ANUALES',
    idEmpresa,
    idEstatusOportunidad,
    idProceso
  };

  this.graficasService.obtenerGraficaGanadasData(request).subscribe({
    next: (response: GraficasDto[]) => {
      const filtrados = response.filter(item => item.valor > 0);
      const barData = this.graficasService.createBarData(filtrados, this.mostrarDecimales);
      barData.marker = { color: filtrados.map(() => '#1976d2') };

      const dataAGraficar = [barData];
      if(dataAGraficar[0].text.length > 0) {
        const layOutGrafica = this.graficasService.createFunnelLayout();
        this.setGraficaData(2, 0, dataAGraficar, layOutGrafica);
      }
      else{
        this.setGraficaData(2, 0, [], {}, true);        
      }

      // const layOutGrafica = this.graficasService.createBarLayout();
      // this.setGraficaData(2, 0, dataAGraficar, layOutGrafica);
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

  toggleMaximizar(quadrantIdx: number, cardIdx: number): void {
  const card = this.quadrants[quadrantIdx].cards[cardIdx];
  card.maximizada = !card.maximizada;

  const cardId = card.id;
  const cardElement = this.document.querySelector(`.card[data-id="${cardId}"]`) as HTMLElement;

  if (!cardElement) return;

  if (card.maximizada) {
    // Guarda la posición original antes de mover
    const originalParent = cardElement.parentElement;
    const nextSibling = cardElement.nextSibling;
    
    if (originalParent) {
      this.originalParentElements.set(cardId, {
        parent: originalParent,
        nextSibling: nextSibling
      });
      
      // Mueve al final del body
      this.renderer.appendChild(this.document.body, cardElement);
      
      // Ajustar el gráfico Plotly después de la animación/movimiento
      setTimeout(() => {
        const plotDiv = cardElement.querySelector('.js-plotly-plot') as HTMLElement;
        if (plotDiv) {
          const parentHeight = cardElement.clientHeight - 100;
          const parentWidth = cardElement.clientWidth - 200;

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
    // Restaura a la posición original
    const originalPosition = this.originalParentElements.get(cardId);
    if (originalPosition) {
      // Redimensionar el gráfico antes de moverlo de vuelta
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
        this.renderer.insertBefore(
          originalPosition.parent,
          cardElement,
          originalPosition.nextSibling
        );
      } else {
        this.renderer.appendChild(originalPosition.parent, cardElement);
      }
      this.originalParentElements.delete(cardId);
    }
  }
}
}