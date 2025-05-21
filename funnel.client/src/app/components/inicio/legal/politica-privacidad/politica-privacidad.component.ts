import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-politica-privacidad',
  standalone: false,
  templateUrl: './politica-privacidad.component.html',
  styleUrl: './politica-privacidad.component.css'
})
export class PoliticaPrivacidadComponent {
  baseUrl: string = environment.baseURLAssets;

}
