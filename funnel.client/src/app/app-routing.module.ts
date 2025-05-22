import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarContrasenaComponent } from './components/inicio/cambiar-contrasena/cambiar-contrasena.component';
import { LoginComponent } from './components/inicio/login/login.component';
import { PoliticaPrivacidadComponent } from './components/inicio/legal/politica-privacidad/politica-privacidad.component';
import { TerminosCondicionesComponent } from './components/inicio/legal/terminos-condiciones/terminos-condiciones.component';
import { DobleAutenticacionComponent } from './components/inicio/doble-autenticacion/doble-autenticacion.component';
import { OlvidasteContrasenaComponent } from './components/inicio/olvidaste-contrasena/olvidaste-contrasena.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProspectosComponent } from './components/administracion/prospectos/prospectos.component';
import { ModalProspectosComponent } from './components/administracion/prospectos/modal-prospectos/modal-prospectos.component';
import { ContactosComponent } from './components/administracion/contactos/contactos.component';
import { TipoServiciosComponent } from './components/catalogos/tipo-servicios/tipo-servicios.component';
import { ModalTipoServiciosComponent } from './components/catalogos/tipo-servicios/modal-tipo-servicios/modal-tipo-servicios.component';
import { UsuariosComponent } from './components/catalogos/usuarios/usuarios.component';
import { OportunidadesComponent } from './components/en-proceso/oportunidades/oportunidades.component';
import { EstadisticasPorEtapaComponent } from './components/en-proceso/estadisticas-por-etapa/estadisticas-por-etapa.component';
import { OortunidadesMesAcordeonComponent } from './components/utils/acordion-horizontal/app-oportunidadesMes-acordeon.component';
import { TopVeinteComponent } from './components/dashboard/top-veinte/top-veinte.component';
import { OportunidadesGanadasComponent } from './components/terminadas/oportunidades-ganadas/oportunidades-ganadas.component';
import { OportunidadesEliminadasComponent } from './components/terminadas/oportunidades-eliminadas/oportunidades-eliminadas.component';
import { OportunidadesCanceladasComponent } from './components/terminadas/oportunidades-canceladas/oportunidades-canceladas.component';
import { OportunidadesPerdidasComponent } from './components/terminadas/oportunidades-perdidas/oportunidades-perdidas.component';
import { ModalOportunidadesCanceladasComponent } from './components/terminadas/oportunidades-canceladas/modal-oportunidades-canceladas/modal-oportunidades-canceladas.component';
import { ModalOportunidadesPerdidasComponent } from './components/terminadas/oportunidades-perdidas/modal-oportunidades-perdidas/modal-oportunidades-perdidas.component';

import { PermisosComponent } from './components/catalogos/permisos/permisos.component';
import { AdministracionHerramientasComponent } from './components/herramientas/administracion-herramientas/administracion-herramientas.component';
import { ModalTiposEntregaComponent } from './components/catalogos/tipos-entrega/modal-tipos-entrega/modal-tipos-entrega.component';
import { TiposEntregaComponent } from './components/catalogos/tipos-entrega/tipos-entrega.component';
import { UsuarioPerfilComponent } from './components/usuario-perfil/usuario-perfil.component';
import { OportunidadesGeneralComponent } from './components/dashboard/oportunidades-general/oportunidades-general.component';

const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {path: 'politica-privacidad', component: PoliticaPrivacidadComponent, title: 'Politica Privacidad' },
  {path: 'terminos-condiciones', component: TerminosCondicionesComponent, title: 'Terminos y Condiciones' },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent, title: 'Cambiar Contraseña', canActivate: [AuthGuard] },
  { path: 'two-factor', component: DobleAutenticacionComponent, title: 'Autenticación' },
  { path: 'recuperar-contrasena', component: OlvidasteContrasenaComponent, title: 'Recuperar contraseña' },
  { path: 'prospectos', component: ProspectosComponent, title: 'Prospectos', canActivate: [AuthGuard] },
  { path: 'contactos', component: ContactosComponent, title: 'Contactos', canActivate: [AuthGuard] },
  { path: 'tipos-servicios', component: TipoServiciosComponent, title: 'Tipos Servicios ', canActivate: [AuthGuard] },
  { path: 'oportunidades', component: OportunidadesComponent, title: 'Oportunidades', canActivate: [AuthGuard] },
  { path: 'tipos-servicios-modal', component: ModalTipoServiciosComponent, title: 'Tipos Servicios ', canActivate: [AuthGuard] },
  { path: 'modal-prospectos', component: ModalProspectosComponent, title: 'Modal Prospectos', canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, title: 'Usuarios', canActivate: [AuthGuard] },
  { path: 'tipos-entrega', component: TiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  { path: 'tipos-entrega-modal', component: ModalTiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  { path: 'oportunidades-ganadas', component: OportunidadesGanadasComponent, title: 'Oportunidades Ganadas', canActivate: [AuthGuard] },
  { path: 'oportunidades-eliminadas', component: OportunidadesEliminadasComponent, title: 'Oportunidades Eliminadas', canActivate: [AuthGuard] },
  { path: 'oportunidades-canceladas', component: OportunidadesCanceladasComponent, title: 'Oportunidades Canceladas', canActivate: [AuthGuard] },
  { path: 'oportunidades-perdidas', component: OportunidadesPerdidasComponent, title: 'Oportunidades Perdidas', canActivate: [AuthGuard] },
  { path: 'oportunidades-canceladas-modal', component: ModalOportunidadesCanceladasComponent, title: 'Oportunidades Canceladas', canActivate: [AuthGuard] },
  { path: 'oportunidades-perdidas-modal', component: ModalOportunidadesPerdidasComponent, title: 'Oportunidades Perdidas', canActivate: [AuthGuard] },
  { path: 'estadisticas-por-etapa', component: EstadisticasPorEtapaComponent, title: 'Estadisticas Por Etapa', canActivate: [AuthGuard] },

  { path: 'permisos', component: PermisosComponent, title: 'Permisos', canActivate: [AuthGuard] },
  { path: 'top-veinte', component: TopVeinteComponent, title: 'Top Veinte', canActivate: [AuthGuard] },
  { path: 'perfil', component: UsuarioPerfilComponent, title: 'Perfil', canActivate: [AuthGuard] },
  { path: 'app-oportunidadesMes-acordeon', component: OortunidadesMesAcordeonComponent, title: 'Oportunidades Mes', canActivate: [AuthGuard] },
  { path: 'herramientas', component: AdministracionHerramientasComponent, title: 'Herramientas', canActivate: [AuthGuard] },
  { path: 'dashboard-general', component: OportunidadesGeneralComponent, title: 'Dashboard General', canActivate: [AuthGuard] },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
