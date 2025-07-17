import { ChangeDetectorRef, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SideNavChatFunnelService } from '../../../services/asistentes/sidenavChatFunnel.service';
import { environment } from '../../../../environments/environment';
import { ChatBotProspeccionComponent } from './chatBot/chatBotProspeccion.component';
import { AsistentesAdministradorService } from '../../../services/asistentes/asistentesAdministrador.service';
import { AsistenteService } from '../../../services/asistentes/asistente.service';

@Component({
  selector: 'app-asistente-prospeccion',
  standalone: false,
  templateUrl: './asistente-prospeccion.component.html',
  styleUrl: './asistente-prospeccion.component.css'
})
export class AsistenteProspeccionComponent {
  @ViewChild(ChatBotProspeccionComponent) chatBotAsistente!: ChatBotProspeccionComponent;
  isProd = environment.production;

  @Output() OncerrarChat = new EventEmitter<void>();
  version: string = '';
  asistenteSeleccionado: any = { asistente: '', idBot: 7 };
  baseUrlAssets = environment.baseUrlAssetsChatbot;

  constructor(public sideNavService: SideNavChatFunnelService,private cdRef: ChangeDetectorRef, private asistentesService: AsistentesAdministradorService, 
    private asistenteSubjectService: AsistenteService
  ) {
  }

  ngOnInit() {
    this.obtenerVersion();
  }
  toggleSideNav(): void {
    this.sideNavService.toggle();
    this.sideNavService.toggleIconState();
  }

  reset(){
    this.chatBotAsistente.resetConversation();
  }

  obtenerVersion(): void {
    this.asistentesService.obtenerVersionAsistentes().subscribe({
      next: (data) => {
        this.version = data.version;
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Error al obtener la versión:', err)
    });
  }
  onCerrarChat() {
    this.asistenteSubjectService.asistenteBienvenidaSubject.next(-1);
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.classList.add("d-none");
    }
  }
}
