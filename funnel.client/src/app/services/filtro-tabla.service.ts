import { Injectable } from "@angular/core";
import { groupBy, sortBy, keys as getKeys } from "lodash-es";
import { MatTableDataSource } from "@angular/material/table";
import { CONDITIONS_FUNCTIONS } from "../components/utils/tablas/column-filter/filterFunction";
@Injectable({
    providedIn: 'root'
})

export class FiltroTablaService {
    lsFiltros: any[] = [];
    _filterMethods = CONDITIONS_FUNCTIONS;
    sortBy = false;

    public newDataSource: MatTableDataSource<any>;

    constructor() {
        this.newDataSource = new MatTableDataSource<any>([]);
        this.newDataSource.filterPredicate = this.filterPredicate();
    }

    public addDataToFilter(lsData: any) {
        this.lsFiltros.push(lsData);
    }

    public getArrayByColumns(lsColumnas: any[]): any {
        return this.obtenerKeys(this.newDataSource.filteredData, lsColumnas);
    }

    obtenerKeys(data: any[], lsColumnas: any[]): any[] {
        const lsDatosFiltrosPorColumnas: any[] = [];
        const columnasFiltro = Object.values(lsColumnas).filter((v) => isNaN(Number(v)));
        columnasFiltro.forEach((columnaFiltro: string) => {
            const indexColumna = lsDatosFiltrosPorColumnas.findIndex(f => f.columnaFiltro === columnaFiltro);
            const arregloFiltros = this.obtenerArregloFiltros(data, columnaFiltro);
            if (indexColumna !== -1) {
                lsDatosFiltrosPorColumnas[indexColumna].valoresColumna = arregloFiltros;
            } else {
                lsDatosFiltrosPorColumnas.push({ columnaFiltro: columnaFiltro, valoresColumna: arregloFiltros });
            }
        });

        return lsDatosFiltrosPorColumnas;
    }

    obtenerArregloFiltros(data: any[], columna: string): any[] {
        const lsGroupBy = groupBy(data, columna);
        const lsSortBy = sortBy(getKeys(lsGroupBy));
        const arreglo: any[] = []
        lsSortBy.forEach((element: any) => {
            if (this.lsFiltros.length > 0) {
                const index = this.lsFiltros.findIndex((f: any) => f.columnaFiltro === columna)
                if (index != -1) {
                    this.lsFiltros[index].valores.forEach((v: any) => {
                        if (v.valor === element) {
                            arreglo.push({ valor: element, isCheck: v.isCheck })
                        }
                    });
                } else {
                    arreglo.push({ valor: element, isCheck: false })
                }
            } else {
                arreglo.push({ valor: element, isCheck: false })
            }
        });
        return arreglo;
    }

    filterPredicate(): (p: any, filter: any) => boolean {
        let filterFunction = (p: any, filter: any): boolean => {
            let result = true;
            const filterParse = JSON.parse(filter);

            if (filterParse == 0) {
                return result;
            }
            filterParse.forEach((e: any, i: number) => {
                if(e.columnaFiltro !== 'Todos'){
                    if (this._filterMethods['is-equal'](p[e.columnaFiltro as keyof any], e.valores) === false) {
                        result = false;
                    }
                }else {
                    if (this._filterMethods['all-columns'](p, e.valores) === false) {
                        result = false;
                    }
                }

            });
            return result;
        }

        return filterFunction;
    }

    sortDataSource(id: string, start: string) {
        this.newDataSource.data.sort((a: any, b: any) => {
            if (typeof b[id] === 'string' || typeof a[b] === 'string') {
                return start === 'asc'
                    ? a[id].localeCompare(b[id])
                    : b[id].localeCompare(a[id]);
            } else {
                return start === 'asc'
                    ? a[id] - b[id]
                    : b[id] - a[id];
            }

        });
        this.newDataSource._updateChangeSubscription();
    }

    aplicarFiltro(): void {
        this.newDataSource.filter = JSON.stringify(this.lsFiltros);
    }

    aplicarBusqueda(busqueda: string) {
        let lsBusqueda = JSON.parse(JSON.stringify(this.lsFiltros));
        const valueFilter = { valores: [{ valor: busqueda.trim().toLowerCase(), isCheck: true }], metodos: '', columnaFiltro: "Todos", limpiarFiltro: false };
        lsBusqueda.push(valueFilter);
        this.newDataSource.filter = JSON.stringify(lsBusqueda);
    }

    limpiarFiltroPorColumna(data: any, lsColumnas: any[]): void {
        const index = this.lsFiltros.findIndex((f: any) => f.columnaFiltro === data.columnaFiltro);
        if (index !== -1) {
            this.lsFiltros.splice(index, 1);
        }
        this.aplicarFiltro();
        this.getArrayByColumns(lsColumnas);
    }

}
