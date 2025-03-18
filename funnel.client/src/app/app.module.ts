import { HttpClientModule } from '@angular/common/http';
import { NgModule  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { DobleAutenticacionComponent } from './components/doble-autenticacion/doble-autenticacion.component';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { OlvidasteContrasenaComponent } from './components/olvidaste-contrasena/olvidaste-contrasena.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { UsuariosComponent } from './components/catalogos/usuarios/usuarios.component';

import { TooltipModule } from 'primeng/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { Dropdown } from 'primeng/dropdown';

import { ModalTipoServiciosComponent } from './components/catalogos/tipo-servicios/modal-tipo-servicios/modal-tipo-servicios.component';
import { ProspectosComponent } from './components/catalogos/prospectos/prospectos.component';
import { ModalProspectosComponent } from './components/catalogos/prospectos/modal-prospectos/modal-prospectos.component';
import { ModalUsuariosComponent } from './components/catalogos/usuarios/modal-usuarios/modal-usuarios.component';
import { OportunidadesEliminadasComponent } from './components/catalogos/oportunidades-eliminadas/oportunidades-eliminadas.component';
import { ModalOportunidadesEliminadasComponent } from './components/catalogos/oportunidades-eliminadas/modal-oportunidades-eliminadas/modal-oportunidades-eliminadas.component';

import { TiposEntregaComponent } from './components/catalogos/tipos-entrega/tipos-entrega.component';
import { ModalTiposEntregaComponent } from './components/catalogos/tipos-entrega/modal-tipos-entrega/modal-tipos-entrega.component';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'; 
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule, Tag } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNG } from "primeng/config";
import { PrimeNgConfiguracionService } from './services/primeNgConfiguracion.service';

export function getBaseUrl() {
  return 'https://localhost:49834/'
}
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactosComponent } from './components/catalogos/contactos/contactos.component';
import { ModalContactosComponent } from './components/catalogos/contactos/modal-contactos/modal-contactos.component';
import { TipoServiciosComponent } from './components/catalogos/tipo-servicios/tipo-servicios.component';

import { OportunidadesComponent} from './components/catalogos/oportunidades/oportunidades.component';
import { OportunidadesPerdidasComponent} from './components/catalogos/oportunidades-perdidas/oportunidades-perdidas.component';
import { ModalOportunidadesPerdidasComponent } from './components/catalogos/oportunidades-perdidas/modal-oportunidades-perdidas/modal-oportunidades-perdidas.component';


import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { TipoCurrencyPipe } from './pipes/tipoCurrency.pipe';
import { ModalOportunidadesComponent } from './components/catalogos/oportunidades/modal-oportunidades/modal-oportunidades.component';
import { AgregarQuitarColumnasComponent } from './components/shared/agregar-quitar-columnas/agregar-quitar-columnas.component';
import { ColumnasDisponiblesComponent } from './components/shared/columnas-disponibles/columnas-disponibles.component';
import { ColumnFilterComponent } from './components/shared/column-filter/column-filter.component';
import { HeaderOpcionesComponent } from './components/shared/header-opciones/header-opciones.component';
import { OportunidadesGanadasComponent } from './components/catalogos/oportunidades-ganadas/oportunidades-ganadas.component';
import { ModalOportunidadesGanadasComponent } from './components/catalogos/oportunidades-ganadas/modal-oportunidades-ganadas/modal-oportunidades-ganadas.component';

import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es-MX';

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
