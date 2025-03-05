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



import { ModalTipoServiciosComponent } from './components/catalogos/tipo-servicios/modal-tipo-servicios/modal-tipo-servicios.component';
import { ProspectosComponent } from './components/catalogos/prospectos/prospectos.component';

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
export function getBaseUrl() {
  return 'https://localhost:49834/'
}
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactosComponent } from './components/catalogos/contactos/contactos.component';
import { ModalContactosComponent } from './components/catalogos/contactos/modal-contactos/modal-contactos.component';
import { TipoServiciosComponent } from './components/catalogos/tipo-servicios/tipo-servicios.component';





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
    ContactosComponent,
    ModalContactosComponent,
    TipoServiciosComponent,
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
    PasswordModule

  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none'
        }
      }
    }),
    MessageService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
