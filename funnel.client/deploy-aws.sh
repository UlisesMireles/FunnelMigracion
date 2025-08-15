#!/bin/bash

# Script de despliegue para AWS ECS
# Configuración
AWS_REGION="us-east-1"
ECR_REPOSITORY_NAME="web-scraping-service"
ECS_CLUSTER_NAME="web-scraping-cluster"
ECS_SERVICE_NAME="web-scraping-service"
TASK_DEFINITION_NAME="web-scraping-service"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando despliegue del servicio de Web Scraping en AWS ECS${NC}"

# Verificar que AWS CLI esté configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ Error: AWS CLI no está configurado. Ejecuta 'aws configure' primero.${NC}"
    exit 1
fi

# Obtener Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${YELLOW}📋 Account ID: ${ACCOUNT_ID}${NC}"

# 1. Crear repositorio ECR si no existe
echo -e "${YELLOW}📦 Verificando repositorio ECR...${NC}"
if ! aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION &> /dev/null; then
    echo -e "${YELLOW}📦 Creando repositorio ECR...${NC}"
    aws ecr create-repository --repository-name $ECR_REPOSITORY_NAME --region $AWS_REGION
fi

ECR_REPOSITORY_URI=$(aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)
echo -e "${GREEN}✅ Repositorio ECR: ${ECR_REPOSITORY_URI}${NC}"

# 2. Autenticarse con ECR
echo -e "${YELLOW}🔐 Autenticando con ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI

# 3. Construir imagen Docker
echo -e "${YELLOW}🔨 Construyendo imagen Docker...${NC}"
cd scraping-service
docker build -t $ECR_REPOSITORY_NAME .
docker tag $ECR_REPOSITORY_NAME:latest $ECR_REPOSITORY_URI:latest

# 4. Subir imagen a ECR
echo -e "${YELLOW}⬆️ Subiendo imagen a ECR...${NC}"
docker push $ECR_REPOSITORY_URI:latest

# 5. Crear cluster ECS si no existe
echo -e "${YELLOW}🏗️ Verificando cluster ECS...${NC}"
if ! aws ecs describe-clusters --clusters $ECS_CLUSTER_NAME --region $AWS_REGION --query 'clusters[0].status' --output text &> /dev/null; then
    echo -e "${YELLOW}🏗️ Creando cluster ECS...${NC}"
    aws ecs create-cluster --cluster-name $ECS_CLUSTER_NAME --region $AWS_REGION
fi

# 6. Actualizar task definition
echo -e "${YELLOW}📝 Actualizando task definition...${NC}"
sed -i "s/YOUR_ACCOUNT_ID/$ACCOUNT_ID/g" ../ecs-task-definition.json
sed -i "s|YOUR_ECR_REPOSITORY_URL|$ECR_REPOSITORY_URI|g" ../ecs-task-definition.json

aws ecs register-task-definition --cli-input-json file://../ecs-task-definition.json --region $AWS_REGION

# 7. Crear o actualizar servicio ECS
echo -e "${YELLOW}🔄 Verificando servicio ECS...${NC}"
if aws ecs describe-services --cluster $ECS_CLUSTER_NAME --services $ECS_SERVICE_NAME --region $AWS_REGION --query 'services[0].status' --output text &> /dev/null; then
    echo -e "${YELLOW}🔄 Actualizando servicio ECS...${NC}"
    aws ecs update-service --cluster $ECS_CLUSTER_NAME --service $ECS_SERVICE_NAME --task-definition $TASK_DEFINITION_NAME --region $AWS_REGION
else
    echo -e "${YELLOW}🆕 Creando servicio ECS...${NC}"
    # Crear Application Load Balancer si no existe
    ALB_NAME="web-scraping-alb"
    if ! aws elbv2 describe-load-balancers --names $ALB_NAME --region $AWS_REGION &> /dev/null; then
        echo -e "${YELLOW}🌐 Creando Application Load Balancer...${NC}"
        # Crear VPC y subnets si no existen (simplificado)
        VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query 'Vpcs[0].VpcId' --output text)
        SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0:2].SubnetId' --output text | tr '\t' ',')
        
        # Crear ALB
        ALB_ARN=$(aws elbv2 create-load-balancer \
            --name $ALB_NAME \
            --subnets $SUBNET_IDS \
            --security-groups sg-0123456789abcdef0 \
            --region $AWS_REGION \
            --query 'LoadBalancers[0].LoadBalancerArn' --output text)
    else
        ALB_ARN=$(aws elbv2 describe-load-balancers --names $ALB_NAME --region $AWS_REGION --query 'LoadBalancers[0].LoadBalancerArn' --output text)
    fi
    
    # Crear target group
    TG_NAME="web-scraping-tg"
    TG_ARN=$(aws elbv2 create-target-group \
        --name $TG_NAME \
        --protocol HTTP \
        --port 3000 \
        --vpc-id $VPC_ID \
        --target-type ip \
        --region $AWS_REGION \
        --query 'TargetGroups[0].TargetGroupArn' --output text)
    
    # Crear listener
    aws elbv2 create-listener \
        --load-balancer-arn $ALB_ARN \
        --protocol HTTP \
        --port 80 \
        --default-actions Type=forward,TargetGroupArn=$TG_ARN \
        --region $AWS_REGION
    
    # Crear servicio ECS
    aws ecs create-service \
        --cluster $ECS_CLUSTER_NAME \
        --service-name $ECS_SERVICE_NAME \
        --task-definition $TASK_DEFINITION_NAME \
        --desired-count 2 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=$SUBNET_IDS,securityGroups=[sg-0123456789abcdef0],assignPublicIp=ENABLED}" \
        --load-balancers "targetGroupArn=$TG_ARN,containerName=web-scraping-container,containerPort=3000" \
        --region $AWS_REGION
fi

# 8. Esperar a que el servicio esté estable
echo -e "${YELLOW}⏳ Esperando a que el servicio esté estable...${NC}"
aws ecs wait services-stable --cluster $ECS_CLUSTER_NAME --services $ECS_SERVICE_NAME --region $AWS_REGION

# 9. Obtener URL del servicio
echo -e "${YELLOW}🌐 Obteniendo URL del servicio...${NC}"
if aws elbv2 describe-load-balancers --names $ALB_NAME --region $AWS_REGION &> /dev/null; then
    SERVICE_URL=$(aws elbv2 describe-load-balancers --names $ALB_NAME --region $AWS_REGION --query 'LoadBalancers[0].DNSName' --output text)
    echo -e "${GREEN}✅ Servicio desplegado exitosamente!${NC}"
    echo -e "${GREEN}🌐 URL del servicio: http://${SERVICE_URL}${NC}"
    echo -e "${GREEN}🔍 Health check: http://${SERVICE_URL}/health${NC}"
else
    echo -e "${GREEN}✅ Servicio desplegado exitosamente!${NC}"
    echo -e "${YELLOW}⚠️ No se pudo obtener la URL del ALB. Verifica manualmente en la consola de AWS.${NC}"
fi

# 10. Mostrar logs del servicio
echo -e "${YELLOW}📋 Para ver los logs del servicio:${NC}"
echo -e "${YELLOW}aws logs tail /ecs/web-scraping-service --follow --region $AWS_REGION${NC}"

echo -e "${GREEN}🎉 Despliegue completado!${NC}" 