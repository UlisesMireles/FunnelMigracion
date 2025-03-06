using Funnel.Data;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;
using Azure.Core;
using Funnel.Logic.Interfaces;


namespace Funnel.Logic
{
    public class UsuarioService : IUsuariosService
    {
        private readonly IUsuarioData _usuarioData;

        public UsuarioService(IUsuarioData usuarioData)
        {
            _usuarioData = usuarioData;
        }

        public async Task<List<UsuarioDto>> ConsultarUsuarios(int IdUsuario)
        {
            return await _usuarioData.ConsultarUsuarios(IdUsuario);
        }

        public async Task<BaseOut> GuardarUsuarios(UsuarioDto request)
        {
            BaseOut result = new BaseOut();
            return await _usuarioData.GuardarUsuarios(request);
        }

        
    }
}
