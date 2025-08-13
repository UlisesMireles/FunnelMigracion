import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ConsultaAsistenteDto } from './../../../../interfaces/asistentes/consultaAsistente';
import { ChatHistorial } from './../../../../interfaces/asistentes/chatHistorial';
import { OpenIaService } from '../../../../services/asistentes/openIA.service';
import { AsistenteService } from '../../../../services/asistentes/asistente.service';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../../../services/login.service';
import { TopVeinteDataService } from '../../../../services/top-veinte-data.service';
import { ClientesTopVeinte } from '../../../../interfaces/prospecto';
import { EncuestaService } from '../../../../services/asistentes/encuesta.service';
import { PreguntaEncuesta, PreguntaProcesada } from '../../../../interfaces/asistentes/encuesta';
import { MatDialog } from '@angular/material/dialog';
import { EliminarConversacionComponent } from '../eliminar-conversacion/eliminar-conversacion.component';
import { EvaluarBotComponent } from '../evaluar-bot/evaluar-bot.component';
import { ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-chaBotProspeccion',
  standalone: false,
  templateUrl: './chatBotProspeccion.component.html',
  styleUrl: './chatBotProspeccion.component.css'
})
export class ChatBotProspeccionComponent implements OnInit, AfterViewInit {
  baseUrlAssets = environment.baseUrlAssetsChatbot;
  @ViewChild('scrollMe') scrollMe!: ElementRef;
  @ViewChild('inputChat') inputChat!: ElementRef;

  pregunta = "";
  isConsultandoOpenIa: boolean = false;

  consultaAsistente: ConsultaAsistenteDto = {
    exitoso: false,
    errorMensaje: "",
    idBot: 7,
    pregunta: '',
    respuesta: '',
    tokensEntrada: 0,
    tokensSalida: 0,
    nombreUsuario: '',
    correo: '',
    puesto: '',
    numeroTelefono : '',
    idUsuario: this.idUsuario(),
    idTipoUsuario: this.IdTipoUsuario(),
    idEmpresa: this.IdEmpresa(),
    fechaPregunta: new Date(),
    fechaRespuesta: new Date(),
    esPreguntaFrecuente: false,
  };

  chatHistorial: ChatHistorial[] = [
     { rol: "asistente", mensaje: "Hola " + this.nombreUsuario() + "! ✨  Soy Bruno, tu asistente comercial para convertir contactos en oportunidades reales.  Estoy aquí para ayudarte a generar correos estratégicos, identificar oportunidades con IA, proponer soluciones por sector y ayudarte en ventas consultivas, todo desde un solo lugar." , mostrarBotonDataset: true, mostrarBotonCopiar: false},
   ];
  chatHistorialResp!: string;
  mostrarBotonDataset: boolean = false;
  topVeinteOriginal: ClientesTopVeinte[] = [];
  mensajeCopiadoTexto: string = '';
  mostrarMensajeCopiado: boolean = false;
  asistenteSeleccionado = { idBot: 7, documento: false };
  preguntaEncuesta: string = '';
  preguntasProcesadas: PreguntaProcesada[] = [];
  tipoEncuesta: string = '';
  respuestaAbierta: string = '';
  respuestaComentarios: string = '';
  constructor(
    private OpenIaService: OpenIaService,
    private aService: AsistenteService,
    private cdRef: ChangeDetectorRef, 
    private loginService: LoginService,
    private topVeinteDataService: TopVeinteDataService,
    private encuestaService: EncuestaService,
    private dialog: MatDialog, private viewContainerRef: ViewContainerRef
    
  ) { }

   ngOnInit() { 
    this.consultaAsistente.nombreUsuario = this.loginService.obtenerDatosUsuarioLogueado().nombreCompleto;
    this.consultaAsistente.correo = this.loginService.obtenerDatosUsuarioLogueado().correo;
    this.consultaAsistente.puesto = this.loginService.obtenerDatosUsuarioLogueado().puesto;
    this.consultaAsistente.empresa = this.loginService.obtenerEmpresa();
    this.consultaAsistente.numeroTelefono = this.loginService.obtenerDatosUsuarioLogueado().numeroTelefono;
    this.chatHistorialResp = JSON.stringify(this.chatHistorial);
    const savedState = sessionStorage.getItem('chatBotProspeccionState');
      if (savedState) {
        this.restoreState(JSON.parse(savedState));
      }
    this.topVeinteDataService.currentTop20Data.subscribe(data => {
      this.topVeinteOriginal = data;
    });
     this.scrollToBottom();
   }
ngAfterViewInit(): void {
  setTimeout(() => {
    this.inputChat?.nativeElement?.focus();
  }, 0);
}

  nombreUsuario(): string {
    let NombreUsuarioString = environment.usuarioData.nombreUsuario;
    const nombreUsuario = sessionStorage.getItem('Usuario');
    if (nombreUsuario) {
      NombreUsuarioString = nombreUsuario;
    }
    return NombreUsuarioString;
  }

  idUsuario(): number {
    let idUsuarioNumber = environment.usuarioData.idUsuario;
    const idUsuario = sessionStorage.getItem('IdUsuario');
    if (idUsuario) {
      idUsuarioNumber = +idUsuario;
    }
    return idUsuarioNumber;
  }

  IdTipoUsuario(): number {
    let IdTipoUsuarioNumber = environment.usuarioData.idTipoUsuario;
    const IdTipoUsuario = sessionStorage.getItem('IdTipoUsuario');
    if (IdTipoUsuario) {
      IdTipoUsuarioNumber = +IdTipoUsuario;
    }
    return IdTipoUsuarioNumber;
  }

  IdEmpresa(): number {
    let IdEmpresaNumber = environment.usuarioData.idEmpresa;
    const IdEmpresa = sessionStorage.getItem('IdEmpresa');
    if (IdEmpresa) {
      IdEmpresaNumber = +IdEmpresa;
    }
    return IdEmpresaNumber;
  }
  //#endregion
  
  private esSaludo(mensaje: string): boolean {
    const saludos = [
      'hola', 'hello', 'hi', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches',
      'buen dia', 'buena tarde', 'buena noche', 'que tal', 'saludos', 'hey'
    ];
    
    const mensajeLimpio = mensaje.toLowerCase().trim().replace(/[¡!¿?.,]/g, '');
    
    const palabras = mensajeLimpio.split(/\s+/);
    if (palabras.length > 4) {
      return false;
    }
    
    return saludos.some(saludo => mensajeLimpio.includes(saludo));
  }
  
  private generarRespuestaSaludo(): string {
    return `¡Hola ${this.nombreUsuario()}! ¿En qué puedo ayudarte hoy?`;
  }

   private restoreState(state: any) {
    this.chatHistorial = state.historial || [
      { rol: "asistente", mensaje: "Hola " + this.nombreUsuario() + "! ✨  Soy Bruno, tu asistente comercial para convertir contactos en oportunidades reales.  Estoy aquí para ayudarte a generar correos estratégicos, identificar oportunidades con IA, proponer soluciones por sector y ayudarte en ventas consultivas, todo desde un solo lugar." , mostrarBotonDataset: true, mostrarBotonCopiar: false }
    ];
    this.chatHistorialResp = JSON.stringify(this.chatHistorial);
    this.cdRef.detectChanges();
  }
  private saveState() {
    const state = {
      historial: this.chatHistorial,
      asistenteSeleccionado: this.asistenteSeleccionado
    };
    sessionStorage.setItem('chatBotProspeccionState', JSON.stringify(state));
  }
  consultaMensajeOpenIa(event?: any, textarea?: HTMLTextAreaElement) {
    console.log('Evento de consulta recibido:', event);
    if (!this.isConsultandoOpenIa && this.pregunta.trim() !== "") {
      const preguntaOriginal = this.pregunta;
      this.consultaAsistente.pregunta = this.pregunta;
      this.chatHistorial.push({ rol: "usuario", mensaje: this.pregunta});

      // Verificar si es un saludo simple
      if (this.esSaludo(preguntaOriginal)) {
        const respuestaSaludo = this.generarRespuestaSaludo();
        this.chatHistorial.push({ 
          rol: "asistente", 
          mensaje: respuestaSaludo,
          mostrarBotonDataset: false,
          mostrarBotonCopiar: false
        });
        
        this.pregunta = "";
        if (textarea) {
          textarea.style.height = 'auto';
        }
        
        this.cdRef.detectChanges();
        this.scrollToBottom();
        this.saveState();
        return;
      }
      
      this.pregunta = "";

      if (textarea) {
        textarea.style.height = 'auto';
      }

      this.chatHistorial.push({ rol: "cargando", mensaje: "..." });
      this.scrollToBottom();
      this.saveState();
      this.obtenRespuestaAsistentePorInput();

    }
    if (event && event.key === 'Enter') {
      event.preventDefault();
    }
  }
 obtenRespuestaAsistentePorInput() {
  this.isConsultandoOpenIa = true;
  this.OpenIaService.asistenteProspeccion(this.consultaAsistente).subscribe({
    next: (data: ConsultaAsistenteDto) => {
      this.chatHistorial.pop();
      if(data.esPreguntaFrecuente) {
        this.mostrarRespuestaFrecuente(data);
      }else{
        this.mostrarRespuestaOpenAI(data);
      }
      this.finalizarConsulta();
    },
    error: (err: HttpErrorResponse) => {
      this.manejarEerrorConsulta(err);
    }
  });
}
private mostrarRespuestaFrecuente(data: ConsultaAsistenteDto) {
    this.chatHistorial.push({ 
      rol: "asistente", 
      mensaje: data.respuesta,
      mostrarBotonDataset: false,
      esPreguntaFrecuente: true,
      mostrarBotonCopiar: true
    });
  }
private mostrarRespuestaOpenAI(data: ConsultaAsistenteDto) {
  this.chatHistorial.push({ 
    rol: "asistente", 
    mensaje: data.respuesta,
    mostrarBotonDataset: false,
    esPreguntaFrecuente: false,
    mostrarBotonCopiar: true
  }); 
}
 private finalizarConsulta() {
    this.cdRef.detectChanges();
    this.scrollToBottom();
    this.saveState();
    this.isConsultandoOpenIa = false;
  }
  private manejarEerrorConsulta(err: HttpErrorResponse) {
    this.chatHistorial.pop();
    this.chatHistorial.push({ 
      rol: "asistente", 
      mensaje: "Lo siento, ocurrió un error al procesar tu pregunta.",
      mostrarBotonDataset: false,
      mostrarBotonCopiar: false
    });
    this.finalizarConsulta();
    console.error(err);
  }
     
enviarDataset() {
  if (!this.topVeinteOriginal.length) {
    for (let i = this.chatHistorial.length - 1; i >= 0; i--) {
      if (this.chatHistorial[i].rol === 'asistente' && this.chatHistorial[i].mostrarBotonDataset) {
        this.chatHistorial[i].mostrarBotonDataset = false;
        break;
      }
    }

    this.chatHistorial.push({ 
      rol: "asistente", 
      mensaje: "Por favor verifica que el filtro que estás aplicando en la tabla tenga registros válidos e intenta de nuevo.",
      mostrarBotonDataset: true,
      mostrarBotonCopiar: false
    });

    this.saveState();
    return;
  }

  
  let lastAssistantMessageIndex = -1;
  for (let i = this.chatHistorial.length - 1; i >= 0; i--) {
    if (this.chatHistorial[i].rol === 'asistente') {
      lastAssistantMessageIndex = i;
      break;
    }
  }
  
  if (lastAssistantMessageIndex !== -1) {
    this.chatHistorial[lastAssistantMessageIndex].mostrarBotonDataset = false;
  }

  const Datos = this.topVeinteOriginal.map(item => ({
    
    nombre: item.nombre,
    sector: item.nombreSector,
    ubicacion: item.ubicacionFisica,
  }));
  const historialTexto = Datos.map(c => {
    return `
      Nombre: ${c.nombre}
      Sector: ${c.sector}
      Ubicación: ${c.ubicacion}
       -----------------------------`;
  }).join('\n');

  const mensajeUsuario = "Se envió la información de clientes top 20 que se encuentran en la tabla.";
  
  const body: ConsultaAsistenteDto = {
    exitoso: true,
    errorMensaje: '',
    idBot: 7,
    pregunta: historialTexto, 
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
  
  this.chatHistorial.push({ rol: "usuario", mensaje: mensajeUsuario });
  this.chatHistorial.push({ rol: "cargando", mensaje: "..." });
  this.scrollToBottom();

  this.OpenIaService.asistenteProspeccion(body).subscribe({
    next: res => {
      this.chatHistorial.pop();
      this.chatHistorial.push({ 
        rol: "asistente", 
        mensaje: res.respuesta,
        mostrarBotonDataset: false,
        mostrarBotonCopiar: true
      });
      this.saveState();
      this.cdRef.detectChanges();
      this.scrollToBottom();
    },
    error: err => {
      this.chatHistorial.pop();
      this.chatHistorial.push({ 
        rol: "asistente", 
        mensaje: "Lo siento, ocurrió un error al procesar el dataset.",
        mostrarBotonDataset: false,
        mostrarBotonCopiar: false
      });
      this.saveState();
      this.cdRef.detectChanges();
      console.error(err);
    }
  });
}

  
resetConversation() {
  const dialogRef = this.dialog.open(EliminarConversacionComponent, {
    width: '350px',
    position: { right: '70px', top: '250px' }, 
    viewContainerRef: this.viewContainerRef
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'evaluar') {
      const evalDialogRef = this.dialog.open(EvaluarBotComponent, {
        width: '350px',
        position: { right: '70px', top: '250px' },
        viewContainerRef: this.viewContainerRef
      });

      evalDialogRef.afterClosed().subscribe(evaluarResult => {
        if (evaluarResult === true) {
          this.mostrarEncuesta();
        }else if (evaluarResult === false) {
          this.limpiarConversacion();
        }
      });
    }
  });
}

  scrollToBottom() {
    setTimeout(() => {
      this.scrollMe.nativeElement.scrollTo({
        top: this.scrollMe.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 0);
  }
  copiarRespuesta(texto: string) {
  const textoLimpio = texto.replace(/<[^>]*>/g, '');

  navigator.clipboard.writeText(textoLimpio).then(() => {
    this.mostrarMensajeCopiado = true;
    this.mensajeCopiadoTexto = '✅ Texto copiado al portapapeles';
    this.cdRef.detectChanges(); 

    setTimeout(() => {
      this.mostrarMensajeCopiado = false;
      this.cdRef.detectChanges(); 
    }, 1000);
  }).catch(err => {
    this.mostrarMensajeCopiado = true;
    this.mensajeCopiadoTexto = '⚠️ Error al copiar el texto';
    this.cdRef.detectChanges(); 

    setTimeout(() => {
      this.mostrarMensajeCopiado = false;
      this.cdRef.detectChanges(); 
    }, 1000);
  });
}
ajustarAlturaTextarea(event: any): void { 
  const textarea = event.target as HTMLTextAreaElement;

  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;

}

recibirPreguntaExterna(pregunta: string) {
  if (!this.isConsultandoOpenIa && pregunta.trim() !== "") {
    const preguntaOriginal = pregunta;
    this.consultaAsistente.pregunta = pregunta;
    this.chatHistorial.push({ rol: "usuario", mensaje: pregunta });

    if (this.esSaludo(preguntaOriginal)) {
      const respuestaSaludo = this.generarRespuestaSaludo();
      this.chatHistorial.push({ 
        rol: "asistente", 
        mensaje: respuestaSaludo,
        mostrarBotonDataset: false,
        mostrarBotonCopiar: false
      });
      
      this.cdRef.detectChanges();
      this.scrollToBottom();
      this.saveState();
      return;
    }

    this.chatHistorial.push({ rol: "cargando", mensaje: "..." });
    this.cdRef.detectChanges();
    this.scrollToBottom();
    this.saveState();

    this.isConsultandoOpenIa = true;
    this.OpenIaService.asistenteProspeccion(this.consultaAsistente).subscribe({
      next: (data: ConsultaAsistenteDto) => {
        this.chatHistorial.pop();
        const respuestaConUsuario = this.reemplazarVariablesEnRespuesta(data.respuesta);
        this.chatHistorial.push({ 
          rol: "asistente", 
          mensaje: respuestaConUsuario,
          mostrarBotonDataset: false,
          mostrarBotonCopiar: true
        });
        this.cdRef.detectChanges();
        this.scrollToBottom();
        this.saveState();
        this.isConsultandoOpenIa = false;
      },
      error: (err: HttpErrorResponse) => {
        this.manejarEerrorConsulta(err);
      }
    });
  }
}

private reemplazarVariablesEnRespuesta(respuesta: string): string {
  const usuario = this.loginService.obtenerDatosUsuarioLogueado();
  const nombreUsuario = usuario?.nombre || 'Usuario';
  const rolUsuario = usuario?.puesto || 'Usuario';
  const correoUsuario = usuario?.correo || 'Usuario';

  return respuesta
    .replace(/\[Tu nombre\]/gi, nombreUsuario)
    .replace(/\[Tu rol\]/gi, correoUsuario)
    .replace(/\[Tu correo electrónico\]/gi, rolUsuario);
}

private mostrarEncuesta() {
  this.chatHistorial.push({
    rol: "asistente",
    mensaje: "Queremos escucharte. Esta encuesta rápida nos ayudará a mejorar la experiencia con Bruno, tu asistente comercial inteligente de LeadEisei AI 1.0. Responder no te tomará más de 2 minutos. ¡Gracias por tu tiempo!",
    mostrarBotonDataset: false,
    mostrarBotonCopiar: false
  });
  this.encuestaService.getPreguntasEncuesta().subscribe({
    next: (data: PreguntaEncuesta[]) => {
      const preguntasMap = new Map<number, PreguntaProcesada>();

      data.forEach((item: PreguntaEncuesta) => {
        const tipoRespuestaLimpio = item.tipoRespuesta.replace(/<[^>]+>/g, '').toLowerCase();

        if (!preguntasMap.has(item.idPregunta)) {
          preguntasMap.set(item.idPregunta, {
            idPregunta: item.idPregunta,
            pregunta: item.pregunta,
            tipoRespuesta: tipoRespuestaLimpio,
            respuestas: []
          });
        }

        // Solo agregar respuesta si existe (para preguntas múltiples)
        if (item.respuesta) {
          preguntasMap.get(item.idPregunta)!.respuestas.push(item.respuesta);
        }
      });

      this.preguntasProcesadas = Array.from(preguntasMap.values());
      console.log('Preguntas procesadas para encuesta:', this.preguntasProcesadas);
      if (this.preguntasProcesadas.length > 0) {
        this.mostrarPreguntaActual(0);
      }
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error al obtener preguntas:', err);
    }
  });
}

private mostrarPreguntaActual(index: number) {
  if (index >= this.preguntasProcesadas.length) {
    this.chatHistorial.push({
      rol: "asistente",
      mensaje: "✅ Gracias por su tiempo. Su participación es muy valiosa para ayudarnos a mejorar nuestros servicios.",
      mostrarBotonDataset: false,
      mostrarBotonCopiar: false
    });
    setTimeout(() => {
      this.limpiarConversacion();
    }, 2000);

    return;
  
  }
  const preguntaActual = this.preguntasProcesadas[index];

  this.chatHistorial.push({
    rol: "asistente",
    mensaje: preguntaActual.pregunta,
    mostrarBotonDataset: false,
    esEncuesta: true,
    preguntaEncuesta: preguntaActual,
    indicePregunta: index,
    tipoEncuesta: preguntaActual.tipoRespuesta
  });

  this.scrollToBottom();
  this.saveState();
}


manejarRespuestaEncuesta(respuesta: string, idPregunta: number) {
  const preguntaActual = this.preguntasProcesadas.find(p => p.idPregunta === idPregunta);
  if (!preguntaActual) {
    console.error("No se encontró la pregunta para idPregunta:", idPregunta);
    return;
  }
  if (!respuesta.trim()) {
    // No enviar respuestas vacías ni espacios
    return;
  }

  this.chatHistorial.push({
    rol: "usuario",
    mensaje: respuesta
  });
  const indexPreguntaEnHistorial = this.chatHistorial.findIndex(
    chat => chat.esEncuesta && chat.preguntaEncuesta?.idPregunta === idPregunta
  );
  if (indexPreguntaEnHistorial !== -1) {
    this.chatHistorial[indexPreguntaEnHistorial].preguntaEncuesta!.respuestas = [];
  }
  const datosEncuesta = {
    idBot: this.asistenteSeleccionado.idBot,
    pregunta: preguntaActual.pregunta,
    fechaPregunta: new Date().toISOString(),
    respuesta: respuesta,
    fechaRespuesta: new Date().toISOString(),
    idUsuario: this.loginService.obtenerIdUsuario()
  };

  this.encuestaService.registrarRespuestaEncuesta(datosEncuesta).subscribe({
    next: () => {
      console.log('Respuesta registrada');
      const siguienteIndex = this.preguntasProcesadas.indexOf(preguntaActual) + 1;
      this.mostrarPreguntaActual(siguienteIndex);
    },
    error: (error) => {
      console.error('Error al registrar respuesta:', error);
      const siguienteIndex = this.preguntasProcesadas.indexOf(preguntaActual) + 1;
      this.mostrarPreguntaActual(siguienteIndex);
    }
  });
  this.respuestaAbierta = '';
  this.respuestaComentarios = '';
  this.scrollToBottom();
  this.saveState();
}


private limpiarConversacion() {
  this.OpenIaService.limpiarCacheBot(this.loginService.obtenerIdUsuario(), 7).subscribe({
    next: (response) => console.log('Cache limpiado', response),
    error: (error) => console.error('Error al limpiar cache', error)
  });

  this.chatHistorial = [
    { rol: "asistente", mensaje: "Hola " + this.nombreUsuario() + "! ✨  Soy Bruno, tu asistente comercial para convertir contactos en oportunidades reales.  Estoy aquí para ayudarte a generar correos estratégicos, identificar oportunidades con IA, proponer soluciones por sector y ayudarte en ventas consultivas, todo desde un solo lugar." , mostrarBotonDataset: true, mostrarBotonCopiar: false }
  ];
  sessionStorage.removeItem('chatBotProspeccionState');
  localStorage.removeItem('chatBotProspeccionState');
  this.cdRef.detectChanges();
  this.scrollToBottom();
}
}