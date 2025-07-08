import { Component, Inject, OnInit , HostListener, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfiguracionTablaService } from '../../../../services/configuracion-tabla.service';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../../../services/login.service';
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
  columna1: any[] = [];
  columna2: any[] = [];
  @Input() vista: string = '';
  
  constructor(public dialogRef: MatDialogRef<ColumnasDisponiblesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
   private readonly messageService: MessageService, private readonly configuracionColumnasService: ConfiguracionTablaService,
   private readonly loginService: LoginService) {
    this.listaColumnas = data.todosColumnas
    this.originalData = JSON.parse(JSON.stringify(data.todosColumnas));
    this.vista = data.vista || '';
  }

  ngOnInit() {
  const columnasFiltradas = this.listaColumnas.filter(c => !c.isIgnore);
  const mitad = Math.ceil(columnasFiltradas.length / 2);

  if (columnasFiltradas.length > 12) {
    this.columna1 = columnasFiltradas.slice(0, mitad);
    this.columna2 = columnasFiltradas.slice(mitad);
  } else {
    this.columna1 = columnasFiltradas;
    this.columna2 = [];
  }
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
    let guardarRequest = {
      idTabla: this.data.todosColumnas[0]?.idTabla,
      idUsuario: this.loginService.obtenerIdUsuario(),
      configuracionTabla: this.data.todosColumnas
    }
    this.configuracionColumnasService.guardarConfiguracionTabla(guardarRequest).subscribe({
      next: (response: any) => {
        if(response.result){
          this.messageService.add({
            severity: 'success',  
            summary: 'Éxito',
            detail: 'Configuración guardada correctamente.',
            life: 3000
          });   
        }
        else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar la configuración. ' + response.errorMessage,
            life: 3000
          });
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar la configuración.',
          life: 3000
        });
      }
    });
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
