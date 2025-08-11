import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-eliminar-conversacion',
  standalone: false,
  templateUrl: './eliminar-conversacion.component.html',
  styleUrl: './eliminar-conversacion.component.css'
})
export class EliminarConversacionComponent {
  constructor(public dialogRef: MatDialogRef<EliminarConversacionComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}