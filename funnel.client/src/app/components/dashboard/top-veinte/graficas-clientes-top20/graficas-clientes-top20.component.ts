import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { GraficasService } from '../../../../services/graficas.service';
import { LoginService } from '../../../../services/login.service';
import { GraficasDto, RequestGraficasDto } from '../../../../interfaces/graficas';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProspectoService } from '../../../../services/prospecto.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-graficas-clientes-top20',
  standalone: false,
  templateUrl: './graficas-clientes-top20.component.html',
  styleUrl: './graficas-clientes-top20.component.css'
})
export class GraficasClientesTop20Component {
  quadrants: { cards: any[] }[] = [];
  baseUrl: string = environment.baseURL;

  get dropListIds() {
    return this.quadrants.map((_, index) => `cardList${index}`);
  }
  infoCargada: boolean = false;

  yearsGrafica: string[] = [];
  selectedYear: string = 'Todos los Años';

  constructor(private messageService: MessageService, private readonly graficasService: GraficasService, private prospectoService: ProspectoService, private loginService: LoginService, private readonly sessionService: LoginService) {
    this.quadrants = [
      { cards: [this.graficasService.createCard(0, 'Distribución de Oportunidades por Sector (Alto Rendimiento)', 'grafica')] },
      { cards: [this.graficasService.createCard(1, 'Top 10 Clientes', 'grafica')] }
    ];
  }

  ngOnInit(): void {
    this.baseUrl = this.baseUrl + '/Fotografia/';
    this.getAniosGraficas();
  }

  getAniosGraficas() {
    this.prospectoService.getAniosGraficas(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any[]) => {
        this.yearsGrafica = result.map((item: any) => item.anio.toString());
        this.yearsGrafica.unshift("Todos los Años");
        console.log("anios",this.yearsGrafica)
        this.consultarGraficaOportunidadesPorSector()
        this.consultarGraficaPorcentajeOportunidadesGanadas()
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });

  }

  consultarGraficaOportunidadesPorSector() {
    let anioSeleccionado = this.selectedYear === "Todos los Años" ? undefined : parseInt(this.selectedYear);
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SELECT-TOPVEINTE-SECTORES',
      idEmpresa: idEmpresa,
      anio: anioSeleccionado
    };

    this.graficasService.obtenerGraficaClientesTopVeinteData(request).subscribe({
      next: (response: GraficasDto[]) => {
        const dataAGraficar = [this.graficasService.createPieDataTop20(response)];
        const layOutGrafica = this.graficasService.createPieLayout(true);
        this.setGraficaData(0, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });

  }

  consultarGraficaPorcentajeOportunidadesGanadas(): void {
    let anioSeleccionado = this.selectedYear === "Todos los Años" ? undefined : parseInt(this.selectedYear);
    const idEmpresa = this.sessionService.obtenerIdEmpresa();
    const request: RequestGraficasDto = {
      bandera: 'SELECT-TOPDIEZ-CLIENTES-ORDER',
      idEmpresa: idEmpresa,
      anio: anioSeleccionado
    };

    this.graficasService.obtenerGraficaClientesTopVeinteData(request).subscribe({
      next: (response: GraficasDto[]) => {
        let text = response.map(item => item.valor.toString())
        let text2 = response.map(item => item.valor2.toString())
        let customdata = response.map(item => item.porcentaje?.toFixed(2) ?? "")
        let hovertemplate = 'Porcentaje Ganado: <b>%{customdata}</b><extra></extra>';
        const dataAGraficar = [
          this.graficasService.createBarVerticalData(response, "#b94d0a", "Oportunidades Solicitadas", hovertemplate, text, customdata, false),
          this.graficasService.createBarVerticalData(response, "#1F77B4", "Oportunidades Ganadas", hovertemplate, text2, customdata, true)
        ];
        const layOutGrafica = this.graficasService.createBarGroupLayout();
        this.setGraficaData(1, 0, dataAGraficar, layOutGrafica);
      },
      error: (err: any) => console.error('Error al consultar la gráfica:', err)
    });
  }

  private setGraficaData(quadrantIdx: number, cardIdx: number, data: any, layout: any) {
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.data = data;
    this.quadrants[quadrantIdx].cards[cardIdx].grafica.layout = layout;
    this.quadrants[quadrantIdx].cards[cardIdx].infoCargada = true;
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

  onYearChangeGrafica() {
    this.consultarGraficaOportunidadesPorSector()
    this.consultarGraficaPorcentajeOportunidadesGanadas()
  }

}
