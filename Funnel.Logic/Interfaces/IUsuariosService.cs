using Funnel.Data;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Logic.Interfaces;
using Microsoft.AspNetCore.Http;
using DinkToPdf;


namespace Funnel.Logic.Interfaces
{
    public interface IUsuariosService
    {
        Task<List<UsuarioDto>> ConsultarUsuarios(int IdEmpresa);
        Task<BaseOut> GuardarUsuarios(UsuarioDto request);
        public Task<List<ComboTiposUsuariosDto>> ComboTiposUsuarios();
        public Task<List<ComboPuestosDto>> ComboPuestos();
        Task<bool> ValidarInicialesExistente(string iniciales, int idEmpresa);
        Task<BaseOut> GuardarImagen(List<IFormFile> imagen, UsuarioDto request);
        public Task<byte[]> GenerarReporteUsuarios(UsuariosReporteDTO usuarios, string RutaBase, string titulo, int IdEmpresa);
    }
}
