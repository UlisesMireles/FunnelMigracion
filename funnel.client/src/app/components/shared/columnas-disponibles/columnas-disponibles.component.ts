import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-columnas-disponibles',
  standalone: false,
  templateUrl: './columnas-disponibles.component.html',
  styleUrl: './columnas-disponibles.component.css'
})
export class ColumnasDisponiblesComponent implements OnInit {

  searchValue: any = '';
  listaColumnas: any[] = [];
  constructor(public dialogRef: MatDialogRef<ColumnasDisponiblesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listaColumnas = data.todosColumnas
  }


  ngOnInit() {
  }

  aplicarFiltroParent(): void {
    this.dialogRef.close(this.data.todosColumnas);
  }

  limpiarFiltroParent(): void {
    this.data.todosColumnas.forEach((element: any) => {
      element.isCheck = false;
    });
    this.dialogRef.close(this.data.todosColumnas);
  }

  onChangeValue(): void {
    this.data.todosColumnas = this.listaColumnas.filter((filtro: any) => {
      const prov = filtro.valor.toLowerCase();
      return prov.includes(this.searchValue.toLowerCase());
    });
  }
}
