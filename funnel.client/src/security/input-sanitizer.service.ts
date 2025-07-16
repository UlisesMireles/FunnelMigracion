import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class InputSanitizerService {

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitiza texto para prevenir XSS
   */
  sanitizeText(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/&/g, '&amp;');
  }

  /**
   * Sanitiza HTML permitiendo solo tags seguros
   */
  sanitizeHtml(html: string): SafeHtml {
    // Lista blanca de tags permitidos
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'b', 'i'];
    const allowedAttributes = ['class'];
    
    // Remover scripts y eventos
    let cleanHtml = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '');

    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  /**
   * Valida y sanitiza URLs
   */
  sanitizeUrl(url: string): SafeUrl {
    // Lista blanca de protocolos permitidos
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    
    try {
      const urlObj = new URL(url);
      if (!allowedProtocols.includes(urlObj.protocol)) {
        throw new Error('Protocolo no permitido');
      }
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } catch {
      return this.sanitizer.bypassSecurityTrustUrl('about:blank');
    }
  }

  /**
   * Sanitiza entrada de búsqueda para prevenir SQL injection
   */
  sanitizeSearchInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/['";\\]/g, '') // Remover caracteres peligrosos
      .replace(/--/g, '') // Remover comentarios SQL
      .replace(/\/\*/g, '') // Remover comentarios SQL
      .replace(/\*\//g, '')
      .replace(/xp_/gi, '') // Remover procedimientos extendidos
      .replace(/sp_/gi, '') // Remover procedimientos almacenados
      .trim()
      .substring(0, 100); // Limitar longitud
  }

  /**
   * Valida formato de email
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Valida formato de teléfono
   */
  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Sanitiza nombres de archivo
   */
  sanitizeFileName(fileName: string): string {
    if (!fileName) return '';
    
    return fileName
      .replace(/[<>:"/\\|?*]/g, '') // Caracteres no permitidos en nombres de archivo
      .replace(/\.\./g, '') // Prevenir directory traversal
      .replace(/^\./, '') // Remover punto inicial
      .trim()
      .substring(0, 255); // Limitar longitud
  }

  /**
   * Valida tipos de archivo permitidos
   */
  validateFileType(fileName: string, allowedTypes: string[]): boolean {
    if (!fileName) return false;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  }

  /**
   * Sanitiza parámetros de URL
   */
  sanitizeUrlParams(params: any): any {
    const sanitizedParams: any = {};
    
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        if (typeof value === 'string') {
          sanitizedParams[key] = this.sanitizeText(value);
        } else {
          sanitizedParams[key] = value;
        }
      }
    }
    
    return sanitizedParams;
  }

  /**
   * Valida longitud de campo
   */
  validateFieldLength(value: string, maxLength: number): boolean {
    return value ? value.length <= maxLength : true;
  }

  /**
   * Sanitiza entrada JSON
   */
  sanitizeJsonInput(jsonString: string): any {
    try {
      const parsed = JSON.parse(jsonString);
      return this.sanitizeObject(parsed);
    } catch {
      throw new Error('JSON inválido');
    }
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeText(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  }
}
