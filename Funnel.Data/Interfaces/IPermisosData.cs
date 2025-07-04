﻿using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IPermisosData
    {
        public Task<List<PermisosDto>> ConsultarPermisos(int IdEmpresa);
        public Task<BaseOut> GuardarPermisos(List<PermisosDto> listPermisos);
        public Task<List<PermisosDto>> ComboRoles(int IdEmpresa);
        public Task<List<PermisosDto>> ConsultarPermisosPorRol(int IdRol, int IdEmpresa);
    }
}
