import { ChangeDetectorRef, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SideNavChatFunnelService } from '../../../services/asistentes/sidenavChatFunnel.service';
import { environment } from '../../../../environments/environment';
import { ChatBotBienvenidaComponent } from './chatBot/chatBotBienvenida.component';
import { AsistentesAdministradorService } from '../../../services/asistentes/asistentesAdministrador.service';
import { AsistenteService } from '../../../services/asistentes/asistente.service';
@Component({
  selector: 'app-asistente-bienvenida',
  standalone: false,
  templateUrl: './asistente-bienvenida.component.html',
  styleUrl: './asistente-bienvenida.component.css'
})
export class AsistenteBienvenidaComponent implements OnInit {
  @ViewChild(ChatBotBienvenidaComponent) chatBotAsistente!: ChatBotBienvenidaComponent;
  isProd = environment.production;
  baseUrl: string = environment.baseURLAssets;

  @Output() OncerrarChat = new EventEmitter<void>();
  version: string = '';

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
    this.asistenteSubjectService.asistenteBienvenidaSubject.next(-1);
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.classList.add("d-none");
    }
  }

}
