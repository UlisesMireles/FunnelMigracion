# Script de monitoreo para Web Scraping Service en Windows Server
# PowerShell Script - Guardar como monitor-service.ps1

param(
    [string]$ServiceUrl = "http://localhost:3000",
    [string]$ServiceName = "WebScrapingNodeService",
    [string]$SiteName = "WebScrapingService",
    [string]$LogPath = "C:\inetpub\logs\LogFiles\web-scraping-monitor.log",
    [string]$SlackWebhook = ""  # Opcional: webhook de Slack para notificaciones
)

# Función para logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    Add-Content -Path $LogPath -Value $logEntry
}

# Función para enviar notificación a Slack
function Send-SlackNotification {
    param([string]$Message)
    if ($SlackWebhook) {
        try {
            $payload = @{ text = "🚨 Web Scraping Service Alert: $Message" } | ConvertTo-Json
            Invoke-RestMethod -Uri $SlackWebhook -Method Post -Body $payload -ContentType "application/json"
        } catch {
            Write-Log "Error enviando notificación a Slack: $($_.Exception.Message)" "ERROR"
        }
    }
}

# Health check del servicio
function Test-ServiceHealth {
    try {
        $response = Invoke-WebRequest -Uri "$ServiceUrl/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Service health check passed" "SUCCESS"
            return $true
        } else {
            Write-Log "❌ Service health check failed - HTTP $($response.StatusCode)" "ERROR"
            Send-SlackNotification "Service health check failed - HTTP $($response.StatusCode)"
            return $false
        }
    } catch {
        Write-Log "❌ Service health check failed - $($_.Exception.Message)" "ERROR"
        Send-SlackNotification "Service health check failed - $($_.Exception.Message)"
        return $false
    }
}

# Verificar servicio de Windows
function Test-WindowsService {
    try {
        $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        if ($service) {
            if ($service.Status -eq "Running") {
                Write-Log "✅ Windows service is running" "SUCCESS"
                return $true
            } else {
                Write-Log "⚠️ Windows service is not running - Status: $($service.Status)" "WARNING"
                return $false
            }
        } else {
            Write-Log "❌ Windows service not found" "ERROR"
            return $false
        }
    } catch {
        Write-Log "❌ Error checking Windows service: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Verificar sitio IIS
function Test-IISSite {
    try {
        Import-Module WebAdministration -ErrorAction SilentlyContinue
        $site = Get-Website -Name $SiteName -ErrorAction SilentlyContinue
        if ($site) {
            if ($site.State -eq "Started") {
                Write-Log "✅ IIS site is running" "SUCCESS"
                return $true
            } else {
                Write-Log "⚠️ IIS site is not started - State: $($site.State)" "WARNING"
                return $false
            }
        } else {
            Write-Log "❌ IIS site not found" "ERROR"
            return $false
        }
    } catch {
        Write-Log "❌ Error checking IIS site: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Verificar uso de memoria
function Test-MemoryUsage {
    try {
        $processes = Get-Process -Name "node" -ErrorAction SilentlyContinue
        foreach ($process in $processes) {
            $memoryMB = [math]::Round($process.WorkingSet64 / 1MB, 2)
            if ($memoryMB -gt 1024) {  # Más de 1GB
                Write-Log "⚠️ High memory usage detected: $memoryMB MB (PID: $($process.Id))" "WARNING"
                Send-SlackNotification "High memory usage detected: $memoryMB MB"
            } else {
                Write-Log "📊 Memory usage: $memoryMB MB (PID: $($process.Id))" "INFO"
            }
        }
    } catch {
        Write-Log "❌ Error checking memory usage: $($_.Exception.Message)" "ERROR"
    }
}

# Verificar espacio en disco
function Test-DiskSpace {
    try {
        $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DriveType=3" | Where-Object {$_.DeviceID -eq "C:"}
        $freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 2)
        $totalSpaceGB = [math]::Round($disk.Size / 1GB, 2)
        $freeSpacePercent = [math]::Round(($disk.FreeSpace / $disk.Size) * 100, 2)
        
        if ($freeSpacePercent -lt 10) {
            Write-Log "🚨 Critical disk space: $freeSpaceGB GB ($freeSpacePercent%) free" "CRITICAL"
            Send-SlackNotification "Critical disk space: $freeSpaceGB GB ($freeSpacePercent%) free"
        } elseif ($freeSpacePercent -lt 20) {
            Write-Log "⚠️ Low disk space: $freeSpaceGB GB ($freeSpacePercent%) free" "WARNING"
        } else {
            Write-Log "💾 Disk space OK: $freeSpaceGB GB ($freeSpacePercent%) free" "INFO"
        }
    } catch {
        Write-Log "❌ Error checking disk space: $($_.Exception.Message)" "ERROR"
    }
}

# Reiniciar servicio
function Restart-Service {
    Write-Log "🔄 Attempting to restart service..." "INFO"
    
    try {
        # Reiniciar servicio de Windows si existe
        $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        if ($service) {
            Stop-Service -Name $ServiceName -Force
            Start-Sleep -Seconds 5
            Start-Service -Name $ServiceName
            Write-Log "✅ Windows service restarted" "SUCCESS"
        }
        
        # Reiniciar sitio IIS
        Import-Module WebAdministration -ErrorAction SilentlyContinue
        $site = Get-Website -Name $SiteName -ErrorAction SilentlyContinue
        if ($site) {
            Stop-Website -Name $SiteName
            Start-Sleep -Seconds 3
            Start-Website -Name $SiteName
            Write-Log "✅ IIS site restarted" "SUCCESS"
        }
        
        # Esperar y verificar
        Start-Sleep -Seconds 10
        if (Test-ServiceHealth) {
            Write-Log "✅ Service restart successful" "SUCCESS"
            Send-SlackNotification "Service restarted successfully"
        } else {
            Write-Log "❌ Service restart failed" "ERROR"
            Send-SlackNotification "🚨 Service restart failed - manual intervention required"
        }
        
    } catch {
        Write-Log "❌ Error during service restart: $($_.Exception.Message)" "ERROR"
        Send-SlackNotification "🚨 Service restart failed: $($_.Exception.Message)"
    }
}

# Función principal
function Start-Monitoring {
    Write-Log "🔍 Starting monitoring cycle..." "INFO"
    
    $healthOK = Test-ServiceHealth
    $serviceOK = Test-WindowsService
    $siteOK = Test-IISSite
    
    if (-not $healthOK -and ($serviceOK -or $siteOK)) {
        Write-Log "❌ Health check failed but service is running - attempting restart" "WARNING"
        Restart-Service
    } elseif (-not $serviceOK -and -not $siteOK) {
        Write-Log "❌ Both service and site are down - attempting restart" "ERROR"
        Restart-Service
    }
    
    Test-MemoryUsage
    Test-DiskSpace
    
    Write-Log "✅ Monitoring cycle completed" "INFO"
}

# Ejecutar monitoreo
try {
    # Crear directorio de logs si no existe
    $logDir = Split-Path $LogPath -Parent
    if (!(Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force
    }
    
    Start-Monitoring
    
} catch {
    Write-Log "❌ Critical error in monitoring script: $($_.Exception.Message)" "CRITICAL"
    Send-SlackNotification "🚨 Critical error in monitoring script: $($_.Exception.Message)"
}

# Para programar este script, usar Task Scheduler:
# schtasks /create /tn "WebScrapingMonitor" /tr "powershell.exe -File C:\path\to\monitor-service.ps1" /sc minute /mo 5 /ru SYSTEM
