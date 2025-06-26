import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxCaptchaModule } from 'ngx-captcha';
import { providePrimeNG } from 'primeng/config';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatInputModule } from '@angular/material/input';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { Tag, TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import {MatExpansionModule} from '@angular/material/expansion';


//Login

import { DobleAutenticacionComponent } from './components/inicio/doble-autenticacion/doble-autenticacion.component';
import { LoginComponent } from './components/inicio/login/login.component';
import { PoliticaPrivacidadComponent } from './components/inicio/legal/politica-privacidad/politica-privacidad.component';
import { TerminosCondicionesComponent } from './components/inicio/legal/terminos-condiciones/terminos-condiciones.component';
import { OlvidasteContrasenaComponent } from './components/inicio/olvidaste-contrasena/olvidaste-contrasena.component';
import { CambiarContrasenaComponent } from './components/inicio/cambiar-contrasena/cambiar-contrasena.component';

// En Proceso
import { OportunidadesComponent } from './components/en-proceso/oportunidades/oportunidades.component';
import { ModalOportunidadesComponent } from './components/en-proceso/oportunidades/modal-oportunidades/modal-oportunidades.component';
import { EstadisticasPorEtapaComponent } from './components/en-proceso/estadisticas-por-etapa/estadisticas-por-etapa.component';

//Terminadas
import { ModalOportunidadesCanceladasComponent } from './components/terminadas/oportunidades-canceladas/modal-oportunidades-canceladas/modal-oportunidades-canceladas.component';
import { OportunidadesCanceladasComponent } from './components/terminadas/oportunidades-canceladas/oportunidades-canceladas.component';
import { ModalOportunidadesEliminadasComponent } from './components/terminadas/oportunidades-eliminadas/modal-oportunidades-eliminadas/modal-oportunidades-eliminadas.component';
import { OportunidadesEliminadasComponent } from './components/terminadas/oportunidades-eliminadas/oportunidades-eliminadas.component';
import { ModalOportunidadesGanadasComponent } from './components/terminadas/oportunidades-ganadas/modal-oportunidades-ganadas/modal-oportunidades-ganadas.component';
import { OportunidadesGanadasComponent } from './components/terminadas/oportunidades-ganadas/oportunidades-ganadas.component';
import { ModalOportunidadesPerdidasComponent } from './components/terminadas/oportunidades-perdidas/modal-oportunidades-perdidas/modal-oportunidades-perdidas.component';
import { OportunidadesPerdidasComponent } from './components/terminadas/oportunidades-perdidas/oportunidades-perdidas.component';

//Herramientas
import { AdministracionHerramientasComponent } from './components/herramientas/administracion-herramientas/administracion-herramientas.component';
import { ReporteIngresosUsuariosComponent } from './components/herramientas/reporte-ingresos-usuarios/reporte-ingresos-usuarios.component';
import { EjecucionProcesosComponent } from './components/herramientas/ejecucion-procesos/ejecucion-procesos.component';


// Adminsitracion
import { ModalProspectosComponent } from './components/administracion/prospectos/modal-prospectos/modal-prospectos.component';
import { ProspectosComponent } from './components/administracion/prospectos/prospectos.component';
import { ContactosComponent } from './components/administracion/contactos/contactos.component';
import { ModalContactosComponent } from './components/administracion/contactos/modal-contactos/modal-contactos.component';


//Catalogos
import { ModalTipoServiciosComponent } from './components/catalogos/tipo-servicios/modal-tipo-servicios/modal-tipo-servicios.component';
import { TipoServiciosComponent } from './components/catalogos/tipo-servicios/tipo-servicios.component';
import { ModalTiposEntregaComponent } from './components/catalogos/tipos-entrega/modal-tipos-entrega/modal-tipos-entrega.component';
import { TiposEntregaComponent } from './components/catalogos/tipos-entrega/tipos-entrega.component';
import { ModalUsuariosComponent } from './components/catalogos/usuarios/modal-usuarios/modal-usuarios.component';
import { UsuariosComponent } from './components/catalogos/usuarios/usuarios.component';
import { PermisosComponent } from './components/catalogos/permisos/permisos.component';


import { TopVeinteComponent } from './components/dashboard/top-veinte/top-veinte.component';

// Shared

import { DocumentosOportunidadesComponent } from './components/layouts/oportunidades/documentos-oportunidades/documentos-oportunidades.component';
import { SeguimientoOportunidadesComponent } from './components/layouts/oportunidades/seguimiento-oportunidades/seguimiento-oportunidades.component';
import { HeaderComponent } from './components/layouts/master/header/header.component';
import { VerticalBarComponent } from './components/layouts/master/vertical-bar/vertical-bar.component';
import { FooterComponent } from './components/layouts/master/footer/footer.component';
import { MenuComponent } from './components/layouts/master/menu/menu.component';
import { AgregarQuitarColumnasComponent } from './components/utils/tablas/agregar-quitar-columnas/agregar-quitar-columnas.component';
import { ColumnFilterComponent } from './components/utils/tablas/column-filter/column-filter.component';
import { OortunidadesMesAcordeonComponent } from './components/en-proceso/acordion-horizontal/app-oportunidadesMes-acordeon.component';
import { ColumnasDisponiblesComponent } from './components/utils/tablas/columnas-disponibles/columnas-disponibles.component';
import { HeaderOpcionesComponent } from './components/utils/tablas/header-opciones/header-opciones.component';


//Asistentes
import { AsistenteOperacionComponent } from './components/asistentes/asistente-operacion/asistente-operacion.component';
import { ChatBotAsistenteOperacionComponent } from './components/asistentes/asistente-operacion/chatBot/chatBotAsistenteOperacion.component';
import { AsistenteBienvenidaComponent } from './components/asistentes/asistente-bienvenida/asistente-bienvenida.component';
import { ChatBotBienvenidaComponent } from './components/asistentes/asistente-bienvenida/chatBot/chatBotBienvenida.component';

export function getBaseUrl() {
  return 'https://localhost:49834/'
}

import { PrimeNgConfiguracionService } from './services/primeNgConfiguracion.service';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { TipoCurrencyPipe } from './pipes/tipoCurrency.pipe';
import localeEs from '@angular/common/locales/es-MX';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { YaSePreguntoPipe } from "./pipes/asistentes/yaSePregunto";
import { UsuarioPerfilComponent } from './components/usuario-perfil/usuario-perfil.component';
import { AcordeonOportunidadesEtapaComponent } from './components/en-proceso/acordeon-oportunidades-etapa/acordeon-oportunidades-etapa.component';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { OportunidadesGeneralComponent } from './components/dashboard/oportunidades-general/oportunidades-general.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { OportunidadesPorAgenteComponent } from './components/dashboard/oportunidades-por-agente/oportunidades-por-agente.component';
import { GraficasPorAnioComponent } from './components/terminadas/oportunidades-ganadas/graficas-por-anio/graficas-por-anio.component';
import { es } from 'plotly.js-locales';
import { GraficasPorAgenteComponent } from './components/terminadas/oportunidades-ganadas/graficas-por-agente/graficas-por-agente.component';
import { ModalDetallesIndicadoresEtapaComponent } from './components/dashboard/oportunidades-general/modal-detalles-indicadores-etapa/modal-detalles-indicadores-etapa.component';
import { ModalOportunidadesPorSectorComponent } from './components/dashboard/oportunidades-general/modal-oportunidades-por-sector/modal-oportunidades-por-sector.component';
import { ModalDetallesOportunidadesPorSectorComponent } from './components/dashboard/oportunidades-general/modal-detalles-oportunidades-por-sector/modal-detalles-oportunidades-por-sector.component';
import { GraficasPorAgentePerdidasComponent } from './components/terminadas/oportunidades-perdidas/graficas-por-agente-perdidas/graficas-por-agente-perdidas.component';
import { GraficasPorAgenteEliminadasComponent } from './components/terminadas/oportunidades-eliminadas/graficas-por-agente-eliminadas/graficas-por-agente-eliminadas.component';
import { GraficasPorAgenteCanceladasComponent } from './components/terminadas/oportunidades-canceladas/graficas-por-agente-canceladas/graficas-por-agente-canceladas.component';
import { ModalOportunidadesPorTipoComponent } from './components/dashboard/oportunidades-general/modal-oportunidades-por-tipo/modal-oportunidades-por-tipo.component';
import { ModalDetallesOportunidadesPorTipoComponent } from './components/dashboard/oportunidades-general/modal-detalles-oportunidades-por-tipo/modal-detalles-oportunidades-por-tipo.component';
import { AcordeonProspectosContactosComponent } from './components/administracion/acordeon-prospectos-contactos/acordeon-prospectos-contactos.component';
import { ServiciosEntregasComponent } from './components/catalogos/servicios-entregas/servicios-entregas.component';
import { UsuariosPermisosComponent } from './components/catalogos/usuarios-permisos/usuarios-permisos.component';
import { GraficasClientesTop20Component } from './components/dashboard/top-veinte/graficas-clientes-top20/graficas-clientes-top20.component';
import { PanelesTerminadasComponent } from './components/terminadas/paneles-terminadas/paneles-terminadas.component';

PlotlyModule.plotlyjs = PlotlyJS;

if (PlotlyJS.register) {
  PlotlyJS.register(es);
}
if (PlotlyJS.setPlotConfig) {
  PlotlyJS.setPlotConfig({ locale: 'es' });
}
export function configurationProviderFactory(provider: PrimeNgConfiguracionService) {
  return () => provider.load();
}

registerLocaleData(localeEs, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PoliticaPrivacidadComponent,
    TerminosCondicionesComponent,
    MenuComponent,
    DobleAutenticacionComponent,
    OlvidasteContrasenaComponent,
    FooterComponent,
    ProspectosComponent,
    ModalTipoServiciosComponent,
    ModalProspectosComponent,
    ContactosComponent,
    ModalContactosComponent,
    TipoServiciosComponent,
    UsuariosComponent,
    ModalUsuariosComponent,
    OportunidadesComponent,
    OportunidadesPerdidasComponent,
    ModalOportunidadesPerdidasComponent,
    ModalOportunidadesComponent,
    TiposEntregaComponent,
    ModalTiposEntregaComponent,
    AgregarQuitarColumnasComponent,
    ColumnasDisponiblesComponent,
    ColumnFilterComponent,
    HeaderOpcionesComponent,
    OportunidadesGanadasComponent,
    TopVeinteComponent,
    ModalOportunidadesGanadasComponent,
    OportunidadesEliminadasComponent,
    ModalOportunidadesEliminadasComponent,
    SeguimientoOportunidadesComponent,
    DocumentosOportunidadesComponent,
    VerticalBarComponent,
    OportunidadesCanceladasComponent,
    ModalOportunidadesCanceladasComponent,
    HeaderComponent,
    OortunidadesMesAcordeonComponent,
    EstadisticasPorEtapaComponent,
    PermisosComponent,
    AsistenteOperacionComponent,
    ChatBotAsistenteOperacionComponent,
    AsistenteBienvenidaComponent,
    ChatBotBienvenidaComponent,
    AdministracionHerramientasComponent,
    ReporteIngresosUsuariosComponent,
    EjecucionProcesosComponent,
    UsuarioPerfilComponent,
    AcordeonOportunidadesEtapaComponent,
    OportunidadesGeneralComponent,
    AdminDashboardComponent,
    OportunidadesPorAgenteComponent,
    GraficasPorAnioComponent,
    GraficasPorAgenteComponent,
    ModalDetallesIndicadoresEtapaComponent,
    ModalDetallesIndicadoresEtapaComponent,
    ModalOportunidadesPorSectorComponent,
    ModalDetallesOportunidadesPorSectorComponent,
    GraficasPorAgentePerdidasComponent,
    GraficasPorAgenteEliminadasComponent,
    GraficasPorAgenteCanceladasComponent,
    ModalOportunidadesPorTipoComponent,
    ModalDetallesOportunidadesPorTipoComponent,
    AcordeonProspectosContactosComponent,
    ServiciosEntregasComponent,
    UsuariosPermisosComponent,
    GraficasClientesTop20Component,
    PanelesTerminadasComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    InputTextModule,
    TagModule,
    MultiSelectModule,
    SelectButtonModule,
    InputIcon,
    IconField,
    Tag,
    DialogModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    InputNumberModule,
    TextareaModule,
    PasswordModule,
    DialogModule,
    TooltipModule,
    DatePipe,
    CommonModule,
    TipoCurrencyPipe,
    CalendarModule,
    MatFormFieldModule,
    MatInputModule,
    DropdownModule,
    MatSidenavModule,
    BrowserModule,
    DragDropModule,
    TabViewModule,
    MatChipsModule,
    MatIconModule,
    YaSePreguntoPipe,
    SplitButtonModule,
    PlotlyModule,
    CambiarContrasenaComponent,
    CardModule,
    FieldsetModule,
    ToggleSwitchModule,
    MatExpansionModule
],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    {
      provide: APP_INITIALIZER,
      useFactory: configurationProviderFactory,
      deps: [PrimeNgConfiguracionService],
      multi: true,
    },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none'
        }
      }
    }),
    MessageService,
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
