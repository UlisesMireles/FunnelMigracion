# Script de Deploy para Servidor Empresarial Windows con IIS
# PowerShell Script

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerPath = "\\tu-servidor\inetpub\wwwroot\web-scraping",
    
    [Parameter(Mandatory=$false)]
    [string]$SiteName = "WebScrapingService",
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 8080,
    
    [Parameter(Mandatory=$false)]
    [string]$DeployMethod = "iisnode"  # "iisnode" o "proxy"
)

Write-Host "🚀 Iniciando deploy del servicio de Web Scraping" -ForegroundColor Green

# Verificar que Node.js esté instalado
if (!(Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado. Descárgalo de https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar versión de Node.js
$nodeVersion = node --version
Write-Host "📋 Versión de Node.js: $nodeVersion" -ForegroundColor Yellow

# Crear directorio de destino si no existe
if (!(Test-Path $ServerPath)) {
    Write-Host "📁 Creando directorio: $ServerPath" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $ServerPath -Force
}

# Copiar archivos del servicio
Write-Host "📦 Copiando archivos del servicio..." -ForegroundColor Yellow
$sourcePath = ".\web-scraping-service\*"
Copy-Item -Path $sourcePath -Destination $ServerPath -Recurse -Force

# Instalar dependencias en el servidor
Write-Host "⬇️ Instalando dependencias en el servidor..." -ForegroundColor Yellow
Push-Location $ServerPath
npm install --production
Pop-Location

if ($DeployMethod -eq "iisnode") {
    # Método 1: Usar IISNode
    Write-Host "🔧 Configurando con IISNode..." -ForegroundColor Yellow
    
    # Verificar si IISNode está instalado
    $iisNodePath = "${env:ProgramFiles}\iisnode"
    if (!(Test-Path $iisNodePath)) {
        Write-Host "❌ IISNode no está instalado. Descárgalo de https://github.com/Azure/iisnode" -ForegroundColor Red
        Write-Host "💡 O usa el método 'proxy' en su lugar" -ForegroundColor Yellow
        exit 1
    }
    
    # Configurar sitio en IIS
    Import-Module WebAdministration
    
    # Crear Application Pool
    $appPoolName = "$SiteName-AppPool"
    if (Get-IISAppPool -Name $appPoolName -ErrorAction SilentlyContinue) {
        Remove-WebAppPool -Name $appPoolName
    }
    New-WebAppPool -Name $appPoolName
    Set-ItemProperty -Path "IIS:\AppPools\$appPoolName" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
    Set-ItemProperty -Path "IIS:\AppPools\$appPoolName" -Name "processModel.loadUserProfile" -Value $true
    Set-ItemProperty -Path "IIS:\AppPools\$appPoolName" -Name "processModel.maxProcesses" -Value 1
    
    # Crear sitio web
    if (Get-Website -Name $SiteName -ErrorAction SilentlyContinue) {
        Remove-Website -Name $SiteName
    }
    New-Website -Name $SiteName -Port $Port -PhysicalPath $ServerPath -ApplicationPool $appPoolName
    
    Write-Host "✅ Sitio configurado con IISNode en puerto $Port" -ForegroundColor Green
    
} else {
    # Método 2: Proxy Reverso
    Write-Host "🔧 Configurando con Proxy Reverso..." -ForegroundColor Yellow
    
    # Crear servicio de Windows para Node.js
    $serviceName = "WebScrapingNodeService"
    $serviceExists = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    
    if ($serviceExists) {
        Write-Host "🛑 Deteniendo servicio existente..." -ForegroundColor Yellow
        Stop-Service -Name $serviceName -Force
        & sc.exe delete $serviceName
        Start-Sleep -Seconds 3
    }
    
    # Crear nuevo servicio
    Write-Host "🔧 Creando servicio de Windows..." -ForegroundColor Yellow
    $nodeExe = (Get-Command node).Source
    $serverJs = Join-Path $ServerPath "server.js"
    
    & sc.exe create $serviceName binPath= "`"$nodeExe`" `"$serverJs`"" start= auto
    & sc.exe description $serviceName "Web Scraping Service - Node.js Backend"
    
    # Iniciar servicio
    Start-Service -Name $serviceName
    Write-Host "✅ Servicio de Node.js iniciado" -ForegroundColor Green
    
    # Configurar sitio proxy en IIS
    $proxyPath = "$ServerPath-proxy"
    if (!(Test-Path $proxyPath)) {
        New-Item -ItemType Directory -Path $proxyPath -Force
    }
    
    # Copiar web.config del proxy
    Copy-Item -Path ".\web-scraping-iis-proxy\web.config" -Destination $proxyPath -Force
    
    # Configurar sitio en IIS
    Import-Module WebAdministration
    
    $appPoolName = "$SiteName-Proxy-AppPool"
    if (Get-IISAppPool -Name $appPoolName -ErrorAction SilentlyContinue) {
        Remove-WebAppPool -Name $appPoolName
    }
    New-WebAppPool -Name $appPoolName
    
    if (Get-Website -Name $SiteName -ErrorAction SilentlyContinue) {
        Remove-Website -Name $SiteName
    }
    New-Website -Name $SiteName -Port $Port -PhysicalPath $proxyPath -ApplicationPool $appPoolName
    
    Write-Host "✅ Proxy reverso configurado en puerto $Port" -ForegroundColor Green
}

# Verificar que el sitio esté funcionando
Write-Host "🔍 Verificando el sitio..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://localhost:$Port/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Sitio funcionando correctamente!" -ForegroundColor Green
        Write-Host "🌐 URL: http://localhost:$Port" -ForegroundColor Cyan
        Write-Host "🔍 Health Check: http://localhost:$Port/health" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️ No se pudo verificar el sitio. Verifica manualmente." -ForegroundColor Yellow
    Write-Host "🌐 URL: http://localhost:$Port" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 INSTRUCCIONES POST-DEPLOY:" -ForegroundColor Cyan
Write-Host "1. Verificar que el sitio funcione en http://localhost:$Port" -ForegroundColor White
Write-Host "2. Configurar firewall para permitir el puerto $Port" -ForegroundColor White
Write-Host "3. Configurar SSL/TLS si es necesario" -ForegroundColor White
Write-Host "4. Actualizar DNS para apuntar al servidor" -ForegroundColor White
Write-Host "5. Configurar monitoreo y logs" -ForegroundColor White

if ($DeployMethod -eq "proxy") {
    Write-Host ""
    Write-Host "📋 COMANDOS ÚTILES PARA EL SERVICIO:" -ForegroundColor Cyan
    Write-Host "- Reiniciar: Restart-Service -Name WebScrapingNodeService" -ForegroundColor White
    Write-Host "- Estado: Get-Service -Name WebScrapingNodeService" -ForegroundColor White
    Write-Host "- Logs: Get-EventLog -LogName Application -Source WebScrapingNodeService" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 Deploy completado!" -ForegroundColor Green
