import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { OportunidadesService } from '../../../../services/oportunidades.service';
import { LoginService } from '../../../../services/login.service';
import { Archivos, Oportunidad, RequestOportunidad } from '../../../../interfaces/oportunidades';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { DocumentoService } from '../../../../services/documento.service';



@Component({
  selector: 'app-documentos-oportunidades',
  standalone: false,
  templateUrl: './documentos-oportunidades.component.html',
  styleUrl: './documentos-oportunidades.component.css'
})
export class DocumentosOportunidadesComponent {

  constructor(private oportunidadService : OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private documentoService: DocumentoService, private el: ElementRef) { }
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
    archivosSeleccionados: File[] = [];
    nombreOportunidad: string = '';
    maxArchivos = 5;

    @ViewChild('fileInput') fileInput!: ElementRef;

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
        this.archivosSeleccionados = []; 
        if (this.fileInput?.nativeElement) {
          this.fileInput.nativeElement.value = ''; 
        }
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.closeModal.emit();
      }
      // En tu componente
      get subirArchivos(): boolean {
        return (this.oportunidad?.totalArchivos || 0) < this.maxArchivos;
      }
      get archivosDisponibles(): number {
        return this.maxArchivos - (this.oportunidad?.totalArchivos || 0);
      }
      guardarDocumento() {
        if (this.archivosDisponibles <= 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Límite alcanzado',
            detail: 'No puedes subir más archivos. El límite es de ' + this.maxArchivos
          });
          return;
        }
        if (this.archivosSeleccionados && this.archivosSeleccionados.length > 0) {
          const formData = new FormData();
          
          // 1. Agregar cada archivo con el nombre 'archivos' (plural)
          this.archivosSeleccionados.forEach(file => {
            formData.append('archivos', file); // ¡Nota el plural 'archivos'!
          });
      
          // 2. Agregar cada campo del DTO por separado (no como JSON)
          formData.append('Bandera', this.oportunidadForm.get('bandera')?.value);
          formData.append('IdOportunidad', this.oportunidadForm.get('idOportunidad')?.value);
          formData.append('IdUsuario', this.oportunidadForm.get('idUsuario')?.value);
          formData.append('IdEmpresa', this.oportunidadForm.get('idEmpresa')?.value);
          // El nombreArchivo puede ir vacío como en tu backend
          formData.append('NombreArchivo', ''); 
      
          this.documentoService.guardarDocumento(formData).subscribe({
            next: (result: any) => {
              if (result && result.length > 0) {
                this.oportunidad.totalArchivos += result.filter((r: any) => r.result).length;
                const successCount = result.filter((r: any) => r.result).length;
                const errorCount = result.length - successCount;
                /*this.mostrarResultadoSubida(successCount, errorCount);*/
                
                if (successCount > 0) {
                  this.archivosSeleccionados = [];
                  if (this.fileInput?.nativeElement) {
                    this.fileInput.nativeElement.value = '';
                  }
                  this.getDocumentos(this.oportunidad.idOportunidad!);
                  this.result.emit({
                    result: true,
                    errorMessage: '',
                    id: this.oportunidad.idOportunidad || 0
                  });
                }
              }
            },
            error: (error: any) => {
              this.result.emit({
                result: false,
                errorMessage: 'Error al subir los archivos.',
                id: this.oportunidad.idOportunidad || 0
            
              });
            }
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Por favor, seleccione al menos un archivo.'
          });
        }
      }
      private mostrarResultadoSubida(successCount: number, errorCount: number) {
        if (successCount > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${successCount} archivo(s) subido(s) correctamente.`
          });
          this.archivosSeleccionados = [];
          this.fileInput.nativeElement.value = '';
          this.getDocumentos(this.oportunidad.idOportunidad!);
        }
        
        if (errorCount > 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${errorCount} archivo(s) no se pudieron subir.`
          });
        }
      }
      
      eliminarArchivoSeleccionado(index: number) {
        this.archivosSeleccionados.splice(index, 1);
        if (this.archivosSeleccionados.length === 0) {
          this.fileInput.nativeElement.value = '';
        }
        
        this.oportunidadForm.get('nombreArchivo')?.setValue(
          this.archivosSeleccionados.length > 0 
            ? this.archivosSeleccionados.map(f => f.name).join(', ') 
            : ''
        );
      }
        
      getDocumentos(idOportunidad: number) {
        this.documentoService.getDocumentos(idOportunidad).subscribe({
          next: (result: Archivos[]) => {
            this.historialOportunidad = result.filter(documento => 

              documento.eliminado !== 1 || 
            
              (documento.eliminado === 1 && Number(documento.diasParaEliminacion) > 0)
            
            );
                        
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
        const nombreArchivo = this.limpiarNombreArchivo(item.nombreArchivo);
        
        this.documentoService.descargarDocumento(nombreArchivo).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = nombreArchivo; 
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                console.error('Error al descargar:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo descargar es posible que no esté disponible`
                });
            }
          });
        }
    
    limpiarNombreArchivo(nombreArchivo: string): string {
      const limpio = nombreArchivo.replace(/\^\d+__\d+_\d+/, '');
      const tieneExtension = limpio.includes('.');
      if (tieneExtension) {
          return limpio;
      }
      const extensionOriginal = nombreArchivo.split('.').pop();
      return extensionOriginal ? `${limpio}.${extensionOriginal}` : limpio;
    }
      

    eliminarArchivo(item: Archivos) {
      this.loading = true;
      
      this.documentoService.eliminarDocumento(item.idArchivo).subscribe({
        next: () => {
          item.diasParaEliminacion = "2"; 
          this.result.emit({
            result: true,
            errorMessage: 'Archivo movido a la papelera. Tienes 2 días para recuperarlo.',
            id: item.idArchivo
          });
          this.oportunidad.totalArchivos!--;
          this.loading = false;
        },
        error: (error) => {
          this.result.emit({
            result: false,
            errorMessage: error.message || 'Error al eliminar archivo',
            id: item.idArchivo
          });
          this.loading = false;
        }
      });
    }
    onFileChange(event: any) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        // Convertir FileList a array y agregar a la lista existente
        const newFiles = Array.from(input.files) as File[];
        if (newFiles.length > this.maxArchivos) {
          this.messageService.add({
            severity: 'warn',
            summary:'Límite de archivos',
            detail: `Solo puedes subir ${this.archivosDisponibles} archivo(s) más.`
          });
          return;
        }
        this.archivosSeleccionados = [...this.archivosSeleccionados, ...newFiles];
        
        // Limpiar el input file después de seleccionar
        input.value = '';
        
        // Actualizar el valor del formulario
        this.oportunidadForm.get('nombreArchivo')?.setValue(
          this.archivosSeleccionados.map(f => f.name).join(', ')
        );
      }
    }

          recuperarArchivo(item: Archivos) {
            this.loading = true;
            
            this.documentoService.recuperarArchivo(item.idArchivo).subscribe({
              next: (result) => {
                if (result.result) {
                  item.diasParaEliminacion = '';
                  this.result.emit({
                    result: true,
                    errorMessage: 'Archivo recuperado correctamente',
                    id: item.idArchivo
                  });
                  this.oportunidad.totalArchivos!++;
                } else {
                  this.result.emit({
                    result: false,
                    errorMessage: result.errorMessage || 'Error al recuperar archivo',
                    id: item.idArchivo
                  });
                }
                this.loading = false;
              },
              error: (error) => {
                this.result.emit({
                  result: false,
                  errorMessage: error.message || 'No se pudo recuperar el archivo',
                  id: item.idArchivo
                });
                this.loading = false;
              }
            });
          }

        estaEliminado(item: Archivos): boolean {
          return !!item.diasParaEliminacion && item.diasParaEliminacion !== "0";
        }

        getIconoEliminacion(item: Archivos): string {
          return this.estaEliminado(item) ? 'bi bi-arrow-counterclockwise' : 'bi bi-trash';
        }

        getTooltipEliminacion(item: Archivos): string {
          return this.estaEliminado(item) 
            ? `Recuperar archivo (eliminación definitiva en ${item.diasParaEliminacion} días)`
            : 'Eliminar archivo';
        }
}
