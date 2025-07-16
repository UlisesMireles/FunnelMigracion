import { ChangeDetectorRef, Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { SideNavChatFunnelService } from '../../../services/asistentes/sidenavChatFunnel.service';
import { environment } from '../../../../environments/environment';
import { AsistentesAdministradorService } from '../../../services/asistentes/asistentesAdministrador.service';
import { AsistenteService } from '../../../services/asistentes/asistente.service';
import { Subscription } from 'rxjs';
import { EstadoChatService } from '../../../services/asistentes/estado-chat.service';
import { ChatBotComponent } from './chat-bot/chat-bot.component';

@Component({
  selector: 'app-asistente-prospeccion',
  standalone: false,
  templateUrl: './asistente-prospeccion.component.html',
  styleUrl: './asistente-prospeccion.component.css'
})
export class AsistenteProspeccionComponent implements OnInit, OnDestroy {
  @ViewChild(ChatBotComponent) chatBotAsistenteProspeccion!: ChatBotComponent;
  @Output() OncerrarChat = new EventEmitter<void>();
  baseUrlAssets = environment.baseUrlAssetsChatbot;
  isProd = environment.production;
  asistenteSeleccionado: any = { asistente: '', idBot: 7 };
  version: string = '';
  private subscriptions = new Subscription();
  constructor(public sideNavService: SideNavChatFunnelService, private cdRef: ChangeDetectorRef, private asistentesAdministracionService: AsistentesAdministradorService,
    private asistenteService: AsistenteService, private  estadoChatService: EstadoChatService) {
  }

  ngOnInit() {
    this.obtenerVersion();
    // Suscribirse a cambios en el estado
    this.subscriptions.add(
      this.estadoChatService.stateChanges().subscribe(state => {
        if (state) {
          this.asistenteSeleccionado = state.asistenteSeleccionado || { idBot: 7, documento: false };
          console.log('Asistente seleccionado:', this.asistenteSeleccionado);
        }
      })
    );

  }
  toggleSideNav(): void {
    this.sideNavService.toggle();
    this.sideNavService.toggleIconState();
  }

  mostrarCategorias() {
    this.chatBotAsistenteProspeccion.mostrarCategorias();
  }

  nombreAsistenteSeleccionado(asistente: any): void {
    this.asistenteSeleccionado = asistente;
    this.cdRef.detectChanges();
  }

  obtenerVersion(): void {
    this.asistentesAdministracionService.obtenerVersionAsistentes().subscribe({
      next: (data) => {
        this.version = data.version;
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Error al obtener la versión:', err)
    });
  }
  onCerrarChat() {
    this.asistenteService.asistenteSubject.next(-1);
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.classList.add("d-none");
    }
    
    // Guardar estado a través del servicio
    if (this.chatBotAsistenteProspeccion) {
      this.estadoChatService.saveState({
        historial: this.chatBotAsistenteProspeccion.chatHistorial,
        asistenteSeleccionado: this.asistenteSeleccionado,
        lsPreguntasPorCategoria: this.chatBotAsistenteProspeccion.lsPreguntasPorCategoria,
        lsCategoriaPreguntas: this.chatBotAsistenteProspeccion.lsCategoriaPreguntas,
        lsAsistentesPorCategoria: this.chatBotAsistenteProspeccion.lsAsistentesPorCategoria
      });
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
