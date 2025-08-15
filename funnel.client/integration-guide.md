# Guía de Integración - Módulo Web Scraping

## 🔗 Integración con tu Aplicación Angular Existente

### Paso 1: Agregar el Servicio al App Module

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WebScrapingService } from './services/web-scraping-service';
import { WebScrapingAssistantComponent } from './components/web-scraping-assistant/web-scraping-assistant.component';

@NgModule({
  declarations: [
    AppComponent,
    WebScrapingAssistantComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    WebScrapingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Paso 2: Actualizar Environment Files

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200/api',
  scrapingApiUrl: 'http://localhost:3000/api' // URL del servicio de scraping
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-produccion.com/api',
  scrapingApiUrl: 'https://tu-scraping-service.aws.com/api' // URL de producción
};
```

### Paso 3: Integrar con tu Asistente Existente

Basándome en tu código actual, aquí está cómo integrar el scraping con tu asistente:

```typescript
// src/app/components/asistentes/asistente-bienvenida/asistente-bienvenida.component.ts
import { Component, OnInit } from '@angular/core';
import { AsistenteService } from '../../../../services/asistentes/asistente.service';
import { WebScrapingService } from '../../../../services/web-scraping-service';

@Component({
  selector: 'app-asistente-bienvenida',
  templateUrl: './asistente-bienvenida.component.html',
  styleUrls: ['./asistente-bienvenida.component.css']
})
export class AsistenteBienvenidaComponent implements OnInit {
  // ... tu código existente ...

  constructor(
    private asistenteService: AsistenteService,
    private webScrapingService: WebScrapingService
  ) {}

  // Método para buscar información web antes de enviar al asistente
  async buscarInformacionWebAntesDeResponder(pregunta: string): Promise<any[]> {
    try {
      // Buscar información web relacionada con la pregunta
      const resultados = await this.webScrapingService
        .searchWebForAssistant(pregunta, 3)
        .toPromise();

      if (resultados?.success && resultados.data.length > 0) {
        console.log('Información web encontrada:', resultados.data);
        return resultados.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error buscando información web:', error);
      return [];
    }
  }

  // Modificar tu método existente de envío de mensajes
  async enviarMensajeConContextoWeb(mensaje: string) {
    try {
      // Buscar información web primero
      const contextoWeb = await this.buscarInformacionWebAntesDeResponder(mensaje);
      
      // Crear mensaje enriquecido con contexto web
      const mensajeEnriquecido = {
        mensaje: mensaje,
        contextoWeb: contextoWeb,
        timestamp: new Date().toISOString(),
        fuente: 'web_scraping'
      };

      // Enviar al asistente con contexto adicional
      const respuesta = await this.asistenteService.enviarMensaje(mensajeEnriquecido);
      
      // Procesar respuesta como lo haces normalmente
      this.procesarRespuesta(respuesta);
      
    } catch (error) {
      console.error('Error enviando mensaje con contexto web:', error);
      // Fallback: enviar mensaje normal sin contexto web
      this.enviarMensajeNormal(mensaje);
    }
  }

  // Método de fallback
  async enviarMensajeNormal(mensaje: string) {
    // Tu lógica existente de envío de mensajes
    const respuesta = await this.asistenteService.enviarMensaje({ mensaje });
    this.procesarRespuesta(respuesta);
  }
}
```

### Paso 4: Agregar Botón de Búsqueda Web en el Template

```html
<!-- src/app/components/asistentes/asistente-bienvenida/asistente-bienvenida.component.html -->
<div class="chat-container">
  <!-- Tu interfaz de chat existente -->
  
  <div class="input-container">
    <input 
      type="text" 
      [(ngModel)]="mensajeUsuario" 
      placeholder="Escribe tu pregunta..."
      (keyup.enter)="enviarMensajeConContextoWeb(mensajeUsuario)"
    >
    
    <!-- Botón para búsqueda web -->
    <button 
      class="web-search-btn"
      (click)="enviarMensajeConContextoWeb(mensajeUsuario)"
      [disabled]="!mensajeUsuario?.trim()"
    >
      🔍 Buscar en Web
    </button>
    
    <!-- Botón normal -->
    <button 
      class="send-btn"
      (click)="enviarMensajeNormal(mensajeUsuario)"
      [disabled]="!mensajeUsuario?.trim()"
    >
      Enviar
    </button>
  </div>
</div>
```

### Paso 5: Agregar Estilos para el Botón de Búsqueda Web

```css
/* src/app/components/asistentes/asistente-bienvenida/asistente-bienvenida.component.css */

.web-search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.web-search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.web-search-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}

/* Indicador de búsqueda web */
.web-search-indicator {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #1976d2;
}

.web-search-indicator::before {
  content: "🌐 ";
  margin-right: 5px;
}
```

### Paso 6: Crear un Componente de Configuración

```typescript
// src/app/components/web-scraping-config/web-scraping-config.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-web-scraping-config',
  template: `
    <div class="config-panel">
      <h3>Configuración de Búsqueda Web</h3>
      
      <div class="config-item">
        <label>
          <input 
            type="checkbox" 
            [(ngModel)]="habilitarBusquedaWeb"
            (change)="guardarConfiguracion()"
          >
          Habilitar búsqueda web automática
        </label>
      </div>
      
      <div class="config-item">
        <label>Número máximo de resultados:</label>
        <input 
          type="number" 
          [(ngModel)]="maxResultados"
          min="1" 
          max="10"
          (change)="guardarConfiguracion()"
        >
      </div>
      
      <div class="config-item">
        <label>Fuentes de búsqueda:</label>
        <div *ngFor="let fuente of fuentesDisponibles">
          <input 
            type="checkbox" 
            [(ngModel)]="fuente.habilitada"
            (change)="guardarConfiguracion()"
          >
          {{ fuente.nombre }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .config-panel {
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .config-item {
      margin: 15px 0;
    }
    
    .config-item label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
    }
    
    .config-item input[type="number"] {
      width: 80px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `]
})
export class WebScrapingConfigComponent {
  habilitarBusquedaWeb = true;
  maxResultados = 5;
  fuentesDisponibles = [
    { nombre: 'Google Search', habilitada: true },
    { nombre: 'Wikipedia', habilitada: true },
    { nombre: 'Noticias', habilitada: false },
    { nombre: 'Documentación técnica', habilitada: true }
  ];

  guardarConfiguracion() {
    const config = {
      habilitarBusquedaWeb: this.habilitarBusquedaWeb,
      maxResultados: this.maxResultados,
      fuentesDisponibles: this.fuentesDisponibles
    };
    
    localStorage.setItem('webScrapingConfig', JSON.stringify(config));
  }

  ngOnInit() {
    const configGuardada = localStorage.getItem('webScrapingConfig');
    if (configGuardada) {
      const config = JSON.parse(configGuardada);
      this.habilitarBusquedaWeb = config.habilitarBusquedaWeb;
      this.maxResultados = config.maxResultados;
      this.fuentesDisponibles = config.fuentesDisponibles;
    }
  }
}
```

### Paso 7: Agregar Rutas (Opcional)

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebScrapingAssistantComponent } from './components/web-scraping-assistant/web-scraping-assistant.component';
import { WebScrapingConfigComponent } from './components/web-scraping-config/web-scraping-config.component';

const routes: Routes = [
  // ... tus rutas existentes ...
  { 
    path: 'web-scraping', 
    component: WebScrapingAssistantComponent 
  },
  { 
    path: 'web-scraping/config', 
    component: WebScrapingConfigComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## 🔧 Configuración de Desarrollo Local

### 1. Ejecutar el Servicio de Scraping Localmente

```bash
# En una terminal
cd scraping-service
npm install
npm run dev
```

### 2. Configurar Proxy en Angular

```javascript
// src/proxy.conf.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/scraping',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api/scraping': '/api'
      }
    })
  );
};
```

### 3. Actualizar angular.json

```json
{
  "projects": {
    "funnel.client": {
      "architect": {
        "serve": {
          "options": {
            "proxyConfig": "src/proxy.conf.js"
          }
        }
      }
    }
  }
}
```

## 🚀 Despliegue a Producción

### 1. Construir la Aplicación Angular

```bash
ng build --configuration production
```

### 2. Desplegar el Servicio de Scraping

```bash
./deploy-aws.sh
```

### 3. Actualizar Variables de Entorno

Asegúrate de que `environment.prod.ts` apunte a tu servicio de scraping desplegado.

## 📊 Monitoreo y Métricas

### 1. Agregar Métricas de Uso

```typescript
// En tu servicio de scraping
export class WebScrapingService {
  private metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0
  };

  scrapeWebsite(request: ScrapingRequest): Observable<ScrapingResponse> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    return this.http.post<ScrapingResponse>(`${this.apiUrl}/scrape`, request)
      .pipe(
        tap(response => {
          const responseTime = Date.now() - startTime;
          this.metrics.successfulRequests++;
          this.updateAverageResponseTime(responseTime);
        }),
        catchError(error => {
          this.metrics.failedRequests++;
          throw error;
        })
      );
  }

  getMetrics() {
    return this.metrics;
  }
}
```

### 2. Dashboard de Métricas

```typescript
// Componente para mostrar métricas
@Component({
  selector: 'app-scraping-metrics',
  template: `
    <div class="metrics-dashboard">
      <h3>Métricas de Web Scraping</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <h4>Total Requests</h4>
          <p>{{ metrics.totalRequests }}</p>
        </div>
        <div class="metric-card">
          <h4>Success Rate</h4>
          <p>{{ getSuccessRate() }}%</p>
        </div>
        <div class="metric-card">
          <h4>Avg Response Time</h4>
          <p>{{ metrics.averageResponseTime }}ms</p>
        </div>
      </div>
    </div>
  `
})
export class ScrapingMetricsComponent {
  metrics = this.webScrapingService.getMetrics();

  getSuccessRate() {
    if (this.metrics.totalRequests === 0) return 0;
    return Math.round((this.metrics.successfulRequests / this.metrics.totalRequests) * 100);
  }
}
```

## 🔒 Consideraciones de Seguridad

### 1. Validación de URLs

```typescript
// En el servicio
private validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Solo permitir HTTP y HTTPS
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}
```

### 2. Rate Limiting en el Frontend

```typescript
// Implementar rate limiting básico
private lastRequestTime = 0;
private readonly MIN_REQUEST_INTERVAL = 2000; // 2 segundos

async scrapeWebsite(request: ScrapingRequest): Promise<ScrapingResponse> {
  const now = Date.now();
  if (now - this.lastRequestTime < this.MIN_REQUEST_INTERVAL) {
    throw new Error('Demasiadas requests. Espera un momento.');
  }
  
  this.lastRequestTime = now;
  return this.http.post<ScrapingResponse>(`${this.apiUrl}/scrape`, request).toPromise();
}
```

## 🎯 Próximos Pasos

1. **Implementar cache** para evitar requests repetidos
2. **Agregar más fuentes** de búsqueda (Bing, DuckDuckGo, etc.)
3. **Implementar análisis de relevancia** de resultados
4. **Agregar soporte para búsquedas en múltiples idiomas**
5. **Crear dashboard de administración** para el servicio

---

Esta integración te permitirá enriquecer las respuestas de tu asistente con información actualizada de la web, mejorando significativamente la calidad y relevancia de las respuestas. 