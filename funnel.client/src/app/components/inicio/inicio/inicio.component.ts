import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio-azul.component.html',
  styleUrl: './inicio-azul.component.css'
})
export class InicioComponent {
  baseUrl: string = environment.baseURLAssets;
  openChatbot() {
    // Lógica para abrir tu chatbot
    console.log('Chatbot abierto');
  }
}
