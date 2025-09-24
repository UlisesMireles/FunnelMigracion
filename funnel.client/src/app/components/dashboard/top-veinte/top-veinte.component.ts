import { ChangeDetectorRef, Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';
import { ProspectoService } from '../../../services/prospecto.service';
import { ClientesTopVeinte } from '../../../interfaces/prospecto';
import { LoginService } from '../../../services/login.service';
import { ColumnasDisponiblesComponent } from '../../utils/tablas/columnas-disponibles/columnas-disponibles.component';
import { ConsultaAsistenteDto } from '../../../interfaces/asistentes/consultaAsistente';
import { OpenIaService } from '../../../services/asistentes/openIA.service';
import { Subscription } from 'rxjs';
import { AsistenteService } from '../../../services/asistentes/asistente.service';
import { TopVeinteDataService } from '../../../services/top-veinte-data.service';
import { EnumLicencias } from '../../../enums/enumLicencias';
@Component({
  selector: 'app-top-veinte',
  standalone: false,
  templateUrl: './top-veinte.component.html',
  styleUrl: './top-veinte.component.css'
})
export class TopVeinteComponent implements OnInit {
  @ViewChild('dt')
  dt!: Table;


  disableProspectos = true;
  isDescargando = false;
  anchoTabla = 100;
  topveinte: ClientesTopVeinte[] = [];
  TopVeinteOriginal: ClientesTopVeinte[] = [];
  TopVeinteSeleccionado!: ClientesTopVeinte;


  loading: boolean = true;
  loadingAsistente: boolean = false;
  insertar: boolean = false;
  modalVisible: boolean = false;
  selectedEstatus: any = null;
  copiado: boolean = false;
  visibleRespuesta = false;
  respuestaAsistente: string = '';
  maximizedRespuesta: boolean = false;

  years: string[] = [];
  selectedYear: string = 'Todos los Años';
  leyendo: boolean = false;
  vocesDisponibles: SpeechSynthesisVoice[] = [];
  vozSeleccionada: SpeechSynthesisVoice | null = null;



  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [
    { key: 'nombre', isCheck: true, valor: 'Nombre', groupHeader: '', isIgnore: false, tipoFormato: 'text' },
    { key: 'nombreSector', isCheck: true, valor: 'Sector de la industria', groupHeader: '', isIgnore: false, tipoFormato: 'text' },
    { key: 'ubicacionFisica', isCheck: true, valor: 'Ubicación Física', groupHeader: '', isIgnore: false, tipoFormato: 'text' },
    { key: 'ultimaFechaRegistro', isCheck: true, valor: 'Ultimo Registro', groupHeader: '', isIgnore: false, tipoFormato: 'date' },
    { key: 'totalOportunidades', isCheck: true, valor: 'Oportunidades Totales', groupHeader: '', isIgnore: false, tipoFormato: 'number' },
    { key: 'ganadas', isCheck: true, valor: 'Total Ganadas', groupHeader: 'Ganadas', isIgnore: false, tipoFormato: 'number', colspan: 1, isSubHeader: true },
    { key: 'porcGanadas', isCheck: true, valor: '% Ganadas', groupHeader: 'Ganadas', isIgnore: false, tipoFormato: 'percent', colspan: 1, isSubHeader: true },
    { key: 'perdidas', isCheck: true, valor: 'Total Perdidas', groupHeader: 'Perdidas', isIgnore: false, tipoFormato: 'number', colspan: 1, isSubHeader: true },
    { key: 'porcPerdidas', isCheck: true, valor: '% Perdidas', groupHeader: 'Perdidas', isIgnore: false, tipoFormato: 'percent', colspan: 1, isSubHeader: true },
    { key: 'canceladas', isCheck: true, valor: 'Total Canceladas', groupHeader: 'Canceladas', isIgnore: false, tipoFormato: 'number', colspan: 1, isSubHeader: true },
    { key: 'porcCanceladas', isCheck: true, valor: '% Canceladas', groupHeader: 'Canceladas', isIgnore: false, tipoFormato: 'percent', colspan: 1, isSubHeader: true },
    { key: 'eliminadas', isCheck: true, valor: 'Total Eliminadas', groupHeader: 'Eliminadas', isIgnore: false, tipoFormato: 'number', colspan: 1, isSubHeader: true },
    { key: 'porcEliminadas', isCheck: true, valor: '% Eliminadas', groupHeader: 'Eliminadas', isIgnore: false, tipoFormato: 'percent', colspan: 1, isSubHeader: true },
    { key: 'proceso', isCheck: true, valor: 'En Proceso', groupHeader: '', isIgnore: false, tipoFormato: 'number' },
    { key: 'desEstatus', isCheck: true, valor: 'Estatus', groupHeader: '', isIgnore: false, tipoFormato: 'estatus' }
  ];

  licenciaPlatino: boolean = false;
  columnsAMostrarResp = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp = JSON.stringify(this.lsTodasColumnas);
  disabledPdf: boolean = false;

  constructor(private messageService: MessageService, private cdr: ChangeDetectorRef, private prospectoService: ProspectoService, private loginService: LoginService, public dialog: MatDialog, private openIaService: OpenIaService,
    public asistenteService: AsistenteService, private topVeinteDataService: TopVeinteDataService
  ) { }

  ngOnInit(): void {
    this.licenciaPlatino = localStorage.getItem('licencia')! === EnumLicencias.Platino;
    this.cargarVozPreferida();
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);    
    this.getAniosOportunidades();
    document.documentElement.style.fontSize = 12 + 'px';
  }

  getAniosOportunidades() {
    const idProceso = Number(localStorage.getItem('idProceso'));
    this.prospectoService.getAniosOportunidades(this.loginService.obtenerIdEmpresa(), idProceso).subscribe({
      next: (result: any[]) => {
        this.years = result.map((item: any) => item.anio.toString());
        this.years.unshift("Todos los Años");
        this.getTopVeinte();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      },
    });

  }

  getTopVeinte() {
    let anioSeleccionado = this.selectedYear === "Todos los Años" ? '' : this.selectedYear.toString();
    this.prospectoService.getTopVeinte(this.loginService.obtenerIdEmpresa(), anioSeleccionado).subscribe({
      next: (result: ClientesTopVeinte[]) => {
        this.TopVeinteOriginal = result;
        const opDataSet = result.filter(ClientesTopVeinte => {
          if (this.selectedYear === "Todos los Años") {
            return ClientesTopVeinte.porcGanadas > 75;

          }
          else {
            //Si es un año específico
            return ClientesTopVeinte.porcGanadas > 75 &&
                  ClientesTopVeinte.totalOportunidades >= 5 &&
                  ClientesTopVeinte.ganadas >= 1;
          }
        });

this.topVeinteDataService.updateTop20Data(opDataSet);
        this.selectedEstatus = 'Activo';
        this.cdr.detectChanges();
        this.loading = false;
        this.FiltrarPorEstatus();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      },
    });
  }

  FiltrarPorEstatus() {
  this.topveinte = this.selectedEstatus === null
    ? [...this.TopVeinteOriginal]
    : [...this.TopVeinteOriginal.filter((x) => x.desEstatus === this.selectedEstatus)];

  // Filtro de porcentaje + condiciones extra si no es "Todos los Años"
  const opDataSet = this.topveinte.filter(item => {
    if (this.selectedYear === "Todos los Años") {
      return item.porcGanadas > 75;
    } else {
      return item.porcGanadas > 75 && item.totalOportunidades >= 5 && item.ganadas >= 1;
    }
  });

  this.topVeinteDataService.updateTop20Data(opDataSet);

  if (this.dt) {
    this.dt.first = 0;
  }
}


  onYearChange() {
    this.getTopVeinte();
  }

  onModalClose() {
    this.modalVisible = false;
    if (this.leyendo) {
      window.speechSynthesis.cancel();
      this.leyendo = false;
    }
  }

  manejarResultado(result: baseOut) {
    if (result.result) {
      this.messageService.add({
        severity: 'success',
        summary: 'La operación se realizó con éxito.',
        detail: result.errorMessage,
      });
      this.getTopVeinte();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }
  clear(table: Table) {
    this.selectedYear = 'Todos los Años';
    table.clear();
    this.getTopVeinte();
    this.lsColumnasAMostrar = JSON.parse(this.columnsAMostrarResp);
    this.lsTodasColumnas = JSON.parse(this.columnsTodasResp);
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.anchoTabla = 100;
  }

  agregarColumna(event: any) {
    const targetAttr = event.target.getBoundingClientRect();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.backdropClass = 'popUpBackDropClass';
    dialogConfig.panelClass = 'popUpPanelAddColumnClass';
    dialogConfig.width = '50px';

    dialogConfig.data = {
      todosColumnas: this.lsTodasColumnas
    };

    dialogConfig.position = {
      top: targetAttr.y + targetAttr.height + 10 + "px",
      left: targetAttr.x - targetAttr.width - 240 + "px"
    };
    const dialogRef = this.dialog.open(ColumnasDisponiblesComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.lsColumnasAMostrar = JSON.parse(this.columnsAMostrarResp);
        const selectedColumns = r.filter((f: any) => f.isCheck);

        selectedColumns.forEach((element: any) => {
          this.lsColumnasAMostrar.push(element)
        });
        if (this.lsColumnasAMostrar.length > 5) {
          this.anchoTabla = 100
        }
      }
    });
  }

  exportExcel(table: Table) {
    let lsColumnasAMostrar = this.lsColumnasAMostrar.filter(col => col.isCheck);
    let columnasAMostrarKeys = lsColumnasAMostrar.map(col => col.key);

    let dataExport = (table.filteredValue || table.value || []).map(row => {
      return columnasAMostrarKeys.reduce((acc, key) => {
        acc[key] = row[key];
        return acc;
      }, {} as { [key: string]: any });
    });

    import('xlsx').then(xlsx => {
      const hojadeCalculo: import('xlsx').WorkSheet = xlsx.utils.json_to_sheet(dataExport);
      const libro: import('xlsx').WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Clientes Top 20");
      xlsx.writeFile(libro, "Clientes Top 20.xlsx");
    });
  }

  exportPdf(table: Table) {
    let lsColumnasAMostrar = this.lsColumnasAMostrar.filter(col => col.isCheck);
    let columnasAMostrarKeys = lsColumnasAMostrar.map(col => col.key);

    let dataExport = (table.filteredValue || table.value || []).map(row => {
      return columnasAMostrarKeys.reduce((acc, key) => {
        acc[key] = row[key];
        return acc;
      }, {} as { [key: string]: any });
    });

    let data = {
      columnas: lsColumnasAMostrar,
      datos: dataExport,
      anio: this.selectedYear
    }

    if (dataExport.length == 0)
      return

    this.disabledPdf = true;


    this.prospectoService.descargarReporteTop20(data, this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Clientes_Top_20.pdf';
        link.click();
        URL.revokeObjectURL(url);
        this.disabledPdf = false;

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error al generar reporte',
          detail: error.errorMessage,
        });
        this.disabledPdf = false;
      },
    });

  }

  obtenerArregloFiltros(data: any[], columna: string): any[] {
    const lsGroupBy = groupBy(data, columna);
    return sortBy(getKeys(lsGroupBy));
  }

  getColumnWidth(key: string): object {
    const widths: { [key: string]: string } = {
      nombre: '100%',
      nombreSector: '100%',
      ubicacionFisica: '100%',
      totalOportunidades: '100%',
      proceso: '100%',
      ganadas: '100%',
      porcGanadas: '100%',
      perdidas: '100%',
      porcPerdidas: '100%',
      canceladas: '100%',
      porcCanceladas: '100%',
      eliminadas: '100%',
      porcEliminadas: '100%',
      desEstatus: '100%',
      ultimaFechaRegistro: '100px',
    };
    return { width: widths[key] || 'auto' };
  }

  enviarSeguimiento() {
    const Datos = this.TopVeinteOriginal.map(item => ({
      nombre: item.nombre,
      sector: item.nombreSector,
      ubicacion: item.ubicacionFisica,
      totalOportunidades: item.totalOportunidades,
      ganadas: item.ganadas,
      porcGanadas: item.porcGanadas,
      perdidas: item.perdidas,
      porcPerdidas: item.porcPerdidas,
      eliminadas: item.eliminadas,
      porcEliminadas: item.porcEliminadas,
      canceladas: item.canceladas,
      porcCanceladas: item.porcCanceladas,
      proceso: item.proceso,
      ultimaFechaRegistro: item.ultimaFechaRegistro ? item.ultimaFechaRegistro : null,
    }));

    const historialTexto = Datos.map(c => {
      return `
        Nombre: ${c.nombre}
        Sector: ${c.sector}
        Ubicación: ${c.ubicacion}
        Ultima Oportunidad registrada el día: ${c.ultimaFechaRegistro}
        Total de Oportunidades: ${c.totalOportunidades}
        - Ganadas: ${c.ganadas} (${c.porcGanadas}%)
        - Perdidas: ${c.perdidas} (${c.porcPerdidas}%)
        - Eliminadas: ${c.eliminadas} (${c.porcEliminadas}%)
        - Canceladas: ${c.canceladas} (${c.porcCanceladas}%)
        - En proceso: ${c.proceso}
        -----------------------------`;
    }).join('\n');

    const pregunta = `A continuación se presenta un resumen de las oportunidades por empresa. Analiza los resultados y proporciona observaciones relevantes.
        ${historialTexto}`;

    const body: ConsultaAsistenteDto = {
      exitoso: true,
      errorMensaje: '',
      idBot: 6,
      pregunta: `${pregunta}`,
      fechaPregunta: new Date(),
      respuesta: '',
      fechaRespuesta: new Date(),
      tokensEntrada: 0,
      tokensSalida: 0,
      idUsuario: this.loginService.obtenerIdUsuario(),
      idTipoUsuario: 0,
      idEmpresa: this.loginService.obtenerIdEmpresa(),
      esPreguntaFrecuente: false,
    };

    this.visibleRespuesta = true;
    this.respuestaAsistente = '';
    this.loadingAsistente = true;

    this.openIaService.AsistenteHistorico(body).subscribe({
      next: res => {
        this.visibleRespuesta = true;
        this.respuestaAsistente = this.limpiarRespuesta(res.respuesta || 'No se recibió respuesta.');
        this.loadingAsistente = false;
      },
      error: err => {
        this.respuestaAsistente = 'Error al consultar al asistente: ' + err.message;
      }
    });
  }

  copiarTexto(): void {
    if (!this.respuestaAsistente) return;

    const tempElement = document.createElement('div');
    tempElement.innerHTML = this.respuestaAsistente;

    function getPlainText(element: HTMLElement): string {
      let text = '';

      element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Texto normal
          text += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tag = el.tagName.toLowerCase();

          if (tag === 'p' || tag === 'div' || tag === 'br') {
            text += getPlainText(el) + '\n';
          } else if (tag === 'li') {
            text += '- ' + getPlainText(el) + '\n';
          } else if (tag === 'ul' || tag === 'ol') {
            text += getPlainText(el) + '\n';
          } else {
            text += getPlainText(el);
          }
        }
      });

      return text;
    }

    const textoPlano = getPlainText(tempElement).trim();

    navigator.clipboard.writeText(textoPlano).then(() => {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2000);
    });
  }

  limpiarRespuesta(respuesta: string): string {
    return respuesta
      .replace(/```(?:\w+)?\s*([^]*?)```/g, (_, contenido) => contenido.trim())
      .replace(/^```(?:\w+)?\s*/, '')
      .replace(/```$/, '')
      .trim();
  }
  
  leerRespuesta(): void {
    if (this.leyendo) {
      window.speechSynthesis.cancel();
      this.leyendo = false;
    } else {
      if (!this.respuestaAsistente) return;

      const tempElement = document.createElement('div');
      tempElement.innerHTML = this.respuestaAsistente;

      function getPlainText(element: HTMLElement): string {
        let text = '';
        element.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const tag = el.tagName.toLowerCase();

            if (tag === 'p' || tag === 'div' || tag === 'br') {
              text += getPlainText(el) + '\n';
            } else if (tag === 'li') {
              text += '- ' + getPlainText(el) + '\n';
            } else {
              text += getPlainText(el);
            }
          }
        });
        return text;
      }

      const textoPlano = getPlainText(tempElement).trim();

      const utterance = new SpeechSynthesisUtterance(textoPlano);
      utterance.lang = 'es-MX';
      utterance.rate = 1.1;
      utterance.pitch = 1.2;
      utterance.volume = 1;


      if (this.vozSeleccionada) {
        utterance.voice = this.vozSeleccionada;
      }

      this.leyendo = true;

      utterance.onend = () => {
        this.leyendo = false;
      };

      utterance.onerror = () => {
        this.leyendo = false;
      };

      window.speechSynthesis.cancel(); 
      window.speechSynthesis.speak(utterance);
    }
  }
  alCerrarDialogo(): void {
    this.maximizedRespuesta = false;

    if (this.leyendo) {
      window.speechSynthesis.cancel();
      this.leyendo = false;
    }
  }
  cargarVozPreferida(): void {
    const cargarVoces = () => {
      this.vocesDisponibles = window.speechSynthesis.getVoices();

      if (this.vocesDisponibles.length === 0) {
        setTimeout(cargarVoces, 100);
        return;
      }

      const nombreGuardado = localStorage.getItem('vozPreferida');
      this.vozSeleccionada = this.vocesDisponibles.find(v =>
        v.name === (nombreGuardado || "Microsoft Dalia Online (Natural) - Spanish (Mexico)")
      ) || null;

      if (!nombreGuardado && this.vozSeleccionada) {
        localStorage.setItem('vozPreferida', this.vozSeleccionada.name);
      }
    };
    window.speechSynthesis.onvoiceschanged = cargarVoces;

    cargarVoces();
  }

    
}