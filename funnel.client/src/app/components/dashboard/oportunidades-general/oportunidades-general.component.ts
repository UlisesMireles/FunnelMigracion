import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-oportunidades-general',
  standalone: false,
  templateUrl: './oportunidades-general.component.html',
  styleUrl: './oportunidades-general.component.css',
  encapsulation: ViewEncapsulation.None
})
export class OportunidadesGeneralComponent {
  constructor() { }
  public graph = {
    data: [{type: 'funnelarea', values: [5, 4, 3, 2, 1], text: ["The 1st", "The 2nd", "The 3rd", "The 4th", "The 5th"],
      marker: {colors: ["59D4E8", "DDB6C6", "A696C8", "67EACA", "94D2E6"],
                line: {color: ["3E4E88", "606470", "3E4E88", "606470", "3E4E88"], width: [2, 1, 5, 0, 3]}},
      textfont: {family: "Old Standard TT", size: 13, color: "black"}, opacity: 0.65}],
    layout: {autosize: true,  margin: { l: 20, r: 20, t: 20, b: 20 }, width: 600, height: 300, funnelmode: "stack", showlegend: 'True'},
    config: {displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: true, displayModeBar: true}
  };
  
  getRandomColor() {
    let color = '#';
    let letters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }
  ngOnInit(): void {
    var dataAGraficar: any[] = [];

    let layOutGrafica: any = {
      title: {
        text: 'Hola'
      },
      showlegend: true,
      margin: { l: 50, r: 50, b: 130, t: 60 }
    };
    
    layOutGrafica.barmode = "group";
    
    layOutGrafica.title.text = 'Sin Datos para graficar';
    
    dataAGraficar.push({
      type: 'funnelarea',
      values: [5, 4, 3, 2, 1],
      text: ["The 1st", "The 2nd", "The 3rd", "The 4th", "The 5th"],
      marker: {
        colors: ["59D4E8", "DDB6C6", "A696C8", "67EACA", "94D2E6"],
        line: {
          color: ["3E4E88", "606470", "3E4E88", "606470", "3E4E88"],
          width: [2, 1, 5, 0, 3]
        }
      },
      textfont: { family: "Old Standard TT", size: 13, color: "black" },
      opacity: 0.65
    });
    import('plotly.js-dist-min').then(ploty => {
      ploty.newPlot("prueba", dataAGraficar, layOutGrafica, { displaylogo: false, responsive: true, locale: 'es-ES' });
    });
  }
 
  quadrants = [
    { cards: [{id: 1, titulo: 'Indicadores por Etapa'}],},
    { cards: [{id: 2, titulo: 'Oportunidades por Sector'}],},
    { cards: [{id: 3, titulo: 'Oportunidades por Tipo'}],},
    { cards: [],}
  ];
  get dropListIds() {
    return this.quadrants.map((_, index) => `dropList${index}`);
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
