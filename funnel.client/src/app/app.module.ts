import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxCaptchaModule } from 'ngx-captcha';
import { providePrimeNG } from 'primeng/config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { UsuariosComponent } from './components/catalogos/usuarios/usuarios.component';
import { DobleAutenticacionComponent } from './components/doble-autenticacion/doble-autenticacion.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { OlvidasteContrasenaComponent } from './components/olvidaste-contrasena/olvidaste-contrasena.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { TooltipModule } from 'primeng/tooltip';

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
import { ContactosComponent } from './components/catalogos/contactos/contactos.component';
import { ModalContactosComponent } from './components/catalogos/contactos/modal-contactos/modal-contactos.component';
import { ModalOportunidadesCanceladasComponent } from './components/catalogos/oportunidades-canceladas/modal-oportunidades-canceladas/modal-oportunidades-canceladas.component';
import { OportunidadesCanceladasComponent } from './components/catalogos/oportunidades-canceladas/oportunidades-canceladas.component';
import { ModalOportunidadesEliminadasComponent } from './components/catalogos/oportunidades-eliminadas/modal-oportunidades-eliminadas/modal-oportunidades-eliminadas.component';
import { OportunidadesEliminadasComponent } from './components/catalogos/oportunidades-eliminadas/oportunidades-eliminadas.component';
import { ModalProspectosComponent } from './components/catalogos/prospectos/modal-prospectos/modal-prospectos.component';
import { ProspectosComponent } from './components/catalogos/prospectos/prospectos.component';
import { ModalTipoServiciosComponent } from './components/catalogos/tipo-servicios/modal-tipo-servicios/modal-tipo-servicios.component';
import { TipoServiciosComponent } from './components/catalogos/tipo-servicios/tipo-servicios.component';
import { ModalTiposEntregaComponent } from './components/catalogos/tipos-entrega/modal-tipos-entrega/modal-tipos-entrega.component';
import { TiposEntregaComponent } from './components/catalogos/tipos-entrega/tipos-entrega.component';
import { ModalUsuariosComponent } from './components/catalogos/usuarios/modal-usuarios/modal-usuarios.component';
import { PrimeNgConfiguracionService } from './services/primeNgConfiguracion.service';


export function getBaseUrl() {
  return 'https://localhost:49834/'
}

import { ModalOportunidadesPerdidasComponent } from './components/catalogos/oportunidades-perdidas/modal-oportunidades-perdidas/modal-oportunidades-perdidas.component';
import { OportunidadesPerdidasComponent } from './components/catalogos/oportunidades-perdidas/oportunidades-perdidas.component';
import { OportunidadesComponent } from './components/catalogos/oportunidades/oportunidades.component';
import { PermisosComponent } from './components/catalogos/permisos/permisos.component';

import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { ModalOportunidadesGanadasComponent } from './components/catalogos/oportunidades-ganadas/modal-oportunidades-ganadas/modal-oportunidades-ganadas.component';
import { OportunidadesGanadasComponent } from './components/catalogos/oportunidades-ganadas/oportunidades-ganadas.component';
import { ModalOportunidadesComponent } from './components/catalogos/oportunidades/modal-oportunidades/modal-oportunidades.component';
import { SeguimientoOportunidadesComponent } from './components/catalogos/seguimiento-oportunidades/seguimiento-oportunidades.component';
import { DocumentosOportunidadesComponent } from './components/catalogos/documentos-oportunidades/documentos-oportunidades.component';
import { AgregarQuitarColumnasComponent } from './components/shared/agregar-quitar-columnas/agregar-quitar-columnas.component';
import { ColumnFilterComponent } from './components/shared/column-filter/column-filter.component';
import { ColumnasDisponiblesComponent } from './components/shared/columnas-disponibles/columnas-disponibles.component';
import { HeaderOpcionesComponent } from './components/shared/header-opciones/header-opciones.component';
import { TipoCurrencyPipe } from './pipes/tipoCurrency.pipe';

import localeEs from '@angular/common/locales/es-MX';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { VerticalBarComponent } from './components/vertical-bar/vertical-bar.component';
import { HeaderComponent } from './components/header/header.component';
export function configurationProviderFactory(provider: PrimeNgConfiguracionService) {
  return () => provider.load();
}

registerLocaleData(localeEs, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    DobleAutenticacionComponent,
    CambiarContrasenaComponent,
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
    ModalOportunidadesGanadasComponent,
    OportunidadesEliminadasComponent,
    ModalOportunidadesEliminadasComponent,
    SeguimientoOportunidadesComponent,
    DocumentosOportunidadesComponent,
    VerticalBarComponent,
    OportunidadesCanceladasComponent,
    ModalOportunidadesCanceladasComponent,
    SeguimientoOportunidadesComponent,
    HeaderComponent,
    PermisosComponent
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
