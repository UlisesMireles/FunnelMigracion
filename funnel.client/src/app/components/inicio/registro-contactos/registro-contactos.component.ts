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
      const idUsuario = params['idUsuario'];
      const idEmpresa = params['idEmpresa'];
      if (idUsuario && idEmpresa) {
        console.log('ID Usuario:', idUsuario);
        console.log('ID Empresa:', idEmpresa);
      } else {
        console.log('Faltan parámetros');
      }
    });
  }
}
