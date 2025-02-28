import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { DobleAutenticacionComponent } from './components/doble-autenticacion/doble-autenticacion.component';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { OlvidasteContrasenaComponent } from './components/olvidaste-contrasena/olvidaste-contrasena.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
export function getBaseUrl() {
  return 'https://localhost:49834/'
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    DobleAutenticacionComponent,
    CambiarContrasenaComponent,
    OlvidasteContrasenaComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule

  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        options: {
          darkModeSelector: false || 'none'
        }
      }
    }),
    MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
