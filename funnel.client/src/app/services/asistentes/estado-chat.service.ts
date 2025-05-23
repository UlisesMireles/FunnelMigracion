import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoChatService {
  private readonly STORAGE_KEY = 'chatState_operaciones';
  private state = new BehaviorSubject<any>(null);
  
  constructor() {
    this.loadInitialState();
    // Limpiar el estado cuando se cierre la pestaña/ventana
    window.addEventListener('beforeunload', () => this.clearState());
  }

  private loadInitialState() {
    const savedState = sessionStorage.getItem(this.STORAGE_KEY);
    if (savedState) {
      try {
        this.state.next(JSON.parse(savedState));
      } catch (e) {
        /*console.error('Error parsing chat state', e);*/
        this.clearState();
      }
    }
  }

  saveState(state: any) {
    try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem(this.STORAGE_KEY, serializedState); 
      this.state.next(state);
    } catch (e) {
      /*console.error('Error saving chat state', e);*/
    }
  }

  getCurrentState() {
    return this.state.value;
  }

  stateChanges() {
    return this.state.asObservable();
  }

  clearState() {
    sessionStorage.removeItem(this.STORAGE_KEY); 
    this.state.next(null);
  }
}