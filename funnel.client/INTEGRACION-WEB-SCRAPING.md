# Integración de Web Scraping con Angular y .NET

## 📋 Resumen

Esta guía te muestra cómo integrar el módulo de web scraping en tu aplicación Angular existente con backend .NET, permitiendo que tu asistente de IA realice búsquedas web en tiempo real.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular App   │───▶│   .NET Backend  │───▶│ Node.js Service │
│   (Frontend)    │    │   (API Gateway) │    │ (Web Scraping)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Estructura de Archivos

```
funnel.client/
├── src/app/
│   ├── services/
│   │   └── web-scraping.service.ts          # ✅ Creado
│   └── components/asistentes/asistente-prospeccion/
│       └── chatBot/
│           └── chatBotProspeccion.component.ts  # ✅ Modificado
├── web-scraping-service/                    # ✅ Creado
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
└── WebScrapingController.cs                 # ✅ Creado
```

## 🚀 Pasos de Implementación

### 1. Configurar el Servicio Node.js

```bash
# Navegar al directorio del servicio
cd web-scraping-service

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Verificar que funciona
curl http://localhost:3000/health
```

### 2. Configurar el Backend .NET

#### A. Agregar configuración en `appsettings.json`:

```json
{
  "WebScrapingService": {
    "Url": "http://localhost:3000"
  }
}
```

#### B. Registrar HttpClient en `Program.cs`:

```csharp
builder.Services.AddHttpClient();
```

#### C. Agregar el controlador al proyecto:

```csharp
// Copiar WebScrapingController.cs a tu proyecto .NET
// Asegúrate de que esté en el namespace correcto
```

### 3. Configurar Angular

#### A. Verificar que el servicio esté registrado:

El servicio `WebScrapingService` ya está configurado con `providedIn: 'root'`.

#### B. Actualizar `environment.ts`:

```typescript
export const environment = {
  production: false,
  baseURL: 'http://localhost:5000', // Tu API .NET
  // ... otras configuraciones
};
```

### 4. Probar la Integración

#### A. Iniciar todos los servicios:

```bash
# Terminal 1: Servicio Node.js
cd web-scraping-service
npm start

# Terminal 2: Backend .NET
dotnet run

# Terminal 3: Angular
ng serve
```

#### B. Probar desde el chat:

1. Abre tu aplicación Angular
2. Ve al chat del asistente
3. Escribe: "Busca las últimas noticias sobre inteligencia artificial"
4. El sistema debería:
   - Detectar que necesitas búsqueda web
   - Mostrar "🔍 Buscando información en la web..."
   - Presentar resultados encontrados
   - Permitir seleccionar y enviar al asistente

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# .env para el servicio Node.js
PORT=3000
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:5000
MAX_BROWSERS=3
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Configuración de Seguridad

```typescript
// En el servicio Angular
private readonly apiUrl = environment.baseURL + '/api/WebScraping';

// Agregar headers de autenticación si es necesario
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${this.authService.getToken()}`
});
```

## 🐳 Docker Deployment

### Construir imagen del servicio:

```bash
cd web-scraping-service
docker build -t web-scraping-service .
docker run -p 3000:3000 web-scraping-service
```

### Docker Compose (opcional):

```yaml
version: '3.8'
services:
  web-scraping:
    build: ./web-scraping-service
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🔍 Funcionalidades Implementadas

### 1. Detección Automática de Búsquedas Web

El sistema detecta automáticamente cuando el usuario quiere buscar información:

```typescript
private necesitaBusquedaWeb(mensaje: string): boolean {
  const palabrasClave = [
    'busca', 'buscar', 'encuentra', 'encontrar', 'investiga', 'investigar',
    'últimas noticias', 'noticias', 'tendencias', 'actualidad', 'información actual'
  ];
  
  const mensajeLimpio = mensaje.toLowerCase().trim();
  return palabrasClave.some(palabra => mensajeLimpio.includes(palabra));
}
```

### 2. Búsqueda Inteligente

```typescript
// Búsqueda optimizada para el asistente
intelligentSearch(query: string, maxResults: number = 5): Observable<ScrapingResponse> {
  const request: WebSearchRequest = {
    query,
    maxResults,
    includeImages: false
  };
  return this.searchWebForAssistant(request);
}
```

### 3. Selección de Resultados

Los usuarios pueden:
- Ver todos los resultados encontrados
- Seleccionar resultados específicos
- Enviar solo los seleccionados al asistente
- Cancelar la búsqueda

### 4. Integración con el Asistente

```typescript
// Enviar información web al asistente
enviarResultadosWebAlAsistente() {
  const informacionWeb = this.selectedWebResults.map(resultado => 
    `📄 ${resultado.title}\n🔗 ${resultado.url}\n📝 ${resultado.snippet}`
  ).join('\n\n');

  const consultaConWeb = {
    ...this.consultaAsistente,
    pregunta: `Consulta original: ${this.consultaAsistente.pregunta}\n\nInformación encontrada en la web:\n${informacionWeb}`
  };

  this.OpenIaService.asistenteProspeccion(consultaConWeb).subscribe(/* ... */);
}
```

## 🧪 Testing

### Probar el Servicio Node.js:

```bash
# Health check
curl http://localhost:3000/health

# Búsqueda de prueba
curl -X POST http://localhost:3000/search-for-assistant \
  -H "Content-Type: application/json" \
  -d '{"query": "inteligencia artificial 2024", "maxResults": 3}'
```

### Probar el Controlador .NET:

```bash
# Búsqueda a través del API .NET
curl -X POST http://localhost:5000/api/WebScraping/search-for-assistant \
  -H "Content-Type: application/json" \
  -d '{"query": "tendencias tecnológicas", "maxResults": 5}'
```

## 🔧 Troubleshooting

### Problemas Comunes:

1. **Error: "PUPPETEER_EXECUTABLE_PATH not found"**
   - Solución: Verificar que Chromium esté instalado en el Docker container

2. **Error: "CORS policy"**
   - Solución: Verificar configuración de CORS en el servicio Node.js

3. **Error: "Timeout"**
   - Solución: Aumentar timeouts en el controlador .NET

4. **Error: "Rate limit exceeded"**
   - Solución: Ajustar límites de rate limiting

### Logs Útiles:

```bash
# Ver logs del servicio Node.js
docker logs web-scraping-service

# Ver logs del backend .NET
dotnet run --verbosity normal
```

## 📊 Monitoreo

### Métricas del Servicio:

- Tiempo de respuesta promedio
- Número de búsquedas por minuto
- Tasa de éxito de scraping
- Uso de memoria del pool de navegadores

### Health Checks:

```bash
# Verificar estado del servicio
curl http://localhost:3000/health
```

## 🚀 Próximos Pasos

1. **Implementar caché** para búsquedas repetidas
2. **Agregar más fuentes** de búsqueda (Bing, DuckDuckGo)
3. **Implementar análisis de sentimiento** de resultados
4. **Agregar filtros** por fecha, idioma, región
5. **Implementar búsqueda de imágenes** si es necesario

## 📞 Soporte

Si encuentras problemas:

1. Verifica que todos los servicios estén corriendo
2. Revisa los logs de cada servicio
3. Asegúrate de que las URLs y puertos sean correctos
4. Verifica la conectividad entre servicios

¡Tu asistente ahora puede buscar información en la web en tiempo real! 🎉 