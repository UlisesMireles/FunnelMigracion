import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewEncapsulation, Inject, Renderer2} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../../services/login.service';
import { GraficasService } from '../../../services/graficas.service';
import { GraficasDto, RequestGraficasDto } from '../../../interfaces/graficas';
import { ModalDetallesIndicadoresEtapaComponent } from './modal-detalles-indicadores-etapa/modal-detalles-indicadores-etapa.component'; 

@Component({
  selector: 'app-oportunidades-general',
  standalone: false,
  templateUrl: './oportunidades-general.component.html',
  styleUrl: './oportunidades-general.component.css',
  encapsulation: ViewEncapsulation.None
})

export class OportunidadesGeneralComponent {
  quadrants: { cards: any[] }[] = [];
  modalIndicadoresVisible: boolean = false;
  modalSectoresVisible: boolean = false;
  mostrarModalDetalles: boolean = false;
  sectorSeleccionado: number | null = null;
  modalTiposVisible: boolean = false;
  mostrarModalDetallesTipo: boolean = false;
  tipoProyectoSeleccionado: number | null = null;
  originalParentElements = new Map<number, { parent: HTMLElement, nextSibling: Node | null }>();

  get dropListIds() {
    return this.quadrants.map((_, index) => `dropList${index}`);
  }
  infoCargada: boolean = false;

  constructor(
    private readonly graficasService: GraficasService,
    private readonly sessionService: LoginService,
    private dialog: MatDialog,
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document
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
    this.consultarGraficaSector();
    this.consultarGraficaTipo();
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
openDetailsModal() {
  this.modalIndicadoresVisible = true;
}

  onModalIndicadoresClose() {
    this.modalIndicadoresVisible = false;
  }

  openSectoresModal() {
  this.modalSectoresVisible = true;
}

onModalSectoresClose() {
  this.modalSectoresVisible = false;
}

abrirModalDetalles(idSector: number): void {

  setTimeout(() => {
    this.sectorSeleccionado = idSector;
    this.mostrarModalDetalles = true;
  });
  this.modalSectoresVisible = false;
}

onModalDetallesClose(): void {
  this.mostrarModalDetalles = false;
  setTimeout(() => {
    this.modalSectoresVisible = true;
  });
}

openTiposModal() {
  this.modalTiposVisible = true;
}

onModalTiposClose() {
  this.modalTiposVisible = false;
}

abrirModalDetallesTipo(idTipoProyecto: number): void {
  setTimeout(() => {
    this.tipoProyectoSeleccionado = idTipoProyecto;
    this.mostrarModalDetallesTipo = true;
  });
  this.modalTiposVisible = false;
}

onModalDetallesTipoClose(): void {
  this.mostrarModalDetallesTipo = false;
  setTimeout(() => {
    this.modalTiposVisible = true;
  });
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
