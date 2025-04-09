import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CONDITIONS_FUNCTIONS, CONDITIONS_LIST } from "./filterFunction";

export interface search {
  valores: any[];
  metodos: any;
  columnaFiltro: string;
  limpiarFiltro: boolean;
}
@Component({
  selector: 'app-column-filter',
  standalone: false,
  templateUrl: './column-filter.component.html',
  styleUrl: './column-filter.component.css'
})
export class ColumnFilterComponent {
  listaFiltrada: any[] = [];
  conditionsList = CONDITIONS_LIST;
  searchValue: any = '';
  _filterMethods = CONDITIONS_FUNCTIONS;
  searchFilter!: search;



  constructor(private dialogRef: MatDialogRef<ColumnFilterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.listaFiltrada = data.valoresColumna;
  }

  aplicarFiltroParent(): void {
      if (this.listaFiltrada.filter(f => f.isCheck)) {
          this.searchFilter = {
              valores: this.listaFiltrada,
              metodos: this._filterMethods,
              columnaFiltro: this.data.columnaFiltro,
              limpiarFiltro: false
          }
          this.dialogRef.close(this.searchFilter);
      }
  }

  limpiarFiltroParent(): void {
      this.searchFilter = {
          valores: [],
          metodos: [],
          columnaFiltro: this.data.columnaFiltro,
          limpiarFiltro: true
      }
      this.dialogRef.close(this.searchFilter);
  }

  onChangeValue(): void {
      this.listaFiltrada = this.data.valoresColumna.filter((filtro: any) => {
          const prov = filtro.valor.toLowerCase();
          return prov.includes(this.searchValue.toLowerCase());
      });
  }
  isDateString(string: string): boolean {
      return string.match(/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d/g) ? true : false;
  }
}

