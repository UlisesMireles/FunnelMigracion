import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AsistenteService } from '../../../../services/asistenteOperacion/asistente.service';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  baseUrl: string = environment.baseURLAssets;
  enableAsistenteOperacion = false; // Inicia oculto

  constructor(private asistenteService: AsistenteService) {}

  toggleChat(): void {
    this.enableAsistenteOperacion = !this.enableAsistenteOperacion;
    // Si necesitas notificar al servicio
    this.asistenteService.asistenteSubject.next(this.enableAsistenteOperacion ? 1 : -1);
  }
}
