import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { EnumPaginas } from '../../../enums/enumPaginas';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  permisoOportunidadesGeneral: boolean = false;
  permisoOportunidadesPorAgente: boolean = false;
  permisoClientesTop20: boolean = false;
  titulo: string = 'Oportunidades en Proceso';
  EnumPaginas = EnumPaginas;
  activeTab = 0;
  constructor(private readonly loginService:LoginService) { }
  ngOnInit(): void {
    console.log('Admin Dashboard Component Initialized');
    this.consultarPermisosUsuario();
  }
  cambioPestana(index: number) {
    const titulos = [
      'Oportunidades General',
      'Oportunidades Por Agente',
      'Clientes Top 20'
    ];
    this.titulo = titulos[index] || 'Administración General';
    this.activeTab = index;
  }
  consultarPermisosUsuario() {
    const permisos = this.loginService.obtenerPermisosUsuario();
    if (permisos && permisos.length > 0) {
      const permisoDashboard = permisos.find(p => p.nombre === EnumPaginas.DASHBOARD);
      if(permisoDashboard){
        this.permisoOportunidadesGeneral = permisoDashboard.subMenu.some((p:any) => p.pagina === EnumPaginas.OPORTUNIDADES_GENERAL);
        this.permisoOportunidadesPorAgente = permisoDashboard.subMenu.some((p:any) => p.pagina === EnumPaginas.OPORTUNIDADES_POR_AGENTE);
        this.permisoClientesTop20 = permisoDashboard.subMenu.some((p:any) => p.pagina === EnumPaginas.CLIENTES_TOP_20);
      }
    }
  }
}
