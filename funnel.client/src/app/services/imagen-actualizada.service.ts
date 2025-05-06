import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenActualizadaService {
  private imagenPerfilSource = new BehaviorSubject<string | null>(localStorage.getItem('imagenPerfil'));
  imagenPerfil$ = this.imagenPerfilSource.asObservable();

  actualizarImagenPerfil(nombreImagen: string) {
    localStorage.setItem('imagenPerfil', nombreImagen);
    this.imagenPerfilSource.next(nombreImagen);  // Notifica a todos los que escuchan
  }
}