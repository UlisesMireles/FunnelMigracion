﻿using Funnel.Data;
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
            return services;
        }
    }
}
