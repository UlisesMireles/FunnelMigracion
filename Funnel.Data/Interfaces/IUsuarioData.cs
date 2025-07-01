using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data;
using Microsoft.AspNetCore.Http;

namespace Funnel.Data.Interfaces
{
    public interface IUsuarioData
    {
        Task<List<UsuarioDto>> ConsultarUsuarios(int IdEmpresa);

        Task<BaseOut> GuardarUsuarios(UsuarioDto usuarios);
        public Task<List<ComboTiposUsuariosDto>> ComboTiposUsuarios();
        Task<List<string>> ObtenerInicialesPorEmpresa(int idEmpresa);
        Task<bool> ValidarInicialesExistente(string iniciales, int idEmpresa);

        Task<BaseOut> GuardarImagen(List<IFormFile> imagen, UsuarioDto request);
    }
}
