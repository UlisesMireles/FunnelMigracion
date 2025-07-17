import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ConsultaAsistenteDto } from './../../../../interfaces/asistentes/consultaAsistente';
import { ChatHistorial } from './../../../../interfaces/asistentes/chatHistorial';
import { OpenIaService } from '../../../../services/asistentes/openIA.service';
import { AsistenteService } from '../../../../services/asistentes/asistente.service';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../../../services/login.service';
import { TopVeinteDataService } from '../../../../services/top-veinte-data.service';
import { ClientesTopVeinte } from '../../../../interfaces/prospecto';
@Component({
  selector: 'app-chaBotProspeccion',
  standalone: false,
  templateUrl: './chatBotProspeccion.component.html',
  styleUrl: './chatBotProspeccion.component.css'
})
export class ChatBotProspeccionComponent implements OnInit {
  baseUrlAssets = environment.baseUrlAssetsChatbot;
  @ViewChild('scrollMe') scrollMe!: ElementRef;
  pregunta = "";
  isConsultandoOpenIa: boolean = false;

  consultaAsistente: ConsultaAsistenteDto = {
    exitoso: false,
    errorMensaje: "",
    idBot: 7,
    pregunta: '',
    respuesta: '',
    idUsuario: 0,
    tokensEntrada: 0,
    tokensSalida: 0,
    idTipoUsuario: 0,
    idEmpresa: 0,
    fechaPregunta: new Date(),
    fechaRespuesta: new Date(),
    esPreguntaFrecuente: false,
  };

  chatHistorial: ChatHistorial[] = [
    {
      rol: "asistente",
      mensaje: "¡Hola!✨ Bienvenido(a) al asistente virtual GluAll del sistema de ventas Funnel. Estoy aquí para ayudarte a descubrir cómo este sistema puede significar mayores resultados económicos mediante la búsqueda de nuevos prospectos."
    }
  ];
  chatHistorialResp!: string;
  mostrarBotonDataset: boolean = false;
  topVeinteOriginal: ClientesTopVeinte[] = [];
  mensajeCopiadoTexto: string = '';
  mostrarMensajeCopiado: boolean = false;
  asistenteSeleccionado = { idBot: 7, documento: false };
  constructor(
    private OpenIaService: OpenIaService,
    private aService: AsistenteService,
    private cdRef: ChangeDetectorRef, 
    private loginService: LoginService,
    private topVeinteDataService: TopVeinteDataService,
  ) { }

   ngOnInit() { 
    this.chatHistorialResp = JSON.stringify(this.chatHistorial);
    const savedState = sessionStorage.getItem('chatBotProspeccionState');
      if (savedState) {
        this.restoreState(JSON.parse(savedState));
      } 
    this.topVeinteDataService.currentTop20Data.subscribe(data => {
      this.topVeinteOriginal = data;
    });
   }
   private restoreState(state: any) {
    this.chatHistorial = state.historial || [
      {
        rol: "asistente",
        mensaje: "¡Hola!✨ Bienvenido(a) al asistente virtual GluAll del sistema de ventas Funnel. Estoy aquí para ayudarte a descubrir cómo este sistema puede significar mayores resultados económicos mediante la búsqueda de nuevos prospectos."
      }
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
  consultaMensajeOpenIa(event?: any) {
    if (!this.isConsultandoOpenIa && this.pregunta.trim() !== "") {
      this.consultaAsistente.pregunta = this.pregunta;
      this.chatHistorial.push({ rol: "usuario", mensaje: this.pregunta });
      this.pregunta = "";
      this.chatHistorial.push({ rol: "cargando", mensaje: "..." });
      this.scrollToBottom();
      this.saveState();
      this.obtenRespuestaAsistentePorInput();
    }
  }
 obtenRespuestaAsistentePorInput() {
  this.isConsultandoOpenIa = true;
  this.OpenIaService.asistenteProspeccion(this.consultaAsistente).subscribe({
    next: (data: ConsultaAsistenteDto) => {
      this.chatHistorial.pop();
      const respuesta = data.respuesta.toLowerCase();
      const mostrarBoton = respuesta.includes('dataset') || 
                          respuesta.includes('conjunto de datos') || 
                          respuesta.includes('proporciona datos') || 
                          respuesta.includes('envía datos');
      
      this.chatHistorial.push({ 
        rol: "asistente", 
        mensaje: data.respuesta,
        mostrarBotonDataset: mostrarBoton 
      });
      
      this.cdRef.detectChanges();
      this.scrollToBottom();
      this.saveState();
      this.isConsultandoOpenIa = false;
    },
    error: (err: HttpErrorResponse) => {
      this.chatHistorial.pop();
      this.chatHistorial.push({ 
        rol: "asistente", 
        mensaje: "Lo siento, ocurrió un error al procesar tu pregunta.",
        mostrarBotonDataset: false 
      });
      this.cdRef.detectChanges();
      this.saveState();
      console.error(err);
      this.isConsultandoOpenIa = false;
    }
  });
}
enviarDataset() {
  if (!this.topVeinteOriginal.length) {
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
        mostrarBotonDataset: false 
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
        mostrarBotonDataset: false 
      });
      this.saveState();
      this.cdRef.detectChanges();
      console.error(err);
    }
  });
}

  resetConversation() {
    this.chatHistorial = [
       {
      rol: "asistente",
      mensaje: "¡Hola!✨ Bienvenido(a) al asistente virtual GluAll del sistema de ventas Funnel. Estoy aquí para ayudarte a descubrir cómo este sistema puede significar mayores resultados económicos mediante la búsqueda de nuevos prospectos.",
      mostrarBotonDataset: false
    }
    ];
    sessionStorage.removeItem('chatBotProspeccionState');
    localStorage.removeItem('chatBotProspeccionState');
    this.cdRef.detectChanges();
    this.scrollToBottom();
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
}
