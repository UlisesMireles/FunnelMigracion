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
      mensaje: "¡Hola!✨ Bienvenido. Estoy aquí para ayudarte a descubrir cómo este sistema puede significar mayores resultados económicos mediante la búsqueda de nuevos prospectos."
    }
  ];
  chatHistorialResp!: string;
  mostrarBotonDataset: boolean = false;
  topVeinteOriginal: ClientesTopVeinte[] = [];
  constructor(
    private OpenIaService: OpenIaService,
    private aService: AsistenteService,
    private cdRef: ChangeDetectorRef, 
    private loginService: LoginService,
    private topVeinteDataService: TopVeinteDataService,
  ) { }

   ngOnInit() { 
    console.log("Historial:", this.chatHistorial);

    this.chatHistorialResp = JSON.stringify(this.chatHistorial);
    this.topVeinteDataService.currentTop20Data.subscribe(data => {
      this.topVeinteOriginal = data;
      console.log("Datos recibidos:", data);
    });
   }

  consultaMensajeOpenIa(event?: any) {
    if (!this.isConsultandoOpenIa && this.pregunta.trim() !== "") {
      this.consultaAsistente.pregunta = this.pregunta;
      this.chatHistorial.push({ rol: "usuario", mensaje: this.pregunta });
      this.pregunta = "";
      this.chatHistorial.push({ rol: "cargando", mensaje: "..." });
      this.scrollToBottom();
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
      console.error(err);
      this.isConsultandoOpenIa = false;
    }
  });
}
  enviarDataset() {
  if (!this.topVeinteOriginal.length) {
      console.error("No hay datos disponibles");
      return;
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
        `;
    }).join('\n');

    const pregunta = `Este es el conjunto de datos que puedo proporcionar.
        ${historialTexto}`;

    const body: ConsultaAsistenteDto = {
      exitoso: true,
      errorMensaje: '',
      idBot: 7,
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
    console.log("Cuerpo del mensaje:", body);
    /*this.visibleRespuesta = true;
    this.respuestaAsistente = '';
    this.loadingAsistente = true;*/

    this.OpenIaService.asistenteProspeccion(body).subscribe({
      next: res => {
        /*this.visibleRespuesta = true;
        this.respuestaAsistente = this.limpiarRespuesta(res.respuesta || 'No se recibió respuesta.');
        this.loadingAsistente = false;*/
      },
      error: err => {
        //this.respuestaAsistente = 'Error al consultar al asistente: ' + err.message;
      }
    });
  }
  

  resetConversation() {
    this.chatHistorial = [
      {
        rol: "asistente",
        mensaje: "¡Hola!✨ Bienvenido. Estoy aquí para ayudarte a descubrir cómo este sistema puede significar mayores resultados económicos mediante la búsqueda de nuevos prospectos.",
        mostrarBotonDataset: false
      }
    ];
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
}
