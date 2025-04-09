import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  baseUrl: string = environment.baseURLAssets;
  isChatOpen = false; // Inicia oculto

  toggleChat() {
    this.isChatOpen = !this.isChatOpen; // Cambia el estado al hacer clic
  }
}
