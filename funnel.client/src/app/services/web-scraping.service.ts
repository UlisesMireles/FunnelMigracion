import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ScrapingRequest {
  url: string;
  selectors?: string[];
  keywords?: string[];
  maxResults?: number;
  includeImages?: boolean;
  searchQuery?: string;
}

export interface ScrapingResponse {
  success: boolean;
  data: any[];
  metadata: {
    url: string;
    timestamp: string;
    processingTime: number;
  };
  error?: string;
}

export interface WebSearchRequest {
  query: string;
  maxResults?: number;
  includeImages?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WebScrapingService {
  private readonly apiUrl = environment.webScrapingUrl;

  // Headers HTTP mejorados para CORS
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }),
      // Incluir credentials para CORS si es necesario
      withCredentials: false
    };
  }

  constructor(private http: HttpClient) {
    console.log('🔗 WebScrapingService inicializado con URL:', this.apiUrl);
  }

  // Método para verificar conectividad y CORS
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cors-test`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('❌ Error de conexión o CORS:', error);
          return throwError(() => error);
        })
      );
  }

  // Health check del servidor
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`, this.getHttpOptions());
  }

  // Método general para scraping
  scrapeWebsite(request: ScrapingRequest): Observable<ScrapingResponse> {
    return this.http.post<ScrapingResponse>(`${this.apiUrl}/scrape`, request, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('❌ Error en scrapeWebsite:', error);
          return throwError(() => error);
        })
      );
  }

  // Método específico para búsquedas web para el asistente
  searchWebForAssistant(request: WebSearchRequest): Observable<ScrapingResponse> {
    return this.http.post<ScrapingResponse>(`${this.apiUrl}/search-for-assistant`, request, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('❌ Error en searchWebForAssistant:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener información específica de una página
  getPageInfo(url: string, selectors?: string[]): Observable<ScrapingResponse> {
    const request: ScrapingRequest = {
      url,
      selectors,
      includeImages: false
    };

    return this.scrapeWebsite(request);
  }

  // Validar si una URL es accesible
  validateUrl(url: string): Observable<{ valid: boolean; error?: string }> {
    return this.http.post<{ valid: boolean; error?: string }>(`${this.apiUrl}/validate-url`, { url });
  }

  // Búsqueda inteligente que combina múltiples fuentes
  intelligentSearch(query: string, maxResults: number = 5): Observable<ScrapingResponse> {
    const request: WebSearchRequest = {
      query,
      maxResults,
      includeImages: false
    };

    return this.searchWebForAssistant(request);
  }
} 