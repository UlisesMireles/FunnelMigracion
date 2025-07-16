import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let secureRequest = req;

    // 1. Agregar headers de seguridad
    secureRequest = secureRequest.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });

    // 2. Validar origen de la petición
    if (!this.isValidOrigin(req.url)) {
      console.error('Origen no válido detectado:', req.url);
      return throwError(() => new Error('Origen no autorizado'));
    }

    // 3. Sanitizar datos sensibles en logs
    this.logSecureRequest(req);

    return next.handle(secureRequest).pipe(
      tap(event => {
        // Log exitoso (opcional)
      }),
      catchError((error: HttpErrorResponse) => {
        // 4. Manejo seguro de errores
        this.handleSecurityError(error);
        return throwError(() => error);
      })
    );
  }

  private isValidOrigin(url: string): boolean {
    const allowedOrigins = [
      'https://localhost',
      'https://127.0.0.1',
      'https://tu-dominio-produccion.com',
      // Agrega tus dominios permitidos
    ];

    try {
      const urlObj = new URL(url, window.location.origin);
      return allowedOrigins.some(origin => urlObj.origin.startsWith(origin));
    } catch {
      return false;
    }
  }

  private logSecureRequest(req: HttpRequest<any>): void {
    // NO registrar información sensible
    console.log('HTTP Request:', {
      method: req.method,
      url: this.sanitizeUrl(req.url),
      timestamp: new Date().toISOString()
    });
  }

  private sanitizeUrl(url: string): string {
    // Remover parámetros sensibles de la URL para logs
    try {
      const urlObj = new URL(url, window.location.origin);
      const sensitiveParams = ['token', 'password', 'key', 'secret'];
      
      sensitiveParams.forEach(param => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '***');
        }
      });
      
      return urlObj.toString();
    } catch {
      return url.replace(/([?&])(token|password|key|secret)=[^&]*/gi, '$1$2=***');
    }
  }

  private handleSecurityError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        // Token expirado o no válido
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lastActivity');
        this.router.navigate(['/login']);
        break;
      case 403:
        // Acceso prohibido
        console.error('Acceso denegado');
        this.router.navigate(['/dashboard']);
        break;
      case 429:
        // Rate limiting
        console.error('Demasiadas peticiones');
        break;
      default:
        // Log genérico sin exponer información sensible
        console.error('Error de seguridad:', {
          status: error.status,
          timestamp: new Date().toISOString()
        });
    }
  }
}
