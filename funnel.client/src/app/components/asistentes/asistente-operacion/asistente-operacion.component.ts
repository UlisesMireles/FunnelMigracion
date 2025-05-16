import { ChangeDetectorRef, Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { SideNavChatFunnelService } from '../../../services/asistentes/sidenavChatFunnel.service';
import { ChatBotAsistenteOperacionComponent } from './chatBot/chatBotAsistenteOperacion.component';
import { environment } from '../../../../environments/environment';
import { AsistentesAdministradorService } from '../../../services/asistentes/asistentesAdministrador.service';
import { AsistenteService } from '../../../services/asistentes/asistente.service';

@Component({
  standalone: false,
  selector: 'app-asistente-operacion',
  templateUrl: './asistente-operacion.component.html',
  styleUrls: ['./asistente-operacion.component.css']
})
export class AsistenteOperacionComponent implements OnInit{
  @ViewChild(ChatBotAsistenteOperacionComponent) chatBotAsistenteOperacion!: ChatBotAsistenteOperacionComponent;
  @Output() OncerrarChat = new EventEmitter<void>();
  baseUrlAssets = environment.baseUrlAssetsChatbot;
  isProd = environment.production;
  asistenteSeleccionado: any = { asistente: '', idBot: 4 };
  version: string = '';


  constructor(public sideNavService: SideNavChatFunnelService, private cdRef: ChangeDetectorRef, private asistentesAdministracionService: AsistentesAdministradorService,
    private asistenteService: AsistenteService) {
  }

  ngOnInit() {
    this.obtenerVersion();
  }
  toggleSideNav(): void {
    this.sideNavService.toggle();
    this.sideNavService.toggleIconState();
  }

  mostrarCategorias() {
    this.chatBotAsistenteOperacion.mostrarCategorias();
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
  }
}
