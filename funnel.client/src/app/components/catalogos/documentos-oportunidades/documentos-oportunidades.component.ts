import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef} from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { Archivos, Oportunidad } from '../../../interfaces/oportunidades';
import { OportunidadesService } from '../../../services/oportunidades.service';
import { RequestOportunidad } from '../../../interfaces/oportunidades';
import { LoginService } from '../../../services/login.service';
import { DocumentoService } from '../../../services/documento.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { get } from 'lodash-es';



@Component({
  selector: 'app-documentos-oportunidades',
  standalone: false,
  templateUrl: './documentos-oportunidades.component.html',
  styleUrl: './documentos-oportunidades.component.css'
})
export class DocumentosOportunidadesComponent {

  constructor(private oportunidadService : OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private documentoService: DocumentoService) { }
    @Input() oportunidad!: Oportunidad;
    @Input() oportunidades: Oportunidad[]=[];
    @Input() oportunidadesOriginal: Oportunidad[]=[];
    @Input() title: string = 'Modal';
    @Input() visible: boolean = false;
    @Input() insertar: boolean = false;
    request!: RequestOportunidad;
  
    oportunidadForm!: FormGroup;
    loading: boolean = true;
  
    disableOportunidades = true;
    isDescargando = false;
    anchoTabla = 100;
    validacionActiva = false;
  
    historialOportunidad: Archivos[] = [];
    archivoSeleccionado: File | null = null;
    nombreOportunidad: string = '';


    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter();
    @Output() result: EventEmitter<baseOut> = new EventEmitter();
  
    inicializarFormulario() {
        this.oportunidadForm = this.fb.group({
          bandera: ['INSERT'],
          idOportunidad: [this.oportunidad.idOportunidad],
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          idUsuario: [this.loginService.obtenerIdUsuario()], 
          iniciales: [this.oportunidad.iniciales],
          nombreArchivo: [''],
        });
        if (this.oportunidad.idOportunidad) {
          this.getDocumentos(this.oportunidad.idOportunidad);
        }
          this.nombreOportunidad = this.oportunidad.nombre || 'Sin nombre';
        
      }
  
      onDialogShow() {
        this.cdr.detectChanges();
        this.inicializarFormulario(); 
        
      }
  
      ngOnChanges(changes: SimpleChanges) {
        if (changes['oportunidad'] && changes['oportunidad'].currentValue) {
          this.inicializarFormulario();
          this.cdr.detectChanges();
        }
      }
  
      close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.closeModal.emit();
      }
  
      guardarDocumento() {
        if (this.archivoSeleccionado) {
          const formData = new FormData();
          formData.append('archivo', this.archivoSeleccionado);
          formData.append('bandera', this.oportunidadForm.get('bandera')?.value);
          formData.append('idOportunidad', this.oportunidadForm.get('idOportunidad')?.value);
          formData.append('idUsuario', this.oportunidadForm.get('idUsuario')?.value);
          formData.append('idEmpresa', this.oportunidadForm.get('idEmpresa')?.value);
          formData.append('nombreArchivo', this.oportunidadForm.get('nombreArchivo')?.value);
      
          this.documentoService.guardarDocumento(formData).subscribe({
            next: (result) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Archivo guardado correctamente.'
              });
              // Actualiza la lista de documentos
              this.getDocumentos(this.oportunidad.idOportunidad!);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo guardar el archivo.'
              });
            }
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Por favor, seleccione un archivo.'
          });
        }
      }
        
      getDocumentos(idOportunidad: number) {
        this.documentoService.getDocumentos(idOportunidad).subscribe({
          next: (result: Archivos[]) => {
            this.historialOportunidad = result.filter(documento => documento.eliminado !== 1);
            this.loading = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Se ha producido un error.',
              detail: error.errorMessage,
            });
            this.loading = false;
          },
        });
      }

      descargarArchivo(item: Archivos) {
        let nombreArchivo = item.nombreArchivo;
        nombreArchivo = this.limpiarNombreArchivo(nombreArchivo);
        this.documentoService.descargarDocumento(nombreArchivo).subscribe((blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = nombreArchivo; 
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo descargar el archivo, es posible que el recurso no esté disponible.'
          });
        });
    }
    
        limpiarNombreArchivo(nombreArchivo: string): string {
          let limpio = nombreArchivo.replace(/\^\d+__\d+_\d+/, '');

          const extension = limpio.split('.').pop();
          if (extension && limpio.endsWith('.' + extension)) {
            limpio = limpio.slice(0, -extension.length - 1); // Eliminar la extensión duplicada
        }
    
        return limpio;
    } 
      

        eliminarArchivo(item: Archivos) {
          this.loading = true;
      
          this.documentoService.eliminarDocumento(item.idArchivo).subscribe({
            next: () => {
              this.historialOportunidad = this.historialOportunidad.filter(documento => documento.idArchivo !== item.idArchivo);
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Archivo eliminado correctamente.'
              });
              this.loading = false;
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el archivo.'
              });
              this.loading = false;
            }
          });}
      
        onFileChange(event: any) {
        const file = event.target.files[0]; 
        if (file) {
          this.archivoSeleccionado = file; 
          this.oportunidadForm.get('nombreArchivo')?.setValue(file.name);
        } else {
          this.archivoSeleccionado = null; 
          this.oportunidadForm.get('nombreArchivo')?.setValue('');
        }

        }
}
