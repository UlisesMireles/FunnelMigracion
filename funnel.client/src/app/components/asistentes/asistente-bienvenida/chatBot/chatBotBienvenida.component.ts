import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { EnumAsistentes } from './../../../../enums/enumAsistente';
import { AsistentesDto } from './../../../../interfaces/asistentes/asistente';
import { CategoriaPreguntasDto } from './../../../../interfaces/asistentes/categoriaPreguntas';
//import { CategoriasDto } from 'src/app/interfaces/categorias';
import { ChatHistorial } from './../../../../interfaces/asistentes//chatHistorial';
import { ConsultaAsistenteDto } from './../../../../interfaces/asistentes/consultaAsistente';
import { PreguntasPorCategoriaDto } from'./../../../../interfaces/asistentes/preguntasPorCategoria';
import { EmojiPipe } from '../../../../pipes/asistentes/emoji.pipe';
import { AsistenteService } from '../../../../services/asistentes/asistente.service';
import { AsistentesAdministradorService } from '../../../../services/asistentes/asistentesAdministrador.service';
import { CategoriasService } from '../../../../services/asistentes/categorias.service';
import { OpenIaService } from '../../../../services/asistentes/openIA.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-chatBotBienvenida',
  standalone: false,
  templateUrl: './chatBotBienvenida.component.html',
  styleUrls: ['./chatBotBienvenida.component.css']
})
export class ChatBotBienvenidaComponent implements OnInit {
  baseUrlAssets = environment.baseUrlAssetsChatbot;
  @ViewChild('scrollMe') scrollMe!: ElementRef;
  consultaAsistente: ConsultaAsistenteDto = {
    exitoso: false,
    errorMensaje: "",
    idBot: EnumAsistentes.Bienvenida,
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
    { rol: "asistente", mensaje: "¡Hola!✨ Bienvenido al asistente virtual del funnel. Estoy aquí para ayudarte a descubrir cómo este sistema puede significar mayores resultados económicos, simplificando tu proceso de ventas." },
    { rol: "asistente", mensaje: "Elige uno de los siguientes temas que deseas conocer:" }
  ]
  chatHistorialResp!: string;
  pregunta = "";

  asistente!: AsistentesDto;
  asistenteSeleccionado = 1;
  lsCategoriaPreguntas!: CategoriaPreguntasDto[];
  lsCategoriaPreguntasResp!: string;
  lsPreguntasPorCategoria!: PreguntasPorCategoriaDto[];
  loadOpciones: boolean = false;
  isConsultandoOpenIa: boolean = false;
  lsRevisarTemas: any[] = ['Sí', 'No'];
  esperandoRespuestaFaq: boolean = false;


  constructor(
    private oaService: OpenIaService,
    public aService: AsistenteService,
    private cdRef: ChangeDetectorRef,
    private asistenteAdminService: AsistentesAdministradorService,
    private categoriasService: CategoriasService
  ) {
  }

  ngOnInit() {
    this.chatHistorialResp = JSON.stringify(this.chatHistorial);
    this.obtenAsistentes();
    this.obtenPreguntasFrecuentesPorIdCategorias();
  }

  obtenAsistentes() {
    this.asistenteAdminService.obtenerAsistentes().subscribe(
      {
        next: (value) => {
          if (value.result) {
            const index = value.asistentes.findIndex(f => f.idBot == EnumAsistentes.Bienvenida);
            if (index !== -1) {
              this.asistente = value.asistentes[index];
            }
          } else {
            console.error(value.errorMessage);
          }
        },
        error(err) {
          console.error(err)
        },
        complete: () => {
          this.obtenAsistenteSeleccionado();
        },
      }
    );
  }

  obtenPreguntasFrecuentesPorIdCategorias() {
    this.categoriasService.obtenPreguntasFrecuentesPorIdCategoriaAsistenteBienvenida().subscribe({
      next: (value) => {
        if (value.result) {
          value.preguntasPorCategoria.forEach(categoria => {
            categoria.listaPreguntasPorCategoria.forEach(preguntasPorCategoria => {
              preguntasPorCategoria.yaSePregunto = false
            });
          });
          this.lsCategoriaPreguntas = value.preguntasPorCategoria;
          this.lsCategoriaPreguntasResp = JSON.stringify(value.preguntasPorCategoria);
          this.chatHistorial.push({ rol: "categorias", mensaje: "" })
          this.cdRef.detectChanges();
        } else {
          console.error(value.errorMessage);
        }
      },
      error(err) {
        console.error(err)
      }
    });
    
  }


  consultaMensajeOpenIa(event?: any) {
    if (!this.isConsultandoOpenIa) {
      let indexCategorias = this.chatHistorial.findIndex(f => f.rol === 'categorias');
      if (indexCategorias !== -1) {
        this.chatHistorial.splice(indexCategorias, 1);
      }

      let indexPreguntasPorCat = this.chatHistorial.findIndex(f => f.rol === 'preguntasPorCat');
      if (indexPreguntasPorCat !== -1) {
        this.chatHistorial.splice(indexPreguntasPorCat, 1);
      }

      let indexRevisarTemas = this.chatHistorial.findIndex(f => f.rol === 'revisarTemas');
      if (indexRevisarTemas !== -1) {
        this.chatHistorial.splice(indexRevisarTemas, 1);
      }

      this.consultaAsistente.pregunta = this.pregunta;
      this.chatHistorial.push({ rol: "usuario", mensaje: this.consultaAsistente.pregunta })
      this.pregunta = "";

      if (this.esperandoRespuestaFaq && this.consultaAsistente.pregunta.toLowerCase().includes("si")) {
        this.esperandoRespuestaFaq = false;
        this.chatHistorial.push({ rol: "usuario", mensaje: this.consultaAsistente.pregunta })
        this.seleccionRevisarTemas("Sí");
        return;
      }
      if (this.esperandoRespuestaFaq && this.consultaAsistente.pregunta.toLowerCase().includes("no")) {
        this.esperandoRespuestaFaq = false;
        this.chatHistorial.push({ rol: "usuario", mensaje: this.consultaAsistente.pregunta })
        this.seleccionRevisarTemas("No");
        return;
      }
  
      let lsAllPreguntasPorCategoria: any[] = [];
      this.lsCategoriaPreguntas.forEach(element => {
        element.listaPreguntasPorCategoria.forEach(e => {
          lsAllPreguntasPorCategoria.push(e)
        });
      });
      let index = lsAllPreguntasPorCategoria.findIndex(f => f.pregunta.toLocaleLowerCase().indexOf(this.consultaAsistente.pregunta.toLocaleLowerCase()) !== -1)
      if (index !== -1) {
        this.chatHistorial.push({ rol: "asistente", mensaje: lsAllPreguntasPorCategoria[index].respuesta });
        this.chatHistorial.push({ rol: "preguntasPorCat", mensaje: "" });
      } else {
        this.chatHistorial.push({ rol: "cargando", mensaje: "..." })
        this.obtenRespuestaAsistentePorInput();
      }
    }
    this.scrollToBottom();
  }

  obtenAsistenteSeleccionado() {
    this.aService.asistenteObservable.subscribe({
      next: (value: number) => {
        this.asistenteSeleccionado = value;
        this.cdRef.detectChanges();
      }
    })
  }

  obtenRespuestaAsistentePorInput() {
    this.isConsultandoOpenIa = true;
    this.oaService.asistenteProspeccion(this.consultaAsistente).subscribe({
      next: (data: ConsultaAsistenteDto) => {
        this.chatHistorial.pop()
        this.chatHistorial.push(
          { rol: "asistente", mensaje: data.respuesta },
          /*{ rol: "asistente", mensaje: "¿Te gustaría acceder a nuestro menú de preguntas frecuentes? 😊" },
          { rol: "revisarTemas", mensaje: "" }*/
        );
        this.esperandoRespuestaFaq = true;
        this.cdRef.detectChanges();
        this.scrollToBottom();
        this.isConsultandoOpenIa = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isConsultandoOpenIa = false;
        console.error(err);
      }
    })
    this.scrollToBottom();
  }

  obtenRespuestaAsistentePorSeleccionPregunta() {
    this.isConsultandoOpenIa = true;
    this.oaService.asistenteProspeccion(this.consultaAsistente).subscribe({
      next: (data: ConsultaAsistenteDto) => {
        this.chatHistorial.pop()
        this.chatHistorial.push({ rol: "asistente", mensaje: data.respuesta }, { rol: "filtroFaq", mensaje: "" });
        this.cdRef.detectChanges();
        this.isConsultandoOpenIa = false;
      },
      error: (err: HttpErrorResponse) => {
        this.chatHistorial.pop();
        this.cdRef.detectChanges();
        this.isConsultandoOpenIa = false;
        console.error(err);
      }
    })
    this.scrollToBottom();
  }

  seleccionCategoria(categoria: CategoriaPreguntasDto) {
    this.chatHistorial.pop();
    let indexCategoria = this.lsCategoriaPreguntas.findIndex(f => f.idCategoria === categoria.idCategoria);
    this.lsPreguntasPorCategoria = this.lsCategoriaPreguntas[indexCategoria].listaPreguntasPorCategoria;
    const filterPipe = new EmojiPipe();
    this.chatHistorial.push({ rol: "usuario", mensaje: categoria.descripcion });
    if (categoria.mensajePrincipal) {
      this.chatHistorial.push({ rol: "asistente", mensaje: filterPipe.transform(categoria.mensajePrincipal) });
    }
    this.chatHistorial.push({ rol: "preguntasPorCat", mensaje: "" });

    this.scrollToBottom();
  }

  seleccionPregunta(preguntaFaq: PreguntasPorCategoriaDto) {
    this.chatHistorial.pop();
    preguntaFaq.yaSePregunto = true;
    this.chatHistorial.push({ rol: "usuario", mensaje: preguntaFaq.pregunta });
    const findPreguntasUsadas = this.lsPreguntasPorCategoria.filter(f => f.yaSePregunto == false);
    if (findPreguntasUsadas.length !== 0) {
      this.chatHistorial.push(
        { rol: "asistente", mensaje: preguntaFaq.respuesta },
        { rol: "preguntasPorCat", mensaje: "" });
    } else {
      this.chatHistorial.push(
        { rol: "asistente", mensaje: preguntaFaq.respuesta },
        { rol: "preguntasPorCat", mensaje: "" });
      this.chatHistorial.push(
        { rol: "asistente", mensaje: "En cualquier momento puedes hacer una pregunta abierta o ¿quisieras revisar por tema?😊" },
        { rol: "revisarTemas", mensaje: "" }
      );
    }
    this.esperandoRespuestaFaq = true;
    this.scrollToBottom();
  }
  

  resetConversation() {
    this.loadOpciones = false;
    this.lsCategoriaPreguntas = JSON.parse(this.lsCategoriaPreguntasResp);
    this.chatHistorial = JSON.parse(this.chatHistorialResp);
    this.chatHistorial.push({ rol: "categorias", mensaje: "" });
    this.cdRef.detectChanges();
    this.limpiarConversacion();
  }
  private limpiarConversacion() {
  this.oaService.limpiarCacheBot(0,1).subscribe({
    next: (response) => {
      console.log('Cache limpiado', response);
    },
    error: (error) => {
      console.error('Error al limpiar cache', error);
    }
  });
}

  mostrarTemas() {
    this.lsCategoriaPreguntas = JSON.parse(this.lsCategoriaPreguntasResp);
    const indexCategoria = this.chatHistorial.findIndex(f => f.rol === 'categorias');
    if (indexCategoria != -1) {
      this.chatHistorial.splice(indexCategoria, 1);
    }

    const indexPreguntasPorCat = this.chatHistorial.findIndex(f => f.rol === 'preguntasPorCat');
    if (indexPreguntasPorCat != -1) {
      this.chatHistorial.splice(indexPreguntasPorCat, 1);
    }

    const indexRevisarTemas = this.chatHistorial.findIndex(f => f.rol === 'revisarTemas');
    if (indexRevisarTemas != -1) {
      this.chatHistorial.splice(indexRevisarTemas, 1);
    }

    this.chatHistorial.push(
      { rol: "asistente", mensaje: "¡Hola! ¿En qué puedo ayudarte hoy?" },
      { rol: "categorias", mensaje: "" });
    this.cdRef.detectChanges();
    this.scrollToBottom();
  }

  seleccionRevisarTemas(rt: string) {
    this.chatHistorial.pop();
    if (rt !== "No") {
      this.lsCategoriaPreguntas = JSON.parse(this.lsCategoriaPreguntasResp);

      this.chatHistorial.push(
        { rol: "asistente", mensaje: "Selecciona el tema de tu interés 😊:" },
        { rol: "categorias", mensaje: "" });
    } else {
      this.chatHistorial.push(
        { rol: "asistente", mensaje: "¡Muy bien! Si tienes alguna pregunta, estaré encantado de ayudarte." });

    }
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
