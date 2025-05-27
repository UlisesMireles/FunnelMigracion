import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewEncapsulation } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { GraficasService } from '../../../services/graficas.service';
import { GraficasDto, RequestGraficasDto } from '../../../interfaces/graficas';
import { head } from 'lodash-es';
@Component({
  selector: 'app-oportunidades-general',
  standalone: false,
  templateUrl: './oportunidades-general.component.html',
  styleUrl: './oportunidades-general.component.css',
  encapsulation: ViewEncapsulation.None
})
export class OportunidadesGeneralComponent {
  quadrants = [
    {
      cards: [
        {
          id: 1,
          titulo: 'Indicadores por Etapa',
          grafica: {
            data: [],
            layout: {},
            config: { displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: true, displayModeBar: true }
          }
        }
      ]
    },
    {
      cards: [{
        id: 2,
        titulo: 'Oportunidades por Sector',
        grafica: {
          data: [],
          layout: {},
          config: { displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: true, displayModeBar: true }
        }
      }],
    },
    {
      cards: [{
        id: 3,
        titulo: 'Oportunidades por Tipo',
        grafica: {
          data: [],
          layout: {},
          config: { displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: true, displayModeBar: true }
        }
      }],
    },
    { cards: [], }
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
          x: response.map(item => item.valor), 
          text: response.map(item => item.label ?? 'Sin etiqueta'), 
          textfont: { family: "Old Standard TT", size: 13, color: "black" },
          hoverinfo: 'percent total+x',
          marker: {
            color: response.map(item => item.coloreSerie ?? this.getRandomColor())
          },
          connector: { line: { color: "royalblue", dash: "dot", width: 3 } }
        }];

        // Configuración del layout
        const layOutGrafica: any = {
          margin: { l: 50, r: 50, b: 130, t: 60 },
          height: 630,
          yaxis: {
            visible: false, // Oculta el eje Y completamente
            showticklabels: false, // Opcional: oculta etiquetas
            showgrid: false,       // Opcional: oculta la cuadrícula
            zeroline: false        // Opcional: oculta la línea cero
          },
        };
        // Asignar los datos y el layout a la gráfica
        this.quadrants[0].cards[0].grafica.data = dataAGraficar;
        this.quadrants[0].cards[0].grafica.layout = layOutGrafica;
        // Renderizar la gráfica con Plotly
        this.infoCargada = true;

      },
      error: (err: any) => {
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
      console.log(targetList[0]);
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
