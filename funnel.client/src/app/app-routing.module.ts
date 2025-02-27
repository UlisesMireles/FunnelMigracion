import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { LoginComponent } from './components/login/login.component';
import { DobleAutenticacionComponent } from './components/doble-autenticacion/doble-autenticacion.component';
import { OlvidasteContrasenaComponent } from './components/olvidaste-contrasena/olvidaste-contrasena.component';
import { ProspectosComponent } from './components/catalogos/prospectos/prospectos.component';

const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'prospectos', component: ProspectosComponent, title: 'Login' },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent, title: 'Cambiar Contraseña' },
  { path: 'two-factor', component: DobleAutenticacionComponent, title: 'Autenticación' },
  { path: 'recuperar-contrasena', component: OlvidasteContrasenaComponent, title: 'Recuperar contraseña' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
