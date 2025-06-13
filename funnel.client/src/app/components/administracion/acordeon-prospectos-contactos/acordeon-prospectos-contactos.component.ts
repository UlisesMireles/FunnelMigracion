import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';



@Component({
  selector: 'app-acordeon-prospectos-contactos',
  standalone: false,
  templateUrl: './acordeon-prospectos-contactos.component.html',
  styleUrl: './acordeon-prospectos-contactos.component.css'
})
export class AcordeonProspectosContactosComponent {
  prospectosExpandido = true;
  contactosExpandido = true;
  toggleProspectos() {
    this.prospectosExpandido = !this.prospectosExpandido;
  }

  toggleContactos() {
    this.contactosExpandido = !this.contactosExpandido;
  }
}