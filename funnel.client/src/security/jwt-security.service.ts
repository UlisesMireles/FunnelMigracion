import { Injectable } from '@angular/core';

interface JWTHeader {
  alg: string;
  typ: string;
}

interface JWTPayload {
  sub?: string;
  iss?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class JwtSecurityService {

  /**
   * Decodifica un token JWT sin validar la firma
   */
  decodeToken(token: string): { header: JWTHeader; payload: JWTPayload } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const header = JSON.parse(this.base64UrlDecode(parts[0]));
      const payload = JSON.parse(this.base64UrlDecode(parts[1]));

      return { header, payload };
    } catch {
      return null;
    }
  }

  /**
   * Valida la estructura y claims básicos del token
   */
  validateTokenStructure(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    const { header, payload } = decoded;

    // Validar header
    if (!header.alg || !header.typ || header.typ !== 'JWT') {
      return false;
    }

    // Validar algoritmo permitido
    const allowedAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'];
    if (!allowedAlgorithms.includes(header.alg)) {
      return false;
    }

    // Validar claims obligatorios
    if (!payload.sub || !payload.iat || !payload.exp) {
      return false;
    }

    return true;
  }

  /**
   * Verifica si el token ha expirado
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.payload.exp;

    if (!exp) return true;

    return now >= exp;
  }

  /**
   * Verifica si el token es válido para usar (nbf claim)
   */
  isTokenValidForUse(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    const now = Math.floor(Date.now() / 1000);
    const nbf = decoded.payload.nbf;

    if (nbf && now < nbf) {
      return false;
    }

    return true;
  }

  /**
   * Obtiene el tiempo restante hasta la expiración en segundos
   */
  getTimeUntilExpiration(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded) return 0;

    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.payload.exp;

    if (!exp) return 0;

    return Math.max(0, exp - now);
  }

  /**
   * Valida el issuer del token
   */
  validateIssuer(token: string, expectedIssuer: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    return decoded.payload.iss === expectedIssuer;
  }

  /**
   * Valida la audiencia del token
   */
  validateAudience(token: string, expectedAudience: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    const aud = decoded.payload.aud;
    if (!aud) return false;

    if (Array.isArray(aud)) {
      return aud.includes(expectedAudience);
    }

    return aud === expectedAudience;
  }

  /**
   * Obtiene información del usuario desde el token
   */
  getUserInfo(token: string): any {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    const { payload } = decoded;
    
    // Extraer información común del usuario
    return {
      userId: payload.sub,
      username: payload['username'] || payload['name'],
      email: payload['email'],
      roles: payload['roles'] || [],
      permissions: payload['permissions'] || [],
      issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null
    };
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(token: string, requiredRole: string): boolean {
    const userInfo = this.getUserInfo(token);
    if (!userInfo || !userInfo.roles) return false;

    return userInfo.roles.includes(requiredRole);
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  hasPermission(token: string, requiredPermission: string): boolean {
    const userInfo = this.getUserInfo(token);
    if (!userInfo || !userInfo.permissions) return false;

    return userInfo.permissions.includes(requiredPermission);
  }

  /**
   * Realiza una validación completa del token
   */
  validateToken(
    token: string,
    expectedIssuer?: string,
    expectedAudience?: string
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar estructura
    if (!this.validateTokenStructure(token)) {
      errors.push('Estructura del token inválida');
    }

    // Validar expiración
    if (this.isTokenExpired(token)) {
      errors.push('Token expirado');
    }

    // Validar fecha de inicio
    if (!this.isTokenValidForUse(token)) {
      errors.push('Token no válido aún');
    }

    // Validar issuer si se proporciona
    if (expectedIssuer && !this.validateIssuer(token, expectedIssuer)) {
      errors.push('Emisor del token inválido');
    }

    // Validar audiencia si se proporciona
    if (expectedAudience && !this.validateAudience(token, expectedAudience)) {
      errors.push('Audiencia del token inválida');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Limpia el token del localStorage de forma segura
   */
  clearToken(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('lastActivity');
    
    // Limpiar cualquier dato en sessionStorage también
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }

  /**
   * Decodifica base64URL
   */
  private base64UrlDecode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Base64URL inválido');
    }
    
    return decodeURIComponent(
      atob(output)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }
}
