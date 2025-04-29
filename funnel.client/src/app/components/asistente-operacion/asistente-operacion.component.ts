import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SideNavChatFunnelService } from '../../services/asistenteOperacion/sidenavChatFunnel.service';
import { ChatBotAsistenteOperacionComponent } from './chatBot/chatBotAsistenteOperacion.component';
import { environment } from '../../../environments/environment';
import { AsistentesAdministradorService } from '../../services/asistenteOperacion/asistentesAdministrador.service';

@Component({
  standalone: false,
  selector: 'app-asistente-operacion',
  templateUrl: './asistente-operacion.component.html',
  styleUrls: ['./asistente-operacion.component.css']
})
export class AsistenteOperacionComponent implements OnInit{
  @ViewChild(ChatBotAsistenteOperacionComponent) chatBotAsistenteOperacion!: ChatBotAsistenteOperacionComponent;
  baseUrlAssets = environment.baseUrlAssetsChatbot;
  isProd = environment.production;
  asistenteSeleccionado: any = { asistente: '', idBot: 0 };
  version: string = '';


  constructor(public sideNavService: SideNavChatFunnelService, private cdRef: ChangeDetectorRef, private asistentesService: AsistentesAdministradorService) {
  }

  ngOnInit() {
    this.obtenerVersion();
  }
  toggleSideNav(): void {
    this.sideNavService.toggle();
    this.sideNavService.toggleIconState();
  }

  mostrarTemas() {
    this.chatBotAsistenteOperacion.mostrarTemas();
  }

  nombreAsistenteSeleccionado(asistente: any): void {
    this.asistenteSeleccionado = asistente;
    this.cdRef.detectChanges();
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
}
