using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;

namespace Funnel.Logic
{
    public class LinceciasService : ILicenciasService
    {
        private readonly ILicenciasData _licenciasData;
        public LinceciasService(ILicenciasData licenciasData)
        {
            _licenciasData = licenciasData;
        }
        public async Task<List<LicenciasDto>> ConsultarLicencias()
        {
            return await _licenciasData.ConsultarLicencias();
        }
    }
}
