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
  originalData: any[] = []; 

  constructor(public dialogRef: MatDialogRef<ColumnasDisponiblesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listaColumnas = data.todosColumnas
    this.originalData = JSON.parse(JSON.stringify(data.todosColumnas));
  }


  ngOnInit() {
  }

  cerrarModal(): void {
    this.data.todosColumnas.forEach((element: any, index: number) => {
    element.isCheck = this.originalData[index].isCheck;
    });
    this.dialogRef.close();
  }
    hasChanges(): boolean {
    if (!this.originalData || !this.data.todosColumnas) {
    return false;
    }

    return this.data.todosColumnas.some((column: any, index: number) => {
      return column.isCheck !== this.originalData[index]?.isCheck;
    });
  }

  aplicarFiltroParent(): void {
    this.originalData = JSON.parse(JSON.stringify(this.data.todosColumnas));
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
