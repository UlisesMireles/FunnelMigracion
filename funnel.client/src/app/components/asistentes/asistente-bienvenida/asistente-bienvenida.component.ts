import { ChangeDetectorRef, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SideNavChatFunnelService } from '../../../services/asistentes/sidenavChatFunnel.service';
import { environment } from '../../../../environments/environment';
import { ChatBotBienvenidaComponent } from './chatBot/chatBotBienvenida.component';
import { AsistentesAdministradorService } from '../../../services/asistentes/asistentesAdministrador.service';
@Component({
  selector: 'app-asistente-bienvenida',
  standalone: false,
  templateUrl: './asistente-bienvenida.component.html',
  styleUrl: './asistente-bienvenida.component.css'
})
export class AsistenteBienvenidaComponent implements OnInit {
  @ViewChild(ChatBotBienvenidaComponent) chatBotAsistente!: ChatBotBienvenidaComponent;
  isProd = environment.production;
  baseUrlAssets = environment.baseUrlAssetsChatbot;
  @Output() OncerrarChat = new EventEmitter<void>();
  version: string = '';

  constructor(public sideNavService: SideNavChatFunnelService,private cdRef: ChangeDetectorRef, private asistentesService: AsistentesAdministradorService) {
  }

  ngOnInit() {
    this.obtenerVersion();
  }
  toggleSideNav(): void {
    this.sideNavService.toggle();
    this.sideNavService.toggleIconState();
  }

  mostrarTemas(){
    this.chatBotAsistente.mostrarTemas();
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
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.classList.add("d-none");
    }
  }

}
