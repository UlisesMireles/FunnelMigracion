import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OportunidadesService } from '../../../../services/oportunidades.service';
import { Estancamiento } from '../../../../interfaces/oportunidades';
@Component({
  selector: 'app-modal-estancamiento',
  standalone: false,
  templateUrl: './modal-estancamiento.component.html',
  styleUrls: ['./modal-estancamiento.component.css']
})
export class ModalEstancamientoComponent implements OnInit {
  estancamientos: Estancamiento[] = [];
  loading: boolean = true;
  error: string = '';
  maximized: boolean = false;
  @Input() visible: boolean = false; 
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  constructor(private oportunidadesService: OportunidadesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarEstancamientos();
  }

  cargarEstancamientos(): void {
    this.loading = true;
    this.error = '';

    this.oportunidadesService.consultarEstancamiento().subscribe({
      next: (data: Estancamiento[]) => {
        this.estancamientos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos de estancamiento';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }
  
    onDialogShow() {
    this.maximized = false;
    this.cdr.detectChanges();
  }
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }
}

