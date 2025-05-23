import { Component } from '@angular/core';

@Component({
  selector: 'app-administracion-herramientas',
  standalone: false,
  templateUrl: './administracion-herramientas.component.html',
  styleUrl: './administracion-herramientas.component.css'
})
export class AdministracionHerramientasComponent {

  titulo: string = 'Herramientas Administración';

  ngOnInit(): void {
    this.cambioTitulo(1);
    document.documentElement.style.fontSize = 12 + 'px';
  }


  cambioTitulo(index: number) {
    const titulos = [
      'Reporte Ingresos Usuarios',
      'Activar / Desactivar Job de Procesos'
    ];
    this.titulo = titulos[index] || 'Herramientas Administración';
  }

  

}
