import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-evaluar-bot',
  standalone: false,
  templateUrl: './evaluar-bot.component.html',
  styleUrl: './evaluar-bot.component.css'
})
export class EvaluarBotComponent {
  constructor (public dialogRef: MatDialogRef <EvaluarBotComponent>) {}
}
