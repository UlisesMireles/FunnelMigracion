import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GraficasDto, RequestGraficasDto, AgenteDto, Sectores, SectoresDetalles, OportunidadesTipo, OportunidadesTipoDetalles, OportunidadAgenteCliente, TipoOportunidadAgente, DetalleTipoOportunidadAgente } from '../interfaces/graficas';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  baseUrl: string = environment.baseURL;

  constructor(private readonly http: HttpClient) { }

  obtenerGraficaData(data: RequestGraficasDto): Observable<GraficasDto[]> {
    return this.http.post<GraficasDto[]>(`${this.baseUrl}api/Graficas/ObtenerGraficaOportunidades`, data);
  }
  obtenerGraficaAgentesData(data: RequestGraficasDto): Observable<GraficasDto[]> {
    return this.http.post<GraficasDto[]>(`${this.baseUrl}api/Graficas/ObtenerGraficaAgentes`, data);
  }
  obtenerAgentesData(data: RequestGraficasDto): Observable<AgenteDto[]> {
    return this.http.post<AgenteDto[]>(`${this.baseUrl}api/Graficas/ObtenerAgentes`, data);
  }
  obtenerAnios(idEmpresa: number, idEstatusOportunidad: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Graficas/Anios`, {
      params: {
        IdEmpresa: idEmpresa.toString(),
        IdEstatusOportunidad: idEstatusOportunidad.toString()
      }
    });
  }
  obtenerGraficaGanadasData(data: RequestGraficasDto): Observable<GraficasDto[]> {
    return this.http.post<GraficasDto[]>(`${this.baseUrl}api/Graficas/ObtenerGraficaGanadasAnio`, data);
  }
  obtenerAgentesPorAnioData(data: RequestGraficasDto): Observable<AgenteDto[]> {
    return this.http.post<AgenteDto[]>(`${this.baseUrl}api/Graficas/ObtenerAgentesPorAnio`, data);
  }
  obtenerGraficaAgentesPorAnioData(data: RequestGraficasDto): Observable<GraficasDto[]> {
    return this.http.post<GraficasDto[]>(`${this.baseUrl}api/Graficas/ObtenerGraficaAgentesPorAnio`, data);
  }

  obtenerGraficaClientesTopVeinteData(data: RequestGraficasDto): Observable<GraficasDto[]> {
    return this.http.post<GraficasDto[]>(`${this.baseUrl}api/Graficas/ObtenerGraficaClientesTopVeinte`, data);
  }
  getRandomColor(): string {
    let color = '#';
    let letters = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

 createCard(id: number, titulo: string, tipo: 'tabla' | 'grafica') {
  return {
    id,
    titulo,
    tipo,
    infoCargada: false,
    maximizada: false, 
    grafica: {
      data: [],
      layout: {},
      config: { displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: true, displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','resetScale2d','zoomIn2d','zoomOut2d', 'autoScale2d', 'zoom2d', 'sendDataToCloud', 'editInChartStudio', 'zoom3d', 'pan3d', 'orbitRotation', 'tableRotation', 'resetCameraDefault3d', 'resetCameraLastSave3d']
       }
    },
    tabla:[]
  };
}
createCardPorAnio(id: number, titulo: string, tipo: 'tabla' | 'grafica') {
  return {
    id,
    titulo,
    tipo,
    infoCargada: false,
    grafica: {
      data: [],
      layout: {},
      config: { displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: false, displayModeBar: true,
      modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
       }
    },
    tabla:[]
  };
}


  createPieData(items: GraficasDto[]) {
    return {
      type: 'pie',
      values: items.map(item => item.valor),
      labels: items.map(item => item.label ?? 'Sin etiqueta'),
      textposition: "outside",
      textinfo: "label+percent",
      automargin: true,
      marker: {
        color: items.map(item => item.coloreSerie ?? this.getRandomColor())
      }
    };
  }

  createPieDataTop20(items: GraficasDto[]) {
    return {
      type: 'pie',
      values: items.map(item => item.valor),
      labels: items.map(item => item.label ?? 'Sin etiqueta'),
      hovertemplate: '%{label}<br>(%{value}%<extra></extra>)',
      automargin: true,
      marker: {
        color: items.map(item => item.coloreSerie ?? this.getRandomColor())
      }
    };
  }
  createPieMontoData(items: GraficasDto[]) {
    return {
      type: 'pie',
      values: items.map(item => item.valor),
      labels: items.map(item => item.label ?? 'Sin etiqueta'),
      text: items.map(item => item.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })),
      textposition: "outside",
      textinfo: "label+text",
      hovertemplate: '%{label}<br>(%{percent}<extra></extra>)',
      automargin: true,
      marker: {
        color: items.map(item => item.coloreSerie ?? this.getRandomColor())
      }
    };
  }

  createPieLayout(showlegend:boolean = false) {
    return {
      margin: { t: 0, b: 100, l: 0, r: 100 },
      height: 320,
      showlegend: showlegend,
      autosize: true
    };
  }
  createBarData(items: GraficasDto[]) {
    return {
      type: 'bar',
      y: items.map(item => item.valor),
      x: items.map(item => item.label ?? 'Sin etiqueta'),
      text: items.map(item => item.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })), 
      name: 'Monto',
      marker: {
        color: items.map(item => '#1F77B4')
      }
    };
  }
  createBarHorizontalData(items: GraficasDto[]) {
    return {
      type: 'bar',
      x: items.map(item => item.valor),
      y: items.map(item => item.label ?? 'Sin etiqueta'),
      text: items.map(item => item.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })),
      hovertemplate: 'Monto: <b>%{text}</b><extra></extra>',
      orientation: 'h',
      name: 'Monto',
      marker: {
        color: items.map(item => '#1F77B4')
      }
    };
  }
  createBarHorizontalNormalizadoData(items: GraficasDto[]) {
    return {
      type: 'bar',
      x: items.map(item => item.montoNormalizado),
      y: items.map(item => item.label ?? 'Sin etiqueta'),
      hovertemplate: 'Monto Normalizado: <b>%{text}</b><extra></extra>',
      text: items.map(item => item.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })),
      name: 'Monto Normalizado',
      orientation: 'h',
      marker: {
        color: items.map(item => item.coloreSerie ?? this.getRandomColor())
      }
    };
  }
  createBarVerticalData(items: GraficasDto[], color: string, name: string, hovertemplate: string, text: string[],customdata: string[] , valor2: boolean) {
    return {
      type: 'bar',
      y: valor2 ? items.map(item => item.valor2) : items.map(item => item.valor),
      x: items.map(item => item.label ?? 'Sin etiqueta'),
      text: text,
      customdata: customdata,
      hovertemplate: hovertemplate,
      textposition: "outside",
      name: name,
      marker: {
        color: items.map(item => color ?? this.getRandomColor())
      }
    };
  }
  createFunnelData(items: GraficasDto[]) {
    return {
      type: 'funnel',
      x: [100, 80, 60, 40, 20],
      hovertemplate: '<b>%{text}</b><extra></extra>',
      text: items.map(item => '<b>' + item.label + '</b><br>' + item.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })),
      texttemplate: '%{text}',
      textfont: { family: "Old Standard TT", size: 13, color: "black" },
      marker: {
        color: items.map(item => item.coloreSerie ?? this.getRandomColor())
      }
    };
  }
  createBarHorizontalLayout() {
    return {
      margin: { l: 130, r: 40, b: 100, t: 30 },
      height: 320,
      autosize: true
    };
  }
  createBarLayout() {
    return {
      margin: { l: 50, r: 50, b: 120, t: 0 },
      height: 320,
      autosize: true
    };
  }

  createBarGroupLayout() {
    return {
      barmode: 'group', 
      margin: { l: 130, r: 40, b: 100, t: 30 }, 
      height: 320,
      autosize: true

    };
  }

  createFunnelLayout() {
    return {
      margin: { l: 50, r: 70, b: 60, t: 30 },
      height: 320,
      autosize: true,
      yaxis: { visible: false, showticklabels: false, showgrid: false, zeroline: false },
      xaxis: { visible: false, showticklabels: false, showgrid: false, zeroline: false }
    }
  }

  createBarPorcentajeData(items: GraficasDto[]) {
    return {
      type: 'bar',
      y: items.map(item => item.valor),
      x: items.map(item => item.label ?? 'Sin etiqueta'),
      text: items.map(item => item.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })), 
      textposition: 'auto', 
      hovertemplate: '<b>%{x}</b><br> (<b>%{customdata}</b><extra></extra>)', 
      customdata: items.map(item => `${item.porcentaje?.toFixed(2) ?? 0}%`), 
      marker: {
        color: items.map(item => item.coloreSerie ?? this.getRandomColor())
      }
    };
  }
  createBarNormalizadoData(items: GraficasDto[]) {
    return {
      type: 'bar',
      yield: items.map(item => item.montoNormalizado),
      x: items.map(item => item.label ?? 'Sin etiqueta'),
      text: items.map(item => item.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })),
      name: 'Monto Normalizado',
    }
  }

  obtenerOportunidadesPorSector(data: RequestGraficasDto): Observable<Sectores[]> {
    const requestData = {
      ...data,
      bandera: 'SEL-AGENTE-SECTOR'
    };
    return this.http.post<Sectores[]>(`${this.baseUrl}api/Graficas/ObtenerOportunidadesPorSector`, requestData);
  }

  obtenerDetalleOportunidadesSector(idSector: number, data: RequestGraficasDto): Observable<SectoresDetalles[]> {
    return this.http.post<SectoresDetalles[]>(
      `${this.baseUrl}api/Graficas/ObtenerDetalleOportunidadesSector/${idSector}`,
      data
    );
  }

  obtenerOportunidadesPorTipo(data: RequestGraficasDto): Observable<OportunidadesTipo[]> {
    const requestData = {
      ...data,
      bandera: 'SEL-OPORTUNIDAD-STAGE'
    };
    return this.http.post<OportunidadesTipo[]>(`${this.baseUrl}api/Graficas/ObtenerOportunidadesPorTipo`, requestData);
  }

  obtenerDetalleOportunidadesTipo(idEtapa: number, data: RequestGraficasDto): Observable<OportunidadesTipoDetalles[]> {
    return this.http.post<OportunidadesTipoDetalles[]>(
      `${this.baseUrl}api/Graficas/ObtenerDetalleOportunidadesTipo/${idEtapa}`,
      data
    );
  }

  obtenerOportunidadesPorAgenteClientes(data: RequestGraficasDto): Observable<OportunidadAgenteCliente[]> {
  const requestData = {
    ...data,
    bandera: 'SEL-OPORTUNIDADES-AGENTE'
  };
  return this.http.post<OportunidadAgenteCliente[]>(
    `${this.baseUrl}api/Graficas/ObtenerOportunidadesPorAgenteClientes`, 
    requestData
  );
}


obtenerOportunidadesPorAgenteTipo(data: RequestGraficasDto): Observable<TipoOportunidadAgente[]> {
  const requestData = {
    ...data,
    bandera: 'SEL-TIPO-OPOR-AGENTE'
  };
  return this.http.post<TipoOportunidadAgente[]>(
    `${this.baseUrl}api/Graficas/ObtenerOportunidadesPorAgenteTipo`, 
    requestData
  );
}

obtenerDetalleOportunidadesTipoAgente(
  idAgente: number, 
  idTipoOporAgente: number, 
  data: RequestGraficasDto
): Observable<DetalleTipoOportunidadAgente[]> {
  return this.http.post<DetalleTipoOportunidadAgente[]>(
    `${this.baseUrl}api/Graficas/ObtenerDetalleOportunidadesTipoAgente/${idAgente}/${idTipoOporAgente}`,
    data
  );
}
}
