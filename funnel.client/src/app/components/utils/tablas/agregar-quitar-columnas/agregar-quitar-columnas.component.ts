import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-agregar-quitar-columnas',
  standalone: false,
  templateUrl: './agregar-quitar-columnas.component.html',
  styleUrl: './agregar-quitar-columnas.component.css'
})
export class AgregarQuitarColumnasComponent implements OnInit {
  searchValue: any = '';
  listaColumnas: any[] = [];
  constructor(public dialogRef: MatDialogRef<AgregarQuitarColumnasComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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

