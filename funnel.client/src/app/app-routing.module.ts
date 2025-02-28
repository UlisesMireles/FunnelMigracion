import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { LoginComponent } from './components/login/login.component';
import { DobleAutenticacionComponent } from './components/doble-autenticacion/doble-autenticacion.component';
import { OlvidasteContrasenaComponent } from './components/olvidaste-contrasena/olvidaste-contrasena.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProspectosComponent } from './components/catalogos/prospectos/prospectos.component';
import { ContactosComponent } from './components/catalogos/contactos/contactos.component';

const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent, title: 'Cambiar Contraseña', canActivate: [AuthGuard] },
  { path: 'two-factor', component: DobleAutenticacionComponent, title: 'Autenticación', canActivate: [AuthGuard] },
  { path: 'recuperar-contrasena', component: OlvidasteContrasenaComponent, title: 'Recuperar contraseña'},
  { path: 'prospectos', component: ProspectosComponent, title: 'Prospectos', canActivate: [AuthGuard] },
  { path: 'contactos', component: ContactosComponent, title: 'Contactos', canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
