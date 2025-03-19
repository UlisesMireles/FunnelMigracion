export const CONDITIONS_LIST = [
    { value: "nono", label: "No" },
    { value: "is-empty", label: "Esta Vacío" },
    { value: "is-not-empty", label: "No esta vacío" },
    { value: "is-equal", label: "es igual" },
    { value: "is-not-equal", label: "no es igual" },
    { value: "all-columns", label: "todas las columnas" }
  ];
  
  export const CONDITIONS_FUNCTIONS = { // search method base on conditions list value
    "is-empty": function (valor: string, valoresFiltrador: any) {
      return valor === "";
    },
    "is-not-empty": function (valor: string, valoresFiltrador: any) {
      return valor !== "";
    },
    "is-equal": function (valor: any, valoresFiltrador: any) {
      if (valoresFiltrador.length > 0) {
        return valoresFiltrador.some((data: any) => data.valor === valor.toString())
      } else {
        return valor.toString() === valoresFiltrador;
      }
    },
    "is-not-equal": function (valor: any, valoresFiltrador: any) {
      return valor != valoresFiltrador;
    },
    "all-columns": function (valor: any, valoresFiltrador: any) {
      if (valoresFiltrador.length > 0) {
        const results: any[] = [];
        valoresFiltrador.some((data: any) => {
          for (let key in valor) {
            if(valor[key] && valor[key].toString().toLowerCase().includes(data.valor.toString().toLowerCase())){
                results.push(valor[key]);
            }
          }
        });
        return results.length > 0;
      } else {
        return valor === valoresFiltrador;
      }
    }
  };
  