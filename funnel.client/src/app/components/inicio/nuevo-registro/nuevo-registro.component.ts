import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-nuevo-registro',
  standalone: false,
  templateUrl: './nuevo-registro.component.html',
  styleUrl: './nuevo-registro.component.css'
})
export class NuevoRegistroComponent {
  baseUrl: string = environment.baseURLAssets;
  currentStep = 1;

  goToStep(step: number) {
    this.currentStep = step;
  }
  moveNext(event: Event, nextInput: HTMLInputElement) {
  const input = event.target as HTMLInputElement;
  if (input.value.length === 1) {
    nextInput.focus();
  }
}

movePrev(event: KeyboardEvent, prevInput: HTMLInputElement) {
  const input = event.target as HTMLInputElement;
  if (event.key === 'Backspace' && !input.value) {
    prevInput.focus();
  }
}


  finish() {
    this.currentStep = 1; 
  }

}
