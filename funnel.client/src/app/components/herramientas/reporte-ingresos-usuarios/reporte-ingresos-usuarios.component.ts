import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { HerramientasService } from '../../../services/herramientas.service';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../../services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { Ingresos } from '../../../interfaces/ingresos';
import { Table } from 'primeng/table';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from "lodash-es";

@Component({
  selector: 'app-reporte-ingresos-usuarios',
  standalone: false,
  templateUrl: './reporte-ingresos-usuarios.component.html',
  styleUrl: './reporte-ingresos-usuarios.component.css'
})
export class ReporteIngresosUsuariosComponent {

  @ViewChild('dt') dt!: Table

  ingresos: Ingresos[] = [];
  ingresosOriginal: Ingresos[] = [];
  ingresosSeleccionado!: Ingresos;

  anchoTabla = 100;//porciento

  usuarioDropdown: any = [];
  selectedUsuario: any = null;
  sortField = 'fechaIngreso';
  sortOrder = -1;
  years: string[] = [];
  selectedYear: string = "Todos los Años";

  loading: boolean = true;
  lsColumnasAMostrar: any[] = [];
  lsTodasColumnas: any[] = [
    { key: 'usuario', isCheck: true, valor: 'Nombre Usuario', isIgnore: false, isTotal: true, groupColumn: false, tipoFormato: 'usuario' },
    { key: 'fechaIngreso', isCheck: true, valor: 'Fecha de Ingreso', isIgnore: false, isTotal: false, groupColumn: false, tipoFormato: 'date' }
  ];

  columnsAMostrarResp: string = JSON.stringify(this.lsColumnasAMostrar);
  columnsTodasResp: string = JSON.stringify(this.lsTodasColumnas);

  constructor(private herramientasService: HerramientasService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private readonly loginService: LoginService, public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.getIngresos();
    document.documentElement.style.fontSize = 12 + 'px';
  }

  getIngresos() {
    this.herramientasService.getIngresos(this.loginService.obtenerIdUsuario(), this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result) => {

        //Mapeo de Usuarios
        this.selectedUsuario = null;
        this.usuarioDropdown = Array.from(
          new Map(result.map(i => [i.usuario, { label: i.usuario, value: i.usuario }])).values()
        );
        this.usuarioDropdown.unshift({ label: 'Todos los Usuarios', value: null });

        //Mapeo de años
        this.years = [
          ...new Set(
            result
              .map(i => new Date(i.fechaIngreso).getFullYear().toString())
          )
        ];
        this.years.unshift("Todos los Años");
        this.selectedYear = "Todos los Años";

        this.ingresos = [...result];
        this.ingresosOriginal = result;
        setTimeout(() => {
          this.cdr.detectChanges();

        }, 0);
        this.loading = false;

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      },
    });
  }

  getColumnWidth(key: string): object {
    const widths: { [key: string]: string } = {
      usuario: '100%',
      fechaIngreso: '100%'
    };
    return { width: widths[key] || 'auto' };
  }

  clear(table: Table) {
    this.loading = true
    table.clear(); // Limpia filtros, ordenamiento y selección
    table.reset(); // También reinicia paginación (si hay)
    this.getIngresos();
    this.lsColumnasAMostrar = JSON.parse(this.columnsAMostrarResp);
    this.lsTodasColumnas = JSON.parse(this.columnsTodasResp);
    this.lsColumnasAMostrar = this.lsTodasColumnas.filter(col => col.isCheck);
    this.anchoTabla = 100;
    this.selectedYear = new Date().getFullYear().toString();

    table.sortField = this.sortField;
    table.sortOrder = this.sortOrder;
    table.sortSingle()
  }

  FiltrarPorUsuario() {

    if (this.selectedYear && this.selectedYear !== "Todos los Años") {
      this.ingresos = this.selectedUsuario === null
        ? [...this.ingresosOriginal.filter((x) => new Date(x.fechaIngreso).getFullYear().toString() === this.selectedYear)]
        : [...this.ingresosOriginal.filter((x) => x.usuario === this.selectedUsuario && new Date(x.fechaIngreso).getFullYear().toString() === this.selectedYear)];
      if (this.dt) {
        this.dt.first = 0;
      }
    }
    else {
      this.ingresos = this.selectedUsuario === null
        ? [...this.ingresosOriginal]
        : [...this.ingresosOriginal.filter((x) => x.usuario === this.selectedUsuario)];
      if (this.dt) {
        this.dt.first = 0;
      }
    }


  }

  filterByYear() {
    if (this.selectedYear && this.selectedYear !== "Todos los Años") {
      this.ingresos = this.selectedUsuario === null
        ? [...this.ingresosOriginal.filter((x) => new Date(x.fechaIngreso).getFullYear().toString() === this.selectedYear)]
        : [...this.ingresosOriginal.filter((x) => x.usuario === this.selectedUsuario && new Date(x.fechaIngreso).getFullYear().toString() === this.selectedYear)];
      if (this.dt) {
        this.dt.first = 0;
      }

    }
    else {
      this.ingresos = [...this.ingresosOriginal]
      if (this.dt) {
        this.dt.first = 0;
      }
    }
  }

  obtenerArregloFiltros(data: any[], columna: string): any[] {
    const lsGroupBy = groupBy(data, columna);
    return sortBy(getKeys(lsGroupBy));
  }

  getTotalCostPrimeNg(table: Table, def: any) {
    if (!def.isTotal) {
      return;
    }

    const registrosVisibles = table.filteredValue ? table.filteredValue : this.ingresos;

    if (def.key === 'usuario') {
      return registrosVisibles.length;
    }

    return (
      registrosVisibles.reduce(
        (acc: number, empresa: Ingresos) =>
          acc + (Number(empresa[def.key as keyof Ingresos]) || 0),
        0
      ) / registrosVisibles.length
    );
  }

  isSorted(columnKey: string): boolean {
    return this.dt?.sortField === columnKey;
  }

  exportPdf(table: Table) {
  }


}
