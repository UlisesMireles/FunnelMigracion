import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registro-contactos',
  standalone: false,
  templateUrl: './registro-contactos.component.html',
  styleUrl: './registro-contactos.component.css'
})
export class RegistroContactosComponent {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        try {
          const decoded = JSON.parse(atob(token));
          const idUsuario = decoded.idUsuario;
          const idEmpresa = decoded.idEmpresa;
          console.log('ID Usuario:', idUsuario);
          console.log('ID Empresa:', idEmpresa);
        } catch (e) {
          console.error('Token inválido');
        }
      } else {
        console.log('Falta token');
      }
    });
  }
}
