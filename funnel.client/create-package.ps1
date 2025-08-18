# Script para crear paquete ZIP para deploy manual
param(
    [string]$OutputPath = ".\web-scraping-deploy.zip",
    [string]$Version = "1.0.0"
)

Write-Host "Creando paquete de deployment..." -ForegroundColor Green

# Crear directorio temporal
$tempDir = Join-Path $env:TEMP "web-scraping-package-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Crear estructura de carpetas
$serviceDir = Join-Path $tempDir "web-scraping-service"
$scriptsDir = Join-Path $tempDir "scripts"

New-Item -ItemType Directory -Path $serviceDir -Force | Out-Null
New-Item -ItemType Directory -Path $scriptsDir -Force | Out-Null

# Copiar archivos del servicio
Write-Host "Copiando archivos del servicio..." -ForegroundColor Yellow
Copy-Item -Path ".\web-scraping-service\*" -Destination $serviceDir -Recurse -Force -Exclude @("node_modules", "logs", ".env")

# Copiar scripts si existen
if (Test-Path ".\deploy-windows-server.ps1") {
    Copy-Item -Path ".\deploy-windows-server.ps1" -Destination $scriptsDir -Force
}
if (Test-Path ".\monitor-service.ps1") {
    Copy-Item -Path ".\monitor-service.ps1" -Destination $scriptsDir -Force
}

# Crear script de instalación
$installScript = @'
# Script de Instalacion
param(
    [string]$InstallPath = "C:\inetpub\wwwroot\web-scraping",
    [string]$SiteName = "WebScrapingService",
    [int]$Port = 8080
)

Write-Host "Instalando Web Scraping Service..." -ForegroundColor Green

# Verificar Node.js
if (!(Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js no esta instalado" -ForegroundColor Red
    exit 1
}

# Crear directorio
if (!(Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force
}

# Copiar archivos
Copy-Item -Path ".\web-scraping-service\*" -Destination $InstallPath -Recurse -Force

# Instalar dependencias
Set-Location $InstallPath
npm install --production

Write-Host "Instalacion completada!" -ForegroundColor Green
Write-Host "Para completar el setup, ejecuta el script de deploy desde la carpeta scripts/" -ForegroundColor Yellow
'@

$installScript | Out-File -FilePath "$tempDir\INSTALAR.ps1" -Encoding UTF8

# Crear README
$readme = @"
# Web Scraping Service - Paquete de Deployment v$Version

## Instalacion Rapida
1. Extraer este ZIP en el servidor
2. Abrir PowerShell como Administrador
3. Ejecutar: .\INSTALAR.ps1

## Prerrequisitos
- Windows Server con IIS
- Node.js v18+
- PowerShell como Administrador

Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@

$readme | Out-File -FilePath "$tempDir\README.txt" -Encoding UTF8

# Crear el ZIP
Write-Host "Comprimiendo archivos..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir\*" -DestinationPath $OutputPath -Force

# Limpiar
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Paquete creado: $OutputPath" -ForegroundColor Green
$size = [math]::Round((Get-Item $OutputPath).Length / 1MB, 2)
Write-Host "Tamaño: $size MB" -ForegroundColor Cyan
