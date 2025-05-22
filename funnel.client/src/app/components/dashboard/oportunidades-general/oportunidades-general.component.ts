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
  quadrants = [
    { cards: [{id: 1, titulo: 'Indicadores por Etapa'}],},
    { cards: [{id: 2, titulo: 'Oportunidades por Sector'}],},
    { cards: [{id: 3, titulo: 'Oportunidades por Tipo'}],},
    { cards: [],}
  ];
  get dropListIds() {
    return this.quadrants.map((_, index) => `dropList${index}`);
  }
  infoCargada: boolean = false;
  constructor(private readonly graficasService: GraficasService,
    private readonly sessionService: LoginService) { }
  
  
    public graph: any;
  
  getRandomColor() {
    let color = '#';
    let letters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }
  ngOnInit(): void {
    this.consultarGraficaStage();
  }
 
  

  consultarGraficaStage(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa(); // Obtén el IdEmpresa de la sesión
    const request: RequestGraficasDto = {
      bandera: 'SEL-OPORTUNIDAD-STAGE',
      idEmpresa: idEmpresa
    };
  
    this.graficasService.obtenerGraficaData(request).subscribe({
      next: (response: GraficasDto[]) => {
      
  
        // Procesar los datos para Plotly
        const dataAGraficar: any = [{
          type: 'funnel',
          x: response.map(item => item.valor), // Combina todos los valores en un solo array
          y: response.map(item => item.label ?? 'Sin etiqueta'), // Combina todas las etiquetas en un solo array
         
          textfont: { family: "Old Standard TT", size: 13, color: "black" },
          hoverinfo: 'percent total+x', 
          marker: {color: response.map(item => item.coloreSerie ?? this.getRandomColor()),
            line: {"width": [4, 2, 2, 3, 1, 1], color: response.map(item => item.coloreSerie ?? this.getRandomColor())}},
            connector: {line: {color: "royalblue", dash: "dot", width: 3}}
        }];

        // Configuración del layout
        const layOutGrafica: any = {
          title: {
            text: 'Indicadores por Etapa',
          },
          margin: { l: 50, r: 50, b: 130, t: 60 },
          barmode: "group"
        };
        this.graph = {
          data: dataAGraficar,
          layout: layOutGrafica ,
          config: {displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: true, displayModeBar: true}
        }
        // Renderizar la gráfica con Plotly
        this.infoCargada = true;
        console.log(this.graph);
        import('plotly.js-dist-min').then(ploty => {
          ploty.newPlot("prueba", dataAGraficar, layOutGrafica, { displaylogo: false, responsive: true, locale: 'es-ES' });
        });
      },
      error: (err:any) => {
        console.error('Error al consultar la gráfica:', err);
      }
    });
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedItem = event.previousContainer.data[event.previousIndex];
      const targetList = event.container.data;
      console.log(targetList[0] );
      if (targetList.length > 0 && targetList[0] !== undefined) {
        // Hay un item en el destino: intercambiar
        const targetItem = targetList[0];
        
        event.previousContainer.data[event.previousIndex] = targetItem;
        targetList[0] = draggedItem;
      } else {
        // El destino está vacío: solo mover
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
