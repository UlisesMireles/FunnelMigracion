import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ScrapingRequest {
  url: string;
  selectors?: string[];
  keywords?: string[];
  maxResults?: number;
  includeImages?: boolean;
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

@Injectable({
  providedIn: 'root'
})
export class WebScrapingService {
  private readonly apiUrl = environment.apiUrl + '/scraping';
  
  constructor(private http: HttpClient) {}

  // Método principal para realizar scraping
  scrapeWebsite(request: ScrapingRequest): Observable<ScrapingResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ScrapingResponse>(`${this.apiUrl}/scrape`, request, { headers });
  }

  // Método para búsquedas web que complementen al asistente
  searchWebForAssistant(query: string, maxResults: number = 5): Observable<ScrapingResponse> {
    const request: ScrapingRequest = {
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      keywords: [query],
      maxResults,
      includeImages: false
    };

    return this.scrapeWebsite(request);
  }

  // Método para obtener información específica de una página
  getPageInfo(url: string, selectors: string[] = []): Observable<ScrapingResponse> {
    const request: ScrapingRequest = {
      url,
      selectors,
      maxResults: 10
    };

    return this.scrapeWebsite(request);
  }

  // Método para validar si una URL es accesible
  validateUrl(url: string): Observable<{ valid: boolean; error?: string }> {
    return this.http.post<{ valid: boolean; error?: string }>(`${this.apiUrl}/validate`, { url });
  }
} 