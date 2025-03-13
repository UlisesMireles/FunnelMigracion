import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AgregarQuitarColumnasComponent } from '../agregar-quitar-columnas/agregar-quitar-columnas.component';
import { pick } from "lodash-es";

@Component({
  selector: 'app-header-opciones',
  standalone: false,
  templateUrl: './header-opciones.component.html',
  styleUrl: './header-opciones.component.css'
})
export class HeaderOpcionesComponent implements OnInit {
  @Input() lsAddColumnas: any[]=[];
  @Input() columnsToDisplay: string[]=[];
  @Input() columnsToDisplayResp: string='';
  @Input() dataReporteDescarga: any;
  @Output() outColumnsToDisplayEmitter: EventEmitter<string[]> = new EventEmitter<string[]>();
  isDescargando = false;

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }


  agregarQuitarColumna(event: any) {
    const targetAttr = event.target.getBoundingClientRect();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.backdropClass = 'popUpBackDropClass';
    dialogConfig.panelClass = 'popUpPanelClass';
    dialogConfig.width = '350px';

    dialogConfig.data = {
      todosColumnas: this.lsAddColumnas
    };

    dialogConfig.position = {
      top: targetAttr.y + targetAttr.height + 10 + "px",
      left: targetAttr.x - targetAttr.width - 240 + "px"
    };
    const dialogRef = this.dialog.open(AgregarQuitarColumnasComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(r => {
      if(r){
        this.columnsToDisplay = JSON.parse(this.columnsToDisplayResp);
        let ultimoRegistro:any = this.columnsToDisplay[this.columnsToDisplay.length-1];
        if(ultimoRegistro.toLowerCase() === "acciones"){
          this.columnsToDisplay.pop();
          r.forEach((v: any) => {
            if (v.isCheck) {
              this.columnsToDisplay.push(v.key);
            }
          });
          this.columnsToDisplay.push(ultimoRegistro);
        }else{
          r.forEach((v: any) => {
            if (v.isCheck) {
              this.columnsToDisplay.push(v.key);
            }
          });
        }

        this.outColumnsToDisplayEmitter.emit(this.columnsToDisplay);
      }
    });
  }

  descargarReporte() {
    if(this.dataReporteDescarga){
      this.isDescargando = true;
      this.exportarExcel(this.dataReporteDescarga, "reporte.xlsx")
      this.isDescargando = false;
    }
    this.cdr.detectChanges();
  }

  exportarExcel(data: any[], nombreArchivo: string): void {
    let dataToExport: any[] = [];

    data.forEach(element => {
      let result = pick(element, this.columnsToDisplay);
      dataToExport.push(result);
    });

    import('xlsx').then(xlsx => {
      const hojadeCalculo: import('xlsx').WorkSheet = xlsx.utils.json_to_sheet(dataToExport);
      const libro: import('xlsx').WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(libro, hojadeCalculo, nombreArchivo);
      xlsx.writeFile(libro, nombreArchivo)
    });
  }
}
