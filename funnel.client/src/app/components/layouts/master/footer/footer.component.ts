import { Component } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [LoginService]
})
export class FooterComponent {
  version: string = '';
  constructor(private readonly loginService: LoginService) { 
    this.obtenrVersion();
  }
  obtenrVersion(): void{
    this.loginService.obtenerVersion().subscribe({
      next: (result: baseOut) => {
        this.version = result.errorMessage;
        console.log(result);
      },
      error: (error: any) => {
       console.error('Error al obtener la versión:', error);
      },
    });
  }
}
