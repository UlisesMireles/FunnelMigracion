import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { OportunidadesService } from '../../../../services/oportunidades.service';
import { LoginService } from '../../../../services/login.service';
import { Oportunidad, RequestOportunidad } from '../../../../interfaces/oportunidades';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { OpenIaService } from '../../../../services/asistentes/openIA.service';
import { ConsultaAsistenteDto } from '../../../../interfaces/asistentes/consultaAsistente';

@Component({
  selector: 'app-seguimiento-oportunidades',
  standalone: false,
  templateUrl: './seguimiento-oportunidades.component.html',
  styleUrl: './seguimiento-oportunidades.component.css'
})
export class SeguimientoOportunidadesComponent {

  get isTerminado(): boolean {
    return this.oportunidadForm.get('idEstatusOportunidad')?.value !== 1;
  }

  constructor(private oportunidadService: OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private openIaService: OpenIaService) { }
  @Input() oportunidad!: Oportunidad;
  @Input() oportunidades: Oportunidad[] = [];
  @Input() oportunidadesOriginal: Oportunidad[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;

  maximized: boolean = false;
  request!: RequestOportunidad;

  oportunidadForm!: FormGroup;
  loading: boolean = true;

  disableOportunidades = true;
  isDescargando = false;
  anchoTabla = 100;
  validacionActiva = false;
  wordCount: number = 0;
  disabledPdf: boolean = false;

  visibleRespuesta = false;
  respuestaAsistente: string = '';
  maximizedRespuesta: boolean = false;


  copiado: boolean = false;
  leyendo: boolean = false;

  historialOportunidad: Oportunidad[] = [];
  

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  inicializarFormulario() {
    this.oportunidadForm = this.fb.group({
      idOportunidad: [this.oportunidad.idOportunidad],
      nombre: [this.oportunidad.nombre],
      nombreOportunidad: [this.oportunidad.nombreOportunidad],
      descripcion: [this.oportunidad.nombreOportunidad],
      monto: [this.oportunidad.monto],
      idEjecutivo: [this.oportunidad.idEjecutivo],
      comentario: ['', [Validators.required, this.validarComentario]],
      idEmpresa: [this.loginService.obtenerIdEmpresa(), Validators.required],
      //stage: [this.oportunidad.stage],
      //probabilidad: [this.oportunidad.probabilidad],
      idEstatusOportunidad: [this.oportunidad.idEstatusOportunidad],
      tooltipStage: [this.oportunidad.tooltipStage],
      idUsuario: [this.loginService.obtenerIdUsuario()],
      bandera: ['INS-HISTORICO'],
    });
    if (this.oportunidad.idOportunidad) {
      this.getHistorial(this.oportunidad.idOportunidad);
    }
    this.oportunidadForm.get('comentario')?.valueChanges.subscribe(value => {
      this.wordCount = this.contarPalabras(value);
    });
  }

  contarPalabras(texto: string): number {
    if (!texto) return 0;
    return texto.trim().split(/\s+/).filter(p => p.length > 0).length;
  }

  validarComentario(control: AbstractControl) {
    const value = control.value || '';
    const wordCount = value.trim().split(/\s+/).length;
    return wordCount >= 10 ? null : { minWords: true };
  }

  onDialogShow() {
    this.maximized = false;
    this.cdr.detectChanges();
    this.inicializarFormulario();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['oportunidad'] && changes['oportunidad'].currentValue) {
      this.inicializarFormulario();
      this.cdr.detectChanges();
    }
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
    this.wordCount = 0;
  }

  guardarHistorial() {
    this.limpiarDictado();
    this.validacionActiva = true;

    if (this.oportunidadForm.invalid) {
      this.oportunidadForm.markAllAsTouched();
      return;
    }
    this.oportunidadService.postHistorial(this.oportunidadForm.value).subscribe({
      next: (result: baseOut) => {
        this.result.emit(result);
        this.getHistorial(this.oportunidadForm.value.idOportunidad);
        this.close();
      },
      error: (error: baseOut) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });
  }

  getHistorial(idOportunidad: number) {
    this.oportunidadService.getHistorial(idOportunidad, this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: Oportunidad[]) => {
        this.historialOportunidad = [...result];
        this.loading = false;
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

  exportExcel(idOportunidad: number) {
    this.limpiarDictado();
    const dataExport = this.historialOportunidad.map(opportunity => ({
      NombreEjecutivo: opportunity.nombreEjecutivo,
      Fecha: opportunity.fechaRegistro,
      Comentario: opportunity.comentario
    }));

    import('xlsx').then(xlsx => {
      const hojadeCalculo: import('xlsx').WorkSheet = xlsx.utils.json_to_sheet(dataExport);
      const libro: import('xlsx').WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, "Seguimiento Oportunidades");
      xlsx.writeFile(libro, "Seguimiento Oportunidades.xlsx");
    });
  }

  exportPdf(idOportunidad: number) {
    this.limpiarDictado();
    this.disabledPdf = true;
    this.oportunidadService.descargarReporteSeguimientoOportunidades(idOportunidad, this.loginService.obtenerIdEmpresa(), this.loginService.obtenerEmpresa()).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'SeguimientoOportunidades.pdf';
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
        this.loading = false;
        this.disabledPdf = false;
      },
    });

  }

  toggleMaximize() {
    this.maximized = !this.maximized;
    this.cdr.detectChanges();
  }

  onComentarioInput() {
    const comentarioControl = this.oportunidadForm.get('comentario');
    if (comentarioControl?.touched && comentarioControl?.invalid) {
      comentarioControl.markAsUntouched(); // Quita el estado "touched" para ocultar errores
    }
  }

  enviarSeguimiento() {
    this.limpiarDictado();
    const comentarios = this.historialOportunidad.map(item => ({
      usuario: item.iniciales,
      fecha: item.fechaRegistro,
      comentario: item.comentario
    }));

    const historialTexto = comentarios.map(c => {
      const comentario = c.comentario?.trim();
      return comentario
        ? `<li><b>${c.fecha}</b> – ${c.usuario}: ${comentario}</li>`
        : `<li><b>${c.fecha}</b> – ${c.usuario}: (Sin comentario)</li>`;
    }).join('\n');

    const resumenOportunidad = `
      <p><b>Nombre oportunidad:</b> ${this.oportunidad.nombreOportunidad}</p>
      <p><b>Nombre:</b> ${this.oportunidad.nombre}</p>
      <p><b>Monto:</b> $${this.oportunidad.monto}</p>
      <p><b>Probabilidad:</b> ${this.oportunidad.probabilidad}%</p>
      <p><b>Ejecutivo:</b> ${this.oportunidad.nombreEjecutivo}</p>
      <p><b>Días sin actividad:</b> ${this.oportunidad.fechaModificacion}</p>
      <p><b>Etapa original:</b> ${this.oportunidad.tooltipStage}</p>
      <p><b>Dias en Etapa 1 (Calificacion de prospecto):</b> ${this.oportunidad.diasEtapa1}</p>
      <p><b>Días en Etapa 2 (Investigacion de necesidad):</b> ${this.oportunidad.diasEtapa2}</p>
      <p><b>Días en Etapa 3 (Elaboración de propuesta):</b> ${this.oportunidad.diasEtapa3}</p>
      <p><b>Días en Etapa 4 (Presentación de propuesta):</b> ${this.oportunidad.diasEtapa4}</p>
      <p><b>Días en Etapa 5 (Negociación):</b> ${this.oportunidad.diasEtapa5}</p>
     
    `.trim();

    const pregunta = `Información de la oportunidad:\n\n${resumenOportunidad}\n\nHistorial de seguimiento:\n${historialTexto}`;

    const body: ConsultaAsistenteDto = {
      exitoso: true,
      errorMensaje: '',
      idBot: 5,
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
    this.loading = true;

    this.openIaService.AsistenteHistorico(body).subscribe({
      next: res => {
        this.visibleRespuesta = true;
        this.respuestaAsistente = this.limpiarRespuesta(res.respuesta || 'No se recibió respuesta.');
        this.loading = false;
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
  banderaDictado: boolean = false;
  dictando = false;
  recognition: any;
  textoDictado: string = '';
  textoGuardado: string = '';
  @ViewChild('comentarioInput') comentarioInput!: ElementRef<HTMLTextAreaElement>;

  dictarComentario() {
    // Inicializa reconocimiento si no existe
    this.banderaDictado = !this.banderaDictado; 
    if (!this.banderaDictado) {
      this.dictando = false;
      this.recognition.stop();
      return;
    }
    if (!this.recognition) {
      if (this.comentarioInput) {
        this.comentarioInput.nativeElement.focus();
      }
      const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Tu navegador no soporta reconocimiento de voz.');
        return;
      }
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-MX';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.textoGuardado = this.oportunidadForm.get('comentario')?.value ?? '';
      };

      this.recognition.onresult = (event: any) => {
        let textoCompleto = this.textoGuardado ? this.textoGuardado + '. ' : '';
        for (const result of event.results) {
          textoCompleto += result[0].transcript;
        }
        this.textoDictado = textoCompleto;
        this.oportunidadForm.get('comentario')?.setValue(this.textoDictado);
        this.scrollComentarioToEnd();
      };
      this.recognition.onerror = (event: any) => {
        this.dictando = false;
        this.recognition.stop();

      };

      this.recognition.onend = () => {
        this.oportunidadForm.get('comentario')?.setValue(this.textoDictado);
        this.dictando = false;
      };
    }

    if (!this.dictando) {
      this.textoDictado = '';
      this.dictando = true;
      this.recognition.start();
    } else {
      this.recognition.stop();
      this.limpiarDictado();
    }
   

  }
  limpiarDictado() {
    this.textoDictado = '';
    this.textoGuardado = '';
    this.dictando = false;
    if (this.recognition) {
      this.recognition.stop();
    }
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
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

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


  scrollComentarioToEnd() {
    const textarea = this.comentarioInput?.nativeElement;
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }
lonOp(): boolean {
  const nombreOportunidad = this.oportunidadForm.get('nombreOportunidad')?.value;
  return !!nombreOportunidad && nombreOportunidad.length > 120;

}

}