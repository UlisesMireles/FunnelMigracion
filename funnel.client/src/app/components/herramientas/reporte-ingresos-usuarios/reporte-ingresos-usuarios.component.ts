import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { HerramientasService } from '../../../services/herramientas.service';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../../services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { Ingresos } from '../../../interfaces/ingresos';
import { Table } from 'primeng/table';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from "lodash-es";
import { IngresosUsuarios } from '../../../interfaces/ingresos-usuarios';

@Component({
  selector: 'app-reporte-ingresos-usuarios',
  standalone: false,
  templateUrl: './reporte-ingresos-usuarios.component.html',
  styleUrl: './reporte-ingresos-usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReporteIngresosUsuariosComponent {

  readonly panelOpenState = signal(false);

  @ViewChild('dt') dt!: Table

  ingresos: Ingresos[] = [];
  ingresosOriginal: Ingresos[] = [];
  ingresosSeleccionado!: Ingresos;

  ingresosUsuarios: IngresosUsuarios[] = [];
  ingresosUsuariosOriginal: IngresosUsuarios[] = [];
  ingresosUsuariosPorAnio: IngresosUsuarios[] = [];
  ingresosUsuariosSeleccionado!: IngresosUsuarios;
  arrayGraficar: any[] = [];

  anchoTabla = 100;//porciento

  usuarioDropdown: any = [];
  usuarioDropdownOriginal: any = [];
  selectedUsuario: any = null;
  sortField = 'fechaIngreso';
  sortOrder = -1;
  years: string[] = [];
  selectedYear: string = new Date().getFullYear().toString();
  disabledPdf: boolean = false;

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

  /* ******************************************************/
  getIngresos() {
    this.herramientasService.getIngresos(this.loginService.obtenerIdUsuario(), this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result) => {

        //Mapeo de Usuarios
        //this.selectedUsuario = null;
        let usuarioDropdown: any = Array.from(
          new Map(result.map(i => [i.usuario, { label: i.usuario, value: i.usuario }])).values()
        );
        usuarioDropdown.unshift({ label: 'Todos los Usuarios', value: null });
        let usuarioDropdownOriginal = [...usuarioDropdown];

        //Mapeo de años
        if (result.length == 0) {
          this.years = [new Date().getFullYear().toString()];
        }
        else {
          this.years = result[0].anios.map(i => i.toString());
        }
        //this.years.unshift("Todos los Años");
        this.selectedYear = new Date().getFullYear().toString();


        this.ingresosUsuarios = [...result];
        this.ingresosUsuariosOriginal = result;
        this.ingresosUsuariosPorAnio = this.filtrarPorAnio(this.ingresosUsuarios, parseInt(this.selectedYear));


        setTimeout(() => {
          this.cdr.detectChanges();

        }, 0);
        
        //Generar array para graficar
        this.ingresosUsuarios.forEach(v => {
          v.anios.forEach(a => {
            let filtro = v.data.filter((x) => x.anio === a);
            if (filtro.length != 0) {
              this.arrayGraficar.push({
                idUsuario: v.idUsuario,
                anio: a,
                usuario: v.usuario,
                dataAGraficar: [{
                  x: filtro.map(i => i.mesTexto),
                  y: filtro.map(i => i.totalAccesos),
                  width: filtro.map(i => 0.2),
                  type: 'bar',
                  textfont: { family: "Old Standard TT", size: 13, color: "black" },

                }],
                layOutGrafica: {
                  title: {
                    text: `Reporte de Ingresos del año ${a}`
                  },
                  margin: { l: 50, r: 50, b: 130, t: 120 },
                  height: 400,

                },
                config: { displaylogo: false, responsive: true, locale: 'es-ES', scrollZoom: true, displayModeBar: true }
              });
            }
          })
        })


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

  filtrarPorAnio(usuarios: IngresosUsuarios[], anio: number): IngresosUsuarios[] {
  return usuarios
    .map(usuario => {
      const dataFiltrada = usuario.data.filter(item => item.anio === anio);
      if (dataFiltrada.length === 0) return null;

      const nuevoTotal = dataFiltrada.reduce((acc, item) => acc + item.totalAccesos, 0);

      return {
        ...usuario,
        data: dataFiltrada,
        total: nuevoTotal
      };
    })
    .filter((usuario): usuario is IngresosUsuarios => usuario !== null);
}

  onChangeFiltroAnio() {
    //Si se selecciono un año
    this.ingresosUsuariosPorAnio = this.filtrarPorAnio(this.ingresosUsuarios, parseInt(this.selectedYear));
  }

  getData(ingresoUsuario: IngresosUsuarios): any {
    let selectedYear = this.selectedYear
    let filtro = this.arrayGraficar.find(v => v.anio.toString() === selectedYear && v.idUsuario === ingresoUsuario.idUsuario);
    if (filtro) {
      return filtro.dataAGraficar
    }
    else
      return null

  }

  getLayout(ingresoUsuario: IngresosUsuarios): any {
    let selectedYear = this.selectedYear
    let filtro = this.arrayGraficar.find(v => v.anio.toString() === selectedYear && v.idUsuario === ingresoUsuario.idUsuario);
    if (filtro) {
      return filtro.layOutGrafica
    }
    else
      return null

  }

  getConfig(ingresoUsuario: IngresosUsuarios): any {
    let selectedYear = this.selectedYear
    let filtro = this.arrayGraficar.find(v => v.anio.toString() === selectedYear && v.idUsuario === ingresoUsuario.idUsuario);
    if (filtro) {
      return filtro.config
    }
    else
      return null

  }

  clear(table: Table) {
    this.loading = true
    this.getIngresos();
  }


}
