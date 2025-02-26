import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

    username: string = '';
    password: string = '';
    resetUsername: string = '';
    errorMessage: string = '';
    resetErrorMessage: string = '';
  
    openLoginModal() {
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.style.display = 'block';
      }
    }
  
    closeLoginModal() {
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.style.display = 'none';
      }
    }
  
    openResetModal() {
      const resetModal = document.getElementById('resetModal');
      if (resetModal) {
        resetModal.style.display = 'block';
      }
      this.closeLoginModal();
    }
  
    closeResetModal() {
      const resetModal = document.getElementById('resetModal');
      if (resetModal) {
        resetModal.style.display = 'none';
      }
    }
  
    login() {
      // Aquí puedes agregar la lógica para validar el inicio de sesión
      if (this.username === 'usuario' && this.password === 'contraseña') {
        this.errorMessage = '';
        alert('Inicio de sesión exitoso');
        this.closeLoginModal();
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    }
  
    resetPassword() {
      // Aquí puedes agregar la lógica para resetear la contraseña
      if (this.resetUsername === 'usuario') {
        this.resetErrorMessage = '';
        alert('Se ha enviado un correo para restablecer la contraseña');
        this.closeResetModal();
      } else {
        this.resetErrorMessage = 'Usuario no encontrado';
      }
    }
  }