import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewEncapsulation, Inject, Renderer2} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '../../../../services/login.service';
import { GraficasService } from '../../../../services/graficas.service';
import { GraficasDto, RequestGraficasDto, AniosDto } from '../../../../interfaces/graficas';
@Component({
  selector: 'app-graficas-por-anio',
  standalone: false,
  templateUrl: './graficas-por-anio.component.html',
  styleUrl: './graficas-por-anio.component.css',
  encapsulation: ViewEncapsulation.None
})
export class GraficasPorAnioComponent {
quadrants: { cards: any[] }[] = [];
  get dropListIds() {
    return this.quadrants.map((_, index) => `dropList${index}`);
  }
  infoCargada: boolean = false;
  aniosDisponibles: { label: string, value: number }[] = [];
  anioSeleccionado!: number;
  loading: boolean = true;
  originalParentElements = new Map<string, { parent: Node, nextSibling: Node | null }>();


  constructor(
    private readonly graficasService: GraficasService,
    private readonly sessionService: LoginService,
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
    this.obtenerAniosDisponibles();
    this.consultarGraficaClientes();
    this.consultarGraficaTipoProyecto();
    this.consultarGraficaVentasAnuales();
  }
 

obtenerAniosDisponibles(): void {
  const idEmpresa = this.sessionService.obtenerIdEmpresa();
  const idEstatusOportunidad = 2;

  this.graficasService.obtenerAnios(idEmpresa, idEstatusOportunidad).subscribe({
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
  private setGraficaData(quadrantIdx: number, cardIdx: number, data: any, layout: any) {
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.data = data;
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.layout = layout;
    this.quadrants[quadrantIdx].cards[cardIdx].infoCargada = true;
  }

  
  consultarGraficaClientes(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const idUsuario = this.sessionService.obtenerIdUsuario();
    const idEstatusOportunidad = 2;
    const anio = this.anioSeleccionado;
    const request: RequestGraficasDto = {
      bandera: 'SEL-CLIENTES-ANIO',
      idEmpresa,
      idUsuario,
      idEstatusOportunidad,
      anio
    };
    this.graficasService.obtenerGraficaGanadasData(request).subscribe({
      next: (response: GraficasDto[]) => {
          const filtrados = response.filter(item => item.valor > 0);
          const dataAGraficar = [this.graficasService.createBarPorcentajeData(filtrados)];
          const layOutGrafica = this.graficasService.createBarLayout();
          this.setGraficaData(0, 0, dataAGraficar, layOutGrafica);
        },
        error: (err: any) => console.error('Error al consultar la gráfica:', err)
      });
    }
  consultarGraficaTipoProyecto(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const idUsuario = this.sessionService.obtenerIdUsuario();
    const idEstatusOportunidad = 2;
    const anio = this.anioSeleccionado;
    const request: RequestGraficasDto = {
      bandera: 'SEL-TIPO-ANIO',
      idEmpresa,
      idUsuario,
      idEstatusOportunidad,
      anio
    };
    this.graficasService.obtenerGraficaGanadasData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.graficasService.createPieMontoData(response)];
        const layOutGrafica = this.graficasService.createPieLayout();
        this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica proyecto:', err)
    });
  }
  consultarGraficaVentasAnuales(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const idEstatusOportunidad = 2;
    const request: RequestGraficasDto = {
      bandera: 'SEL-TOTALES-ANUALES',
      idEmpresa,
      idEstatusOportunidad
    };
    this.graficasService.obtenerGraficaGanadasData(request).subscribe({
      next: (response: GraficasDto[]) => {
          const filtrados = response.filter(item => item.valor > 0);
          const barData = this.graficasService.createBarData(filtrados);
         barData.marker = { color: filtrados.map(() => '#1976d2') };
          const dataAGraficar = [barData];
          const layOutGrafica = this.graficasService.createBarLayout();
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
    }
  } else {
    // Restaura a la posición original
    const originalPosition = this.originalParentElements.get(cardId);
    if (originalPosition) {
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

