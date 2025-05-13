using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Base;

namespace Funnel.Logic
{
    public class PermisosService : IPermisosService
    {
        private readonly IPermisosData _permisosData;
        public PermisosService(IPermisosData permisosData)
        {
            _permisosData = permisosData;
        }

        public async Task<List<PermisosDto>> ComboRoles(int IdEmpresa)
        {
            return await _permisosData.ComboRoles(IdEmpresa);
        }

        public async Task<List<PermisosDto>> ConsultarPermisos(int IdEmpresa)
        {
            return await _permisosData.ConsultarPermisos(IdEmpresa);
        }

        public async Task<BaseOut> GuardarPermisos(List<PermisosDto> listPermisos)
        {
            return await _permisosData.GuardarPermisos(listPermisos);
        }
        public async Task<List<MenuPermisos>> ConsultarPermisosPorRol(int IdRol, int IdEmpresa)
        {
            List<MenuPermisos> listaMenu = new List<MenuPermisos>();
            var datos = await _permisosData.ConsultarPermisosPorRol(IdRol, IdEmpresa);

            listaMenu = datos.GroupBy(x => x.IdMenu).Select(x => new MenuPermisos
            {
                IdMenu = x.Key,
                Nombre = x.First().Menu,
                Icono = x.First().Icono,
                ColorIcono = x.First().ColorIcono,
                Tooltip = x.First().Menu,
                SubMenu = x.Select(y => new PaginasDto
                {
                    IdPagina = y.IdPagina,
                    Pagina = y.Pagina,
                    Ruta = y.Ruta,
                }).ToList()
            }).ToList();

            foreach(MenuPermisos item in listaMenu)
            {
                if(item.SubMenu.Count == 1)
                {
                    item.Ruta = item.SubMenu[0].Ruta;
                    item.SubMenu = null;
                }
            }

            return listaMenu;
        }
    }
}
