import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';



@Component({
  selector: 'app-acordeon-prospectos-contactos',
  standalone: false,
  templateUrl: './acordeon-prospectos-contactos.component.html',
  styleUrl: './acordeon-prospectos-contactos.component.css'
})
export class AcordeonProspectosContactosComponent {
  prospectosExpandido = true;
  contactosExpandido = false;
  toggleProspectos() {
    if (this.prospectosExpandido) {
      this.prospectosExpandido = false;
      this.contactosExpandido = true;
    } else {
      this.prospectosExpandido = true;
      this.contactosExpandido = false;
    }
  }
   toggleContactos() {
    if (this.contactosExpandido) {
      this.contactosExpandido = false;
      this.prospectosExpandido = true;
    } else {
      this.contactosExpandido = true;
      this.prospectosExpandido = false;
    }
  }
}