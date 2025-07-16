import { Injectable } from '@angular/core';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class RateLimitService {
  private requests = new Map<string, RateLimitEntry>();
  private readonly defaultLimit = 100; // Peticiones por ventana
  private readonly defaultWindow = 60 * 1000; // 1 minuto en millisegundos

  /**
   * Verifica si una acción está permitida según el rate limiting
   */
  isAllowed(
    identifier: string, 
    limit: number = this.defaultLimit,
    windowMs: number = this.defaultWindow
  ): boolean {
    const now = Date.now();
    const key = `${identifier}:${limit}:${windowMs}`;
    
    // Limpiar entradas expiradas
    this.cleanup();
    
    const entry = this.requests.get(key);
    
    if (!entry) {
      // Primera petición
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (now > entry.resetTime) {
      // Ventana expirada, resetear
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (entry.count >= limit) {
      // Límite alcanzado
      return false;
    }
    
    // Incrementar contador
    entry.count++;
    return true;
  }

  /**
   * Obtiene información del rate limit para un identificador
   */
  getRateLimitInfo(
    identifier: string,
    limit: number = this.defaultLimit,
    windowMs: number = this.defaultWindow
  ): { remaining: number; resetTime: number; allowed: boolean } {
    const now = Date.now();
    const key = `${identifier}:${limit}:${windowMs}`;
    const entry = this.requests.get(key);
    
    if (!entry || now > entry.resetTime) {
      return {
        remaining: limit - 1,
        resetTime: now + windowMs,
        allowed: true
      };
    }
    
    return {
      remaining: Math.max(0, limit - entry.count),
      resetTime: entry.resetTime,
      allowed: entry.count < limit
    };
  }

  /**
   * Rate limiting específico para intentos de login
   */
  checkLoginAttempts(
    identifier: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000 // 15 minutos
  ): boolean {
    return this.isAllowed(`login:${identifier}`, maxAttempts, windowMs);
  }

  /**
   * Rate limiting para peticiones de API
   */
  checkApiRequests(
    endpoint: string,
    userId?: string,
    limit: number = 60,
    windowMs: number = 60 * 1000 // 1 minuto
  ): boolean {
    const identifier = userId ? `api:${endpoint}:${userId}` : `api:${endpoint}`;
    return this.isAllowed(identifier, limit, windowMs);
  }

  /**
   * Rate limiting para subida de archivos
   */
  checkFileUpload(
    userId: string,
    maxUploads: number = 10,
    windowMs: number = 60 * 60 * 1000 // 1 hora
  ): boolean {
    return this.isAllowed(`upload:${userId}`, maxUploads, windowMs);
  }

  /**
   * Limpia entradas expiradas del mapa
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Limpia todos los rate limits para un identificador específico
   */
  clearRateLimit(identifier: string): void {
    for (const key of this.requests.keys()) {
      if (key.includes(identifier)) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Obtiene estadísticas de uso
   */
  getStats(): { totalEntries: number; activeEntries: number } {
    this.cleanup();
    return {
      totalEntries: this.requests.size,
      activeEntries: this.requests.size
    };
  }
}
