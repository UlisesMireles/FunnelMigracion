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
import { OortunidadesMesAcordeonComponent } from './components/en-proceso/acordion-horizontal/app-oportunidadesMes-acordeon.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { OportunidadesGanadasComponent } from './components/terminadas/oportunidades-ganadas/oportunidades-ganadas.component';
import { OportunidadesEliminadasComponent } from './components/terminadas/oportunidades-eliminadas/oportunidades-eliminadas.component';
import { OportunidadesCanceladasComponent } from './components/terminadas/oportunidades-canceladas/oportunidades-canceladas.component';
import { OportunidadesPerdidasComponent } from './components/terminadas/oportunidades-perdidas/oportunidades-perdidas.component';
import { ModalOportunidadesCanceladasComponent } from './components/terminadas/oportunidades-canceladas/modal-oportunidades-canceladas/modal-oportunidades-canceladas.component';
import { ModalOportunidadesPerdidasComponent } from './components/terminadas/oportunidades-perdidas/modal-oportunidades-perdidas/modal-oportunidades-perdidas.component';
import { ModalDetallesIndicadoresEtapaComponent } from './components/dashboard/oportunidades-general/modal-detalles-indicadores-etapa/modal-detalles-indicadores-etapa.component';
import { ModalOportunidadesPorSectorComponent } from './components/dashboard/oportunidades-general/modal-oportunidades-por-sector/modal-oportunidades-por-sector.component';
import { ModalDetallesOportunidadesPorSectorComponent } from './components/dashboard/oportunidades-general/modal-detalles-oportunidades-por-sector/modal-detalles-oportunidades-por-sector.component';
import { ModalDetallesOportunidadesPorTipoComponent } from './components/dashboard/oportunidades-general/modal-detalles-oportunidades-por-tipo/modal-detalles-oportunidades-por-tipo.component';
import { ModalOportunidadesPorTipoComponent } from './components/dashboard/oportunidades-general/modal-oportunidades-por-tipo/modal-oportunidades-por-tipo.component';
import { ModalOportunidadesPorAgenteClientesComponent } from './components/dashboard/oportunidades-por-agente/modal-oportunidades-por-agente-clientes/modal-oportunidades-por-agente-clientes.component';
import { ModalOportunidadesPorAgenteTipoComponent } from './components/dashboard/oportunidades-por-agente/modal-oportunidades-por-agente-tipo/modal-oportunidades-por-agente-tipo.component';
import { ModalOportunidadesPorAgenteDetalleTipoComponent } from './components/dashboard/oportunidades-por-agente/modal-oportunidades-por-agente-detalle-tipo/modal-oportunidades-por-agente-detalle-tipo.component';
import { ModalOportunidadesPorAgenteSectorComponent } from './components/dashboard/oportunidades-por-agente/modal-oportunidades-por-agente-sector/modal-oportunidades-por-agente-sector.component';
import { ModalOportunidadesPorAgenteDetalleSectorComponent } from './components/dashboard/oportunidades-por-agente/modal-oportunidades-por-agente-detalle-sector/modal-oportunidades-por-agente-detalle-sector.component';

import { PermisosComponent } from './components/catalogos/permisos/permisos.component';
import { AdministracionHerramientasComponent } from './components/herramientas/administracion-herramientas/administracion-herramientas.component';
import { ModalTiposEntregaComponent } from './components/catalogos/tipos-entrega/modal-tipos-entrega/modal-tipos-entrega.component';
import { TiposEntregaComponent } from './components/catalogos/tipos-entrega/tipos-entrega.component';
import { UsuarioPerfilComponent } from './components/usuario-perfil/usuario-perfil.component';

import { AcordeonProspectosContactosComponent } from './components/administracion/acordeon-prospectos-contactos/acordeon-prospectos-contactos.component';
import { ServiciosEntregasComponent } from './components/catalogos/servicios-entregas/servicios-entregas.component';
import { UsuariosPermisosComponent } from './components/catalogos/usuarios-permisos/usuarios-permisos.component';
import { PanelesTerminadasComponent } from './components/terminadas/paneles-terminadas/paneles-terminadas.component';
import { EtapasComponent } from './components/catalogos/etapas/etapas.component';
import { ModalCamposNuevosComponent } from './components/administracion/modal-campos-nuevos/modal-campos-nuevos.component';
import { ProcesosComponent } from './components/catalogos/procesos/procesos.component';
import { RegistroContactosComponent } from './components/inicio/registro-contactos/registro-contactos.component';
import { ModalEstancamientoComponent } from './components/en-proceso/acordeon-oportunidades-etapa/modal-estancamiento/modal-estancamiento.component';
import { NuevoRegistroComponent } from './components/inicio/nuevo-registro/nuevo-registro.component';
const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {path: 'politica-privacidad', component: PoliticaPrivacidadComponent, title: 'Politica Privacidad' },
  {path: 'terminos-condiciones', component: TerminosCondicionesComponent, title: 'Terminos y Condiciones' },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent, title: 'Cambiar Contraseña', canActivate: [AuthGuard] },
  { path: 'two-factor', component: DobleAutenticacionComponent, title: 'Autenticación' },
  { path: 'recuperar-contrasena', component: OlvidasteContrasenaComponent, title: 'Recuperar contraseña' },
  /*{ path: 'prospectos', component: ProspectosComponent, title: 'Prospectos', canActivate: [AuthGuard] },
  { path: 'contactos', component: ContactosComponent, title: 'Contactos', canActivate: [AuthGuard] },*/
  //{ path: 'tipos-servicios', component: TipoServiciosComponent, title: 'Tipos Servicios ', canActivate: [AuthGuard] },
  {path: 'servicios-entregas', component: ServiciosEntregasComponent, title: 'Servicios-entregas', canActivate: [AuthGuard]},
  { path: 'oportunidades', component: OportunidadesComponent, title: 'Oportunidades', canActivate: [AuthGuard] },
  { path: 'tipos-servicios-modal', component: ModalTipoServiciosComponent, title: 'Tipos Servicios ', canActivate: [AuthGuard] },
  { path: 'modal-prospectos', component: ModalProspectosComponent, title: 'Modal Prospectos', canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, title: 'Usuarios', canActivate: [AuthGuard] },
  //{ path: 'tipos-entrega', component: TiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  {path: 'prospectos-contactos', component: AcordeonProspectosContactosComponent, title: 'Prospectos-Contactos', canActivate: [AuthGuard]},
  { path: 'tipos-servicios', component: TipoServiciosComponent, title: 'Tipos Servicios ', canActivate: [AuthGuard] },
  { path: 'oportunidades', component: OportunidadesComponent, title: 'Oportunidades', canActivate: [AuthGuard] },
  { path: 'tipos-servicios-modal', component: ModalTipoServiciosComponent, title: 'Tipos Servicios ', canActivate: [AuthGuard] },
  { path: 'modal-prospectos', component: ModalProspectosComponent, title: 'Modal Prospectos', canActivate: [AuthGuard] },
  //{ path: 'usuarios', component: UsuariosComponent, title: 'Usuarios', canActivate: [AuthGuard] },
  { path: 'usuarios-permisos', component: UsuariosPermisosComponent, title: 'Usuarios-Permisos', canActivate: [AuthGuard] },
  { path: 'tipos-entrega', component: TiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  { path: 'tipos-entrega-modal', component: ModalTiposEntregaComponent, title: 'Tipos Entrega', canActivate: [AuthGuard] },
  {path: 'oportunidades-terminadas', component:PanelesTerminadasComponent, title: 'Oportunidades Terminadas', canActivate: [AuthGuard] },
  { path: 'oportunidades-ganadas', component: OportunidadesGanadasComponent, title: 'Oportunidades Ganadas', canActivate: [AuthGuard] },
  { path: 'oportunidades-eliminadas', component: OportunidadesEliminadasComponent, title: 'Oportunidades Eliminadas', canActivate: [AuthGuard] },
  { path: 'oportunidades-canceladas', component: OportunidadesCanceladasComponent, title: 'Oportunidades Canceladas', canActivate: [AuthGuard] },
  { path: 'oportunidades-perdidas', component: OportunidadesPerdidasComponent, title: 'Oportunidades Perdidas', canActivate: [AuthGuard] },
  { path: 'oportunidades-canceladas-modal', component: ModalOportunidadesCanceladasComponent, title: 'Oportunidades Canceladas', canActivate: [AuthGuard] },
  { path: 'oportunidades-perdidas-modal', component: ModalOportunidadesPerdidasComponent, title: 'Oportunidades Perdidas', canActivate: [AuthGuard] },
  { path: 'estadisticas-por-etapa', component: EstadisticasPorEtapaComponent, title: 'Estadisticas Por Etapa', canActivate: [AuthGuard] },
  { path: 'modal-detalles-indicadores-etapa', component: ModalDetallesIndicadoresEtapaComponent, title: 'Detalles Indicadores Etapa', canActivate: [AuthGuard] },
  { path: 'modal-oportunidades-por-sector', component: ModalOportunidadesPorSectorComponent, title: 'Oportunidades Por Sector', canActivate: [AuthGuard] },
  { path: 'modal-detalles-oportunidades-por-sector', component: ModalDetallesOportunidadesPorSectorComponent, title: 'Detalles Oportunidades Por Sector', canActivate: [AuthGuard] },
  { path: 'modal-oportunidades-por-tipo', component: ModalOportunidadesPorTipoComponent, title: 'Oportunidades Por Tipo', canActivate: [AuthGuard] },
  { path: 'modal-detalles-oportunidades-por-tipo', component: ModalDetallesOportunidadesPorTipoComponent, title: 'Detalles Oportunidades Por Tipo', canActivate: [AuthGuard] },
  { path: 'modal-oportunidades-por-agente-clientes', component: ModalOportunidadesPorAgenteClientesComponent, title: 'Oportunidades Por Agente Clientes', canActivate: [AuthGuard] }, 
  { path: 'modal-oportunidades-por-agente-tipo', component: ModalOportunidadesPorAgenteTipoComponent, title: 'Oportunidades Por Agente Tipo', canActivate: [AuthGuard] },
  { path: 'modal-oportunidades-por-agente-detalle-tipo', component: ModalOportunidadesPorAgenteDetalleTipoComponent, title: 'Oportunidades Por Agente Detalle Tipo', canActivate: [AuthGuard] },
  { path: 'modal-oportunidades-por-agente-sector', component: ModalOportunidadesPorAgenteSectorComponent, title: 'Oportunidades Por Agente Sector', canActivate: [AuthGuard] },
  { path: 'modal-oportunidades-por-agente-detalle-sector', component: ModalOportunidadesPorAgenteDetalleSectorComponent, title: 'Oportunidades Por Agente Detalle Sector', canActivate: [AuthGuard] },
  //{ path: 'permisos', component: PermisosComponent, title: 'Permisos', canActivate: [AuthGuard] },
  //{ path: 'top-veinte', component: AdminDashboardComponent, title: 'Top Veinte', canActivate: [AuthGuard] },
  { path: 'perfil', component: UsuarioPerfilComponent, title: 'Perfil', canActivate: [AuthGuard] },
  { path: 'app-oportunidadesMes-acordeon', component: OortunidadesMesAcordeonComponent, title: 'Oportunidades Mes', canActivate: [AuthGuard] },
  { path: 'herramientas', component: AdministracionHerramientasComponent, title: 'Herramientas', canActivate: [AuthGuard] },
 // { path: 'dashboard-general', component: AdminDashboardComponent, title: 'Dashboard General', canActivate: [AuthGuard]},
  { path: 'dashboard', component: AdminDashboardComponent, title: 'Dashboard General', canActivate: [AuthGuard]},
  { path: 'configuracion-etapas', component: EtapasComponent, title: 'Configuración de Etapas' },
  { path: 'modal-campos-adicionales', component: ModalCamposNuevosComponent, title: 'ModalCamposAdicionales', canActivate: [AuthGuard]},
  { path: 'procesos', component: ProcesosComponent, title: 'Catálogo de Procesos', canActivate: [AuthGuard] },
  { path: 'modal-estancamiento', component: ModalEstancamientoComponent, title: 'Modal Estancamiento', canActivate: [AuthGuard]},
  { path: 'registro-contactos', component: RegistroContactosComponent, title: 'Registro Contactos' },
  {path:'nuevo-registro', component:NuevoRegistroComponent, title: 'Nuevo Registro'}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
