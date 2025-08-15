import { Component, OnInit } from '@angular/core';
import { WebScrapingService, ScrapingRequest, ScrapingResponse } from './web-scraping-service';
import { AsistenteService } from '../../services/asistentes/asistente.service';

@Component({
  selector: 'app-web-scraping-assistant',
  templateUrl: './web-scraping-assistant.component.html',
  styleUrls: ['./web-scraping-assistant.component.css']
})
export class WebScrapingAssistantComponent implements OnInit {
  searchQuery: string = '';
  isSearching: boolean = false;
  searchResults: any[] = [];
  errorMessage: string = '';
  selectedResults: any[] = [];

  constructor(
    private webScrapingService: WebScrapingService,
    private asistenteService: AsistenteService
  ) {}

  ngOnInit(): void {}

  async searchWeb(): Promise<void> {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Por favor ingresa una consulta de búsqueda';
      return;
    }

    this.isSearching = true;
    this.errorMessage = '';
    this.searchResults = [];

    try {
      const response = await this.webScrapingService.searchWebForAssistant(
        this.searchQuery, 
        10
      ).toPromise();

      if (response?.success) {
        this.searchResults = response.data;
      } else {
        this.errorMessage = response?.error || 'Error al realizar la búsqueda';
      }
    } catch (error) {
      this.errorMessage = 'Error de conexión con el servicio de scraping';
      console.error('Error en búsqueda web:', error);
    } finally {
      this.isSearching = false;
    }
  }

  selectResult(result: any): void {
    const index = this.selectedResults.findIndex(r => r.id === result.id);
    if (index > -1) {
      this.selectedResults.splice(index, 1);
    } else {
      this.selectedResults.push(result);
    }
  }

  async sendToAssistant(): Promise<void> {
    if (this.selectedResults.length === 0) {
      this.errorMessage = 'Selecciona al menos un resultado para enviar al asistente';
      return;
    }

    try {
      // Formatear los resultados para el asistente
      const contextData = this.selectedResults.map(result => ({
        title: result.title,
        content: result.content,
        url: result.url,
        relevance: result.relevance
      }));

      // Enviar al asistente con contexto web
      const assistantMessage = {
        message: `Consulta: ${this.searchQuery}\n\nContexto web encontrado:\n${JSON.stringify(contextData, null, 2)}`,
        context: 'web_search',
        data: contextData
      };

      // Aquí integrarías con tu servicio de asistente existente
      // await this.asistenteService.sendMessage(assistantMessage).toPromise();
      
      console.log('Datos enviados al asistente:', assistantMessage);
      
      // Limpiar selección
      this.selectedResults = [];
      this.searchResults = [];
      this.searchQuery = '';
      
    } catch (error) {
      this.errorMessage = 'Error al enviar datos al asistente';
      console.error('Error enviando al asistente:', error);
    }
  }

  clearResults(): void {
    this.searchResults = [];
    this.selectedResults = [];
    this.searchQuery = '';
    this.errorMessage = '';
  }
} 