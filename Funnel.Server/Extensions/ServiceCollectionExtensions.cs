using Funnel.Data;
using Funnel.Logic.Interfaces;
using Funnel.Logic;
using Funnel.Data.Interfaces;

namespace Funnel.Server.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<ILoginData, LoginData>();
            services.AddScoped<ILoginService, LoginService>();
            services.AddScoped<IContactoData, ContactoData>();
            services.AddScoped<IContactoService, ContactoService>();
            services.AddScoped<IProspectoData, ProspectoData>();
            services.AddScoped<IProspectosService, ProspectoService>();
            services.AddScoped<IServiciosData, ServiciosData>();
            services.AddScoped<IServiciosService, ServiciosService>();
            services.AddScoped<IUsuarioData, UsuarioData>();
            services.AddScoped<IUsuariosService, UsuarioService>();
            services.AddScoped<IOportunidadesEnProcesoData, OportunidadesEnProcesoData>();
            services.AddScoped<IOportunidadesEnProcesoService, OportunidadesEnProcesoService>();
            services.AddScoped<ITipoEntregaData, TipoEntregaData>();
            services.AddScoped<ITiposEntregaService, TiposEntregaService>();
            services.AddScoped<IArchivoData, ArchivoData>();
            services.AddScoped<IArchivosService, ArchivoService>();
            services.AddScoped<IPermisosData, PermisosData>();
            services.AddScoped<IPermisosService, PermisosService>();
            services.AddScoped<IHerramientasData, HerramientasData>();
            services.AddScoped<IHerramientasService, HerramientasService>();
            services.AddScoped<IGraficasData, GraficasData>();
            services.AddScoped<IGraficasService, GraficasService>();
            services.AddScoped<IConfiguracionesData, ConfiguracionesData>();
            services.AddScoped<IInputsAdicionalesData, InputsAdicionalesData>();
            services.AddScoped<IInputsAdicionalesService, InputsAdicionalesService>();


            return services;
        }
    }
}
