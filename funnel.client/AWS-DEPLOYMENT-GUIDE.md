# Guía de Deployment en AWS ECS

## 📋 Prerrequisitos
1. AWS CLI instalado y configurado
2. Docker instalado
3. Permisos de IAM para ECS, ECR, CloudWatch

## 🚀 Deploy Automático
```bash
# Ejecutar el script de deploy
chmod +x deploy-aws.sh
./deploy-aws.sh
```

## 🔧 Configuración Manual

### 1. Actualizar Task Definition
Edita `ecs-task-definition.json`:
- Reemplaza `YOUR_ACCOUNT_ID` con tu Account ID real
- Reemplaza `YOUR_ECR_REPOSITORY_URL` con la URL real

### 2. Crear IAM Roles
```bash
# Crear execution role
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://ecs-trust-policy.json

# Adjuntar política
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### 3. Crear ECS Cluster
```bash
aws ecs create-cluster --cluster-name web-scraping-cluster --capacity-providers FARGATE --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
```

### 4. Deploy
```bash
# Construir y subir imagen
docker build -t web-scraping-service ./web-scraping-service
docker tag web-scraping-service:latest YOUR_ECR_URL:latest
docker push YOUR_ECR_URL:latest

# Registrar task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Crear servicio
aws ecs create-service --cluster web-scraping-cluster --service-name web-scraping-service --task-definition web-scraping-service --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

## 🌐 URL Final
- La URL será: `http://your-load-balancer-dns:3000`
- Para HTTPS necesitarás configurar ALB + Certificate Manager

## 💰 Costo Estimado
- **Fargate:** ~$30-50/mes para 1 instancia
- **ECR:** ~$1/mes para imágenes
- **CloudWatch:** ~$5-10/mes para logs
