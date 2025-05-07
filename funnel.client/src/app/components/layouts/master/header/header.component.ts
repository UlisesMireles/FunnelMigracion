import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AsistenteService } from '../../../../services/asistenteOperacion/asistente.service';
import { ModalService } from '../../../../services/modal-perfil.service';
import { Router } from '@angular/router';
import { ModalOportunidadesService } from '../../../../services/modalOportunidades.service';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  baseUrl: string = environment.baseURLAssets;
  enableAsistenteOperacion = false; // Inicia oculto
  ListaMenu: any[] = [];
  modalVisible: boolean = false;
  nombreUsuario: string = '';
  licencia: string = '';
  optionsVisible: boolean = false;

  constructor(private asistenteService: AsistenteService, private modalService: ModalService, private router: Router, private modalOportunidadesService: ModalOportunidadesService) {}

  toggleChat(): void {
    this.enableAsistenteOperacion = !this.enableAsistenteOperacion;
    // Si necesitas notificar al servicio
    this.asistenteService.asistenteSubject.next(this.enableAsistenteOperacion ? 1 : -1);
  }

  toggleOptions() {
    this.optionsVisible = !this.optionsVisible;
  }

  ngOnInit(): void {
    const perfil = {
      nombre: localStorage.getItem('username')!,//'Perfil',
      ruta: '/perfil',
      icono: 'bi bi-person-circle',
      tooltip: 'Perfil',
      subMenu: []
    };

    this.nombreUsuario = localStorage.getItem('username')!;
    this.licencia = localStorage.getItem('licencia')!;
  }

  agregarOportunidad() {
    this.modalOportunidadesService.openModal(true);
  }

  agregarProspecto() {
    
  }

  agregarContacto() {
    
  }

  navigateTo(path: string) {
    if (path === '/perfil') {
      if(this.modalVisible)
        this.modalService.closeModal();
      else
        this.modalService.toggleModal();
        
    //  console.log('this.modalVisible ' + this.modalVisible);
    } else {
      this.modalService.closeModal();
      this.router.navigate([path]);
    }
  }
}
