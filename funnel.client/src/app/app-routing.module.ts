import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { LoginComponent } from './components/login/login.component';
import { DobleAutenticacionComponent } from './components/doble-autenticacion/doble-autenticacion.component';
import { OlvidasteContrasenaComponent } from './components/olvidaste-contrasena/olvidaste-contrasena.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProspectosComponent } from './components/catalogos/prospectos/prospectos.component';
import { ModalProspectosComponent } from './components/catalogos/prospectos/modal-prospectos/modal-prospectos.component';
import { ContactosComponent } from './components/catalogos/contactos/contactos.component';
import { TipoServiciosComponent } from './components/catalogos/tipo-servicios/tipo-servicios.component';
import { ModalTipoServiciosComponent } from './components/catalogos/tipo-servicios/modal-tipo-servicios/modal-tipo-servicios.component';
import { UsuariosComponent } from './components/catalogos/usuarios/usuarios.component';
import { OportunidadesComponent } from './components/catalogos/oportunidades/oportunidades.component';
import { EstadisticasPorEtapaComponent } from './components/catalogos/estadisticas-por-etapa/estadisticas-por-etapa.component';
import { OortunidadesMesAcordeonComponent } from './components/acordion-horizontal/app-oportunidadesMes-acordeon.component';
import { TopVeinteComponent } from './components/catalogos/top-veinte/top-veinte.component';
import { OportunidadesGanadasComponent } from './components/catalogos/oportunidades-ganadas/oportunidades-ganadas.component';
import { OportunidadesEliminadasComponent } from './components/catalogos/oportunidades-eliminadas/oportunidades-eliminadas.component';
import { OportunidadesCanceladasComponent } from './components/catalogos/oportunidades-canceladas/oportunidades-canceladas.component';
import { OportunidadesPerdidasComponent } from './components/catalogos/oportunidades-perdidas/oportunidades-perdidas.component';
import { ModalOportunidadesCanceladasComponent } from './components/catalogos/oportunidades-canceladas/modal-oportunidades-canceladas/modal-oportunidades-canceladas.component';
import { ModalOportunidadesPerdidasComponent } from './components/catalogos/oportunidades-perdidas/modal-oportunidades-perdidas/modal-oportunidades-perdidas.component';


import { TiposEntregaComponent } from './components/catalogos/tipos-entrega/tipos-entrega.component';
import { ModalTiposEntregaComponent } from './components/catalogos/tipos-entrega/modal-tipos-entrega/modal-tipos-entrega.component';
import { PermisosComponent } from './components/catalogos/permisos/permisos.component';

const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent, title: 'Cambiar Contraseña', canActivate: [AuthGuard] },
  { path: 'two-factor', component: DobleAutenticacionComponent, title: 'Autenticación', canActivate: [AuthGuard] },
  { path: 'recuperar-contrasena', component: OlvidasteContrasenaComponent, title: 'Recuperar contraseña'},
  { path: 'prospectos', component: ProspectosComponent, title: 'Prospectos', canActivate: [AuthGuard] },
  { path: 'contactos', component: ContactosComponent, title: 'Contactos', canActivate: [AuthGuard] },
  { path: 'tipos-servicios', component: TipoServiciosComponent, title: 'Tipos Servicios ', canActivate: [AuthGuard] },
  { path: 'oportunidades', component: OportunidadesComponent, title: 'Oportunidades', canActivate: [AuthGuard] },
  { path: 'tipos-servicios-modal', component: ModalTipoServiciosComponent, title: 'Tipos Servicios ', canActivate: [AuthGuard] },
  { path: 'modal-prospectos', component: ModalProspectosComponent, title: 'Modal Prospectos', canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, title: 'Usuarios', canActivate: [AuthGuard] },
  { path:'tipos-entrega', component: TiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  { path:'tipos-entrega-modal', component: ModalTiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  { path:'oportunidades-ganadas', component: OportunidadesGanadasComponent, title: 'Oportunidades Ganadas', canActivate: [AuthGuard] },
  { path:'oportunidades-eliminadas', component: OportunidadesEliminadasComponent, title: 'Oportunidades Eliminadas', canActivate: [AuthGuard] },
  { path:'oportunidades-canceladas', component: OportunidadesCanceladasComponent, title: 'Oportunidades Canceladas', canActivate: [AuthGuard] },
  { path:'oportunidades-perdidas', component: OportunidadesPerdidasComponent, title: 'Oportunidades Perdidas', canActivate: [AuthGuard] },
  { path:'oportunidades-canceladas-modal', component: ModalOportunidadesCanceladasComponent, title: 'Oportunidades Canceladas', canActivate: [AuthGuard] },
  { path:'oportunidades-perdidas-modal', component: ModalOportunidadesPerdidasComponent, title: 'Oportunidades Perdidas', canActivate: [AuthGuard] },
  { path:'estadisticas-por-etapa', component: EstadisticasPorEtapaComponent, title: 'Estadisticas Por Etapa', canActivate: [AuthGuard] },

  { path: 'tipos-entrega', component: TiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  { path: 'tipos-entrega-modal', component: ModalTiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  { path: 'oportunidades-ganadas', component: OportunidadesGanadasComponent, title: 'Oportunidades Ganadas', canActivate: [AuthGuard] },
  { path: 'oportunidades-eliminadas', component: OportunidadesEliminadasComponent, title: 'Oportunidades Eliminadas', canActivate: [AuthGuard] },
  { path: 'oportunidades-canceladas', component: OportunidadesCanceladasComponent, title: 'Oportunidades Canceladas', canActivate: [AuthGuard] },
  { path: 'oportunidades-perdidas', component: OportunidadesPerdidasComponent, title: 'Oportunidades Perdidas', canActivate: [AuthGuard] },
  { path: 'oportunidades-canceladas-modal', component: ModalOportunidadesCanceladasComponent, title: 'Oportunidades Canceladas', canActivate: [AuthGuard] },
  { path: 'oportunidades-perdidas-modal', component: ModalOportunidadesPerdidasComponent, title: 'Oportunidades Perdidas', canActivate: [AuthGuard] },
  { path: 'permisos', component: PermisosComponent, title: 'Permisos', canActivate: [AuthGuard] },
  { path: 'top-veinte', component: TopVeinteComponent, title: 'Top Veinte', canActivate: [AuthGuard] },
  { path: 'app-oportunidadesMes-acordeon', component: OortunidadesMesAcordeonComponent, title: 'Oportunidades Mes', canActivate: [AuthGuard] },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
