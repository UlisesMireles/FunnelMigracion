import { Component, Inject, OnInit , HostListener } from '@angular/core';
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
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  modalPosition = { x: 0, y: 0 };

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

  onMouseDown(event: MouseEvent): void {
    if (event.target instanceof HTMLElement && event.target.classList.contains('draggable-header')) {
      this.isDragging = true;
      this.dragOffset = {
        x: event.clientX - this.modalPosition.x,
        y: event.clientY - this.modalPosition.y
      };
      event.preventDefault();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.modalPosition = {
        x: event.clientX - this.dragOffset.x,
        y: event.clientY - this.dragOffset.y
      };
      this.updatePosition();
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
  }

  private updatePosition(): void {
    const modal = document.querySelector('.listCheck') as HTMLElement;
    if (modal) {
      modal.style.setProperty('--pos-x', `${this.modalPosition.x}px`);
      modal.style.setProperty('--pos-y', `${this.modalPosition.y}px`);
    }
  }
}
