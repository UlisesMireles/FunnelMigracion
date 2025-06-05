import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewEncapsulation } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { GraficasService } from '../../../../services/graficas.service';
import { GraficasDto, RequestGraficasDto } from '../../../../interfaces/graficas';
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
  aniosDisponibles: number[] = [];
  anioSeleccionado: number = new Date().getFullYear();
  loading: boolean = true;

  constructor(
    private readonly graficasService: GraficasService,
    private readonly sessionService: LoginService
  ) {
    this.quadrants = [
    { cards: [this.graficasService.createCard(1, 'Gráfica Anual por Clientes', 'grafica')] },
    { cards: [this.graficasService.createCard(2, 'Gráfica Anual por Tipo de Proyecto', 'grafica')] },
    { cards: [this.graficasService.createCard(3, 'Ventas Anuales', 'grafica')] },
    { cards: [] }
  ];

  }
  
  public graph: any;

  ngOnInit(): void {
    this.consultarGraficaClientes();
    this.consultarGraficaTipoProyecto();
    //this.consultarGraficaVentasAnuales();
    this.obtenerAniosDisponibles();
  }
 obtenerAniosDisponibles(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const idEstatusOportunidad = 2;
    const request: RequestGraficasDto = {
      bandera: 'SEL-ANIOS-DISPONIBLES',
      idEmpresa,
      idEstatusOportunidad,
    };

    this.graficasService.obtenerAnios(idEmpresa, idEstatusOportunidad).subscribe({
      next: (response: any[]) => {
        this.aniosDisponibles = response.map(item => item.Anio);
        if (this.aniosDisponibles.length > 0) {
          this.anioSeleccionado = Math.max(...this.aniosDisponibles);
          this.consultarTodasGraficas();
        }
        this.loading = false;
        console.log(this.aniosDisponibles);
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
    // this.consultarGraficaVentasAnuales();
  }
  private setGraficaData(quadrantIdx: number, cardIdx: number, data: any, layout: any) {
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.data = data;
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.layout = layout;
    this.quadrants[quadrantIdx].cards[cardIdx].infoCargada = true;
  }

  
  consultarGraficaClientes(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const idEstatusOportunidad = 2;
    const request: RequestGraficasDto = {
      bandera: 'SEL-CLIENTES-ANIO',
      idEmpresa,
      idEstatusOportunidad,
      anio: this.anioSeleccionado
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
  consultarGraficaTipoProyecto(): void {
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SEL-TIPO-ANIO',
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
