import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ConsultaAsistenteDto } from './../../../../interfaces/asistentes/consultaAsistente';
import { ChatHistorial } from './../../../../interfaces/asistentes/chatHistorial';
import { OpenIaService } from '../../../../services/asistentes/openIA.service';
import { AsistenteService } from '../../../../services/asistentes/asistente.service';
import { environment } from '../../../../../environments/environment';

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
      mensaje: "¡Hola!✨ Bienvenido al asistente virtual del funnel. Estoy aquí para ayudarte a descubrir cómo este sistema puede significar mayores resultados económicos, simplificando tu proceso de ventas."
    }
  ];
  chatHistorialResp!: string;

  constructor(
    private OpenIaService: OpenIaService,
    private aService: AsistenteService,
    private cdRef: ChangeDetectorRef
  ) { }

   ngOnInit() { 
    console.log("Historial:", this.chatHistorial);

    this.chatHistorialResp = JSON.stringify(this.chatHistorial);
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
        this.chatHistorial.push({ rol: "asistente", mensaje: data.respuesta });
        this.cdRef.detectChanges();
        this.scrollToBottom();
        this.isConsultandoOpenIa = false;
      },
      error: (err: HttpErrorResponse) => {
        this.chatHistorial.pop();
        this.chatHistorial.push({ rol: "asistente", mensaje: "Lo siento, ocurrió un error al procesar tu pregunta." });
        this.cdRef.detectChanges();
        console.error(err);
        this.isConsultandoOpenIa = false;
      }
    });
  }
  resetConversation() {
    this.chatHistorial = [
      {
        rol: "asistente",
        mensaje: "¡Hola!✨ Bienvenido al asistente virtual del funnel. Estoy aquí para ayudarte a descubrir cómo este sistema puede significar mayores resultados económicos, simplificando tu proceso de ventas."
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
