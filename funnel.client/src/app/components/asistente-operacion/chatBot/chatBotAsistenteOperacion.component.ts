import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { AsitenteCategoriasDto } from '../../../interfaces/asistenteOperacion/asistente';
import { CategoriaPreguntasDto } from '../../../interfaces/asistenteOperacion/categoriaPreguntas';
import { ChatHistorial } from '../../../interfaces/asistenteOperacion/chatHistorial';
import { ConsultaAsistenteDto } from '../../../interfaces/asistenteOperacion/consultaAsistente';
import { PreguntasPorCategoriaDto } from '../../../interfaces/asistenteOperacion/preguntasPorCategoria';
import { EmojiPipe } from '../../../pipes/asistenteOperacion/emoji.pipe';
import { AsistenteService } from '../../../services/asistenteOperacion/asistente.service';
import { OpenIaService } from '../../../services/asistenteOperacion/openIA.service';
import { PreguntasFrecuentesService } from '../../../services/asistenteOperacion/preguntasFrecuentes.service';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../../services/login.service';

@Component({
  standalone: false,
  selector: 'app-chatBotAsistenteOperacion',
  templateUrl: './chatBotAsistenteOperacion.component.html',
  styleUrls: ['./chatBotAsistenteOperacion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBotAsistenteOperacionComponent implements OnInit {
  baseUrlAssets = environment.baseUrlAssetsChatbot;
  @ViewChild('scrollMe') scrollMe!: ElementRef;
  consultaAsistente: ConsultaAsistenteDto = {
    exitoso: false,
    errorMensaje: "",
    idBot: 4,
    pregunta: '',
    respuesta: '',
    idUsuario: this.idUsuario(),
    tokensEntrada: 0,
    tokensSalida: 0,
    idTipoUsuario: this.IdTipoUsuario(),
    idEmpresa: this.IdEmpresa(),
    fechaPregunta: new Date(),
    fechaRespuesta: new Date(),
    esPreguntaFrecuente: false
  };

  chatHistorial: ChatHistorial[] = [
    { rol: "asistente", mensaje: "Hola " + this.nombreUsuario() + "! ✨" },
    { rol: "asistente", mensaje: "Bienvenido(a) al asistente virtual del sistema de ventas Funnel. Estoy aquí para ayudarte a optimizar tu proceso de ventas. Por favor, selecciona una de las siguientes opciones para comenzar: ¿En qué puedo asistirte hoy?:" }
  ];

  lsRevisarCategorias: any[] = ['Sí', 'No'];
  chatHistorialResp!: string;
  pregunta = "";
  asistenteSeleccionado = { idBot: 4, documento: false };
  lsAsistentesPorCategoria!: AsitenteCategoriasDto[];
  lsCategoriaPreguntas!: CategoriaPreguntasDto[];
  lsPreguntasPorCategoria!: PreguntasPorCategoriaDto[];
  /** */
  loadOpciones: boolean = false;
  isConsultandoOpenIa: boolean = false;
  @Output() nombreAsistenteSeleccionado = new EventEmitter<any>();

  constructor(
    private oaService: OpenIaService,
    public asistenteService: AsistenteService,
    private cdRef: ChangeDetectorRef,
    private preguntasFAQService: PreguntasFrecuentesService,
    private loginService: LoginService
  ) {
  }

  ngOnInit() {
    this.chatHistorialResp = JSON.stringify(this.chatHistorial);
    this.obtenListaPreguntasFrecuentesCategoriaOperaciones();

  }

  //#region obtencion de datos de session storage
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

  //#region oonsultas
  obtenListaPreguntasFrecuentesCategoriaOperaciones() {
    this.preguntasFAQService.obtenListaPreguntasFrecuentesCategoria().subscribe({
      next: (value) => {
        if (value.result) {
          this.lsAsistentesPorCategoria = value.asistentes;
          const asistenteOperacion = this.lsAsistentesPorCategoria.find(a => a.idBot === 4);  
          if (asistenteOperacion) {
            this.obtenCategoriasPorAsistente(asistenteOperacion);
          }
        } else {
          console.error(value.errorMessage);
        }
        },
      error(err) {
        console.error(err)
      }
      
    });
  }
  /*obtenListaPreguntasFrecuentesCategoria() {
    this.preguntasFAQService.obtenListaPreguntasFrecuentesCategoria().subscribe({
      next: (value) => {
        if (value.result) {
          this.lsAsistentesPorCategoria = value.asistentes.filter(categoria => categoria.idBot === 4);
        } else {
          console.error(value.errorMessage);
        }
      },
      error(err) {
        console.error(err)
      },
      complete: () => {
        this.chatHistorial.push({ rol: "asistentes", mensaje: "" });
        this.scrollToBottom();
        this.cdRef.detectChanges();
      },
    });
  }*/

  obtenCategoriasPorAsistente(asistente: AsitenteCategoriasDto) {
    this.nombreAsistenteSeleccionado.emit({ asistente: asistente.asistente, idBot: asistente.idBot });
    this.asistenteSeleccionado = { idBot: asistente.idBot, documento: asistente.documento };

    const asistenteSeleccionado = this.lsAsistentesPorCategoria.find(f => f.idBot == asistente.idBot);
    if (asistenteSeleccionado)
      this.lsCategoriaPreguntas = asistenteSeleccionado.preguntasPorCategoria;
    this.chatHistorial.push({ rol: "categorias", mensaje: "" })
    this.cdRef.detectChanges();
    this.scrollToBottom();
  }

  //#endregion

  //#region acciones en chat
  seleccionCategoria(categoria: CategoriaPreguntasDto) {
    const categoriaSeleccionada = this.lsCategoriaPreguntas.find(f => f.idCategoria == categoria.idCategoria);
    if (categoriaSeleccionada)
      this.lsPreguntasPorCategoria = categoriaSeleccionada.listaPreguntasPorCategoria;
    this.chatHistorial.pop();
    const filterPipe = new EmojiPipe();
    this.chatHistorial.push({ rol: "usuario", mensaje: categoria.descripcion });
    if (categoria.mensajePrincipal) {
      this.chatHistorial.push({ rol: "asistente", mensaje: filterPipe.transform(categoria.mensajePrincipal) });
    }
    this.chatHistorial.push({ rol: "preguntasPorCat", mensaje: "" });
    this.scrollToBottom();
  }

  seleccionPregunta(preguntaFaq: PreguntasPorCategoriaDto) {
    let findIndexFiltroFaq = this.chatHistorial.findIndex(f => f.rol === 'filtroFaq');
    this.chatHistorial.splice(findIndexFiltroFaq, 1);
    this.chatHistorial.push({ rol: "usuario", mensaje: preguntaFaq.pregunta });
    preguntaFaq.yaSePregunto = true;
    if (this.asistenteSeleccionado.documento) {
      this.chatHistorial.push({ rol: "asistente", mensaje: preguntaFaq.respuesta });
      let findPreguntasUsadas = this.lsPreguntasPorCategoria.filter(f => f.yaSePregunto == false);
      if (findPreguntasUsadas.length == 0) {
        this.chatHistorial.push(
          { rol: "asistente", mensaje: "En cualquier momento puedes hacer una pregunta abierta o ¿quisieras revisar por categoría?😊" },
          { rol: "revisarCategorias", mensaje: "" }
        );
      } else {
        this.chatHistorial.push({ rol: "preguntasPorCat", mensaje: "" });
      }

      this.scrollToBottom();
      this.cdRef.detectChanges();
    } else {
      this.consultaAsistente.idBot = this.asistenteSeleccionado.idBot;
      this.consultaAsistente.pregunta = preguntaFaq.pregunta;
      this.consultaAsistente.esPreguntaFrecuente = true;
      this.consultaAsistente.respuesta = preguntaFaq.respuesta;
      this.isConsultandoOpenIa = true;
      this.chatHistorial.push({ rol: "cargando", mensaje: "..." });
      this.oaService.obtenOpenIaConsultaAsistente(this.consultaAsistente).subscribe({
        next: (data: ConsultaAsistenteDto) => {
          if (data.exitoso) {
            this.chatHistorial.pop();
            this.chatHistorial.push({ rol: "asistente", mensaje: data.respuesta });
            preguntaFaq.yaSePregunto = true;
          }

          this.isConsultandoOpenIa = false;

          let findPreguntasUsadas = this.lsPreguntasPorCategoria.filter(f => f.yaSePregunto == false);

          if (findPreguntasUsadas.length == 0) {
            this.chatHistorial.push(
              { rol: "asistente", mensaje: "En cualquier momento puedes hacer una pregunta abierta o ¿quisieras revisar por categoría?😊" },
              { rol: "revisarCategorias", mensaje: "" }
            );
          } else {
            this.chatHistorial.push({ rol: "preguntasPorCat", mensaje: "" });
          }

          this.scrollToBottom();
          this.cdRef.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.chatHistorial.pop();
          this.cdRef.detectChanges();
          this.isConsultandoOpenIa = false;
          console.error(err);
        }
      });
    }
  }
  //#endregion

  consultaMensajeOpenIa() {
    if (!this.pregunta?.trim()) return;
    if (!this.isConsultandoOpenIa) {
      let findIndexFiltroFaq = this.chatHistorial.findIndex(f => f.rol === 'preguntasPorCat');
      if (findIndexFiltroFaq !== -1) {
        this.chatHistorial.splice(findIndexFiltroFaq, 1);
      }

      const indexRevisarCategorias = this.chatHistorial.findIndex(f => f.rol === 'revisarCategorias');
      if (indexRevisarCategorias != -1) {
        this.chatHistorial.splice(indexRevisarCategorias, 1);
      }

      this.consultaAsistente.idBot = this.asistenteSeleccionado.idBot;
      this.consultaAsistente.pregunta = this.pregunta;
      this.consultaAsistente.respuesta = "";
      this.consultaAsistente.esPreguntaFrecuente = false;
      this.chatHistorial.push({ rol: "usuario", mensaje: this.consultaAsistente.pregunta })
      this.pregunta = "";
      if (this.consultaAsistente.pregunta.length < 5) {
        this.chatHistorial.push({ rol: "asistente", mensaje: "¿Podrías ser más específico en tu pregunta?😊" });
        let findPreguntasUsadas = this.lsPreguntasPorCategoria.filter(f => f.yaSePregunto == false);

        if (findPreguntasUsadas.length !== 0) {
          this.chatHistorial.push({ rol: "preguntasPorCat", mensaje: "" });
        }
      } else {
        const preguntaEncontrada = this.lsPreguntasPorCategoria.find(f => f.pregunta.toLocaleLowerCase().indexOf(this.consultaAsistente.pregunta.toLocaleLowerCase()) !== -1)
        if (preguntaEncontrada) {
          if (this.asistenteSeleccionado.documento) {
            this.chatHistorial.push({ rol: "asistente", mensaje: preguntaEncontrada.respuesta });
            const hayPreguntas = this.lsPreguntasPorCategoria.filter(f => f.yaSePregunto == false);
            if (hayPreguntas.length !== 0) {
              this.chatHistorial.push({ rol: "preguntasPorCat", mensaje: "" });
            }
          } else {
            this.consultaAsistente.esPreguntaFrecuente = true;
            this.consultaAsistente.respuesta = preguntaEncontrada.respuesta;
            this.isConsultandoOpenIa = true;
            this.chatHistorial.push({ rol: "cargando", mensaje: "..." });
            this.oaService.obtenOpenIaConsultaAsistente(this.consultaAsistente).subscribe({
              next: (data: ConsultaAsistenteDto) => {
                if (data.exitoso) {
                  this.chatHistorial.pop();
                  this.chatHistorial.push({ rol: "asistente", mensaje: data.respuesta });
                }

                this.isConsultandoOpenIa = false;

                let findPreguntasUsadas = this.lsPreguntasPorCategoria.filter(f => f.yaSePregunto == false);

                if (findPreguntasUsadas.length == 0) {
                  this.chatHistorial.push(
                    { rol: "asistente", mensaje: "En cualquier momento puedes hacer una pregunta abierta o ¿quisieras revisar por categoría?😊" },
                    { rol: "revisarCategorias", mensaje: "" }
                  );
                } else {
                  this.chatHistorial.push({ rol: "preguntasPorCat", mensaje: "" });
                }

                this.scrollToBottom();
                this.cdRef.detectChanges();
              },
              error: (err: HttpErrorResponse) => {
                this.chatHistorial.pop();
                this.cdRef.detectChanges();
                this.isConsultandoOpenIa = false;
                console.error(err);
              }
            });
          }
        } else {
          this.chatHistorial.push({ rol: "cargando", mensaje: "..." })
          this.obtenRespuestaAsistentePorInput();
        }
      }

    }
    this.scrollToBottom();
  }

  obtenRespuestaAsistentePorInput() {
    this.isConsultandoOpenIa = true;
    this.oaService.obtenOpenIaConsultaAsistente(this.consultaAsistente).subscribe({
      next: (data: ConsultaAsistenteDto) => {
        this.chatHistorial = this.chatHistorial.filter(m => m.rol !== "cargando");
        this.chatHistorial.push({ rol: "asistente", mensaje: data.respuesta });
        this.cdRef.detectChanges();
        this.scrollToBottom();
        this.isConsultandoOpenIa = false;
      },
      error: (err: HttpErrorResponse) => {
        this.chatHistorial = this.chatHistorial.filter(m => m.rol !== "cargando");
        this.scrollToBottom();
        this.cdRef.detectChanges();
        this.isConsultandoOpenIa = false;
        console.error(err);
      }
    });
  }

  //#region metodos de acciones de componente
  resetConversation() {
    this.loadOpciones = false;
    this.nombreAsistenteSeleccionado.emit({ asistente: '', idBot: 0 });
    this.asistenteSeleccionado = { idBot: 0, documento: false };
    this.chatHistorial = JSON.parse(this.chatHistorialResp);
    this.obtenListaPreguntasFrecuentesCategoriaOperaciones();
    this.cdRef.detectChanges();
  }

  mostrarCategorias() {
    this.asistenteSeleccionado = { idBot: 4, documento: false };
    
    const componentes = ['asistentes', 'categorias', 'preguntasPorCat', 'revisarCategoris'];
    componentes.forEach(componente => {
      const index = this.chatHistorial.findIndex(m => m.rol === componente);
      if (index !== -1) this.chatHistorial.splice(index, 1);
    });
  
    // Mostrar categorías directamente
    this.chatHistorial.push(
      { rol: "asistente", mensaje: "Estas son las categorías disponibles:" },
      { rol: "categorias", mensaje: "" }
    );
    
    this.scrollToBottom();
    this.cdRef.detectChanges();
  }

  seleccionRevisarCategorias(respuesta: string) {
    this.chatHistorial.pop(); 
    this.chatHistorial.push({ rol: "usuario", mensaje: respuesta });
    
    if (respuesta === "Sí") {
      this.lsPreguntasPorCategoria?.forEach(pregunta => {
        pregunta.yaSePregunto = false;
      });
  
      this.chatHistorial.push(
        { rol: "asistente", mensaje: "Estas son las categorías disponibles:" },
        { rol: "categorias", mensaje: "" } 
      );
    } else {
      this.chatHistorial.push(
        { rol: "asistente", mensaje: "Perfecto. Si tienes otra duda, estaré aquí para ayudarte. 😊" }
      );
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

  //#endregion

}
