# Módulo de Web Scraping para Asistente AI

Este módulo proporciona capacidades de web scraping para complementar las respuestas de tu asistente de OpenAI, permitiendo búsquedas en tiempo real en la web.

## 🏗️ Arquitectura

### Opción 1: AWS ECS con Fargate (Recomendada)
- **Escalabilidad**: Auto-scaling basado en demanda
- **Costo**: Solo pagas por lo que usas
- **Mantenimiento**: AWS maneja la infraestructura
- **Seguridad**: Integración con IAM, VPC, y Secrets Manager

### Opción 2: Alternativas
- **Vercel Functions**: Para cargas ligeras
- **Google Cloud Run**: Similar a ECS pero en GCP
- **Azure Container Instances**: Para usuarios de Azure
- **Heroku**: Para desarrollo rápido

## 📁 Estructura del Proyecto

```
web-scraping-module/
├── src/app/
│   ├── services/
│   │   └── web-scraping-service.ts          # Servicio Angular
│   └── components/
│       ├── web-scraping-assistant/
│       │   ├── web-scraping-assistant.component.ts
│       │   ├── web-scraping-assistant.component.html
│       │   └── web-scraping-assistant.component.css
├── scraping-service/                        # Backend Node.js
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── aws-config/
│   ├── ecs-task-definition.json
│   └── deploy-aws.sh
└── README-web-scraping.md
```

## 🚀 Implementación

### 1. Configuración del Frontend (Angular)

#### Paso 1: Agregar el servicio a tu aplicación

```typescript
// En tu app.module.ts
import { WebScrapingService } from './services/web-scraping-service';

@NgModule({
  providers: [
    WebScrapingService,
    // ... otros servicios
  ]
})
```

#### Paso 2: Integrar con tu asistente existente

```typescript
// En tu componente de asistente
import { WebScrapingService } from '../../services/web-scraping-service';

export class TuAsistenteComponent {
  constructor(
    private webScrapingService: WebScrapingService,
    private asistenteService: AsistenteService
  ) {}

  async buscarInformacionWeb(query: string) {
    try {
      const resultados = await this.webScrapingService
        .searchWebForAssistant(query, 5)
        .toPromise();
      
      // Enviar al asistente con contexto web
      const mensajeConContexto = {
        mensaje: query,
        contextoWeb: resultados.data,
        timestamp: new Date().toISOString()
      };
      
      await this.asistenteService.enviarMensaje(mensajeConContexto);
    } catch (error) {
      console.error('Error en búsqueda web:', error);
    }
  }
}
```

### 2. Despliegue en AWS ECS

#### Prerrequisitos
- AWS CLI configurado
- Docker instalado
- Permisos de AWS para ECS, ECR, IAM

#### Paso 1: Configurar variables de entorno

```bash
# En tu environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  scrapingApiUrl: 'http://localhost:3000/api'
};

# En environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-api.com',
  scrapingApiUrl: 'https://tu-scraping-service.aws.com'
};
```

#### Paso 2: Ejecutar el script de despliegue

```bash
# Dar permisos de ejecución
chmod +x deploy-aws.sh

# Ejecutar despliegue
./deploy-aws.sh
```

#### Paso 3: Configurar Secrets Manager

```bash
# Crear secret para OpenAI API Key
aws secretsmanager create-secret \
  --name "openai-api-key" \
  --description "OpenAI API Key para el servicio de scraping" \
  --secret-string "tu-openai-api-key-aqui" \
  --region us-east-1
```

### 3. Configuración de Seguridad

#### IAM Roles

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:*:secret:openai-api-key*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

#### Security Groups

```bash
# Crear security group para el servicio
aws ec2 create-security-group \
  --group-name web-scraping-sg \
  --description "Security group para servicio de scraping" \
  --vpc-id vpc-xxxxxxxxx

# Permitir tráfico HTTP
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0
```

## 🔧 Configuración Avanzada

### Rate Limiting
El servicio incluye rate limiting configurable:

```javascript
// En server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas requests desde esta IP'
});
```

### Pool de Navegadores
Para mejor rendimiento, el servicio mantiene un pool de navegadores:

```javascript
const MAX_BROWSERS = 5; // Configurable según necesidades
```

### Filtros de Contenido
Puedes configurar filtros personalizados:

```typescript
const request: ScrapingRequest = {
  url: 'https://ejemplo.com',
  selectors: ['.contenido-principal', '.articulo'],
  keywords: ['tecnología', 'innovación'],
  maxResults: 10,
  includeImages: false
};
```

## 📊 Monitoreo y Logs

### CloudWatch Logs
```bash
# Ver logs en tiempo real
aws logs tail /ecs/web-scraping-service --follow --region us-east-1

# Filtrar por errores
aws logs filter-log-events \
  --log-group-name /ecs/web-scraping-service \
  --filter-pattern "ERROR" \
  --region us-east-1
```

### Métricas Personalizadas
```javascript
// En server.js
const metrics = {
  requestsPerMinute: 0,
  averageResponseTime: 0,
  errorRate: 0
};

// Enviar métricas a CloudWatch
const cloudwatch = new AWS.CloudWatch();
```

## 🧪 Testing

### Tests Unitarios
```bash
cd scraping-service
npm test
```

### Tests de Integración
```bash
# Test del endpoint de scraping
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://ejemplo.com",
    "keywords": ["test"],
    "maxResults": 5
  }'
```

### Tests de Carga
```bash
# Usando Artillery
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:3000/health
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy Web Scraping Service
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy to ECS
        run: ./deploy-aws.sh
```

## 💰 Estimación de Costos (AWS)

### ECS Fargate
- **CPU**: 1 vCPU = ~$0.04048/hora
- **Memoria**: 2GB = ~$0.004445/hora
- **Total por instancia**: ~$0.044925/hora
- **Mensual (2 instancias)**: ~$65

### Application Load Balancer
- **Por hora**: ~$0.0225/hora
- **Mensual**: ~$16

### ECR
- **Almacenamiento**: ~$0.10/GB/mes
- **Transferencia**: ~$0.09/GB

### **Total estimado**: ~$85-100/mes

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de permisos ECR**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URI
   ```

2. **Servicio no responde**
   ```bash
   # Verificar logs
   aws logs tail /ecs/web-scraping-service --follow
   
   # Verificar health check
   curl http://tu-alb-url/health
   ```

3. **Timeout en scraping**
   ```javascript
   // Aumentar timeout en server.js
   await page.setDefaultNavigationTimeout(60000); // 60 segundos
   ```

4. **Error de memoria**
   ```json
   // En ecs-task-definition.json
   "memory": "4096" // Aumentar a 4GB
   ```

## 🔮 Próximas Mejoras

- [ ] Integración con Redis para cache
- [ ] Soporte para múltiples motores de búsqueda
- [ ] Extracción de imágenes y archivos
- [ ] Análisis de sentimientos del contenido
- [ ] Integración con Elasticsearch
- [ ] Dashboard de métricas en tiempo real

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación:

1. Revisa los logs de CloudWatch
2. Verifica la configuración de IAM
3. Consulta la documentación de AWS ECS
4. Abre un issue en el repositorio

---

**Nota**: Este módulo está diseñado para complementar tu asistente existente. Asegúrate de cumplir con los términos de servicio de los sitios web que vas a scrapear y respetar los robots.txt. 