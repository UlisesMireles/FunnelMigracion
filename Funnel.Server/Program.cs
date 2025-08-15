using DinkToPdf.Contracts;
using DinkToPdf;
using Funnel.Server.Extensions;
using Microsoft.Extensions.Configuration;
using Funnel.Server.PdfTools;
using Microsoft.Extensions.FileProviders;
using Funnel.Logic.Utils.Asistentes;
using Funnel.Logic.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("https://127.0.0.1:7107", "https://localhost:7107")
            .AllowAnyHeader()
            .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddSingleton<HttpClient>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var scrapingServiceUrl = configuration["WebScrapingService:Url"] ?? "http://localhost:3000";
    var client = new HttpClient
    {
        BaseAddress = new Uri(scrapingServiceUrl),
        Timeout = TimeSpan.FromMinutes(2)
    };
    client.DefaultRequestHeaders.Add("User-Agent", "Funnel-WebScraping-Service/1.0");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    client.DefaultRequestHeaders.Add("Content-Type", "application/json");
    return client;
});

builder.Services.AddMemoryCache();
//Inyeccion de dependencias
builder.Services.AddServices(); 

// ...otros servicios
builder.Services.AddScoped<AsistenteProspeccionInteligente>();


builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var context = new CustomAssemblyLoadContext();
context.LoadUnmanagedLibrary(Path.Combine(Directory.GetCurrentDirectory(), "PdfTools", "libwkhtmltox.dll"));
builder.Services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();

//Manejo de sesion
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(40);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();
app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Fotografia")),
    RequestPath = "/Fotografia"
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());

app.UseSession();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
