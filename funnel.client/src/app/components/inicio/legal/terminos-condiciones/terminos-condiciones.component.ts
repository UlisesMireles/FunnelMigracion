import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-terminos-condiciones',
  standalone: false,
  templateUrl: './terminos-condiciones.component.html',
  styleUrl: './terminos-condiciones.component.css'
})
export class TerminosCondicionesComponent {
  baseUrl: string = environment.baseURLAssets;

}
