import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef} from '@angular/core';

import { MessageService } from 'primeng/api';

import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { Archivos, Oportunidad } from '../../../interfaces/oportunidades';

import { OportunidadesService } from '../../../services/oportunidades.service';
import { RequestOportunidad } from '../../../interfaces/oportunidades';
import { LoginService } from '../../../services/login.service';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { get } from 'lodash-es';



@Component({
  selector: 'app-documentos-oportunidades',
  standalone: false,
  templateUrl: './documentos-oportunidades.component.html',
  styleUrl: './documentos-oportunidades.component.css'
})
export class DocumentosOportunidadesComponent {

  constructor(private oportunidadService : OportunidadesService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
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
  
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter();
    @Output() result: EventEmitter<baseOut> = new EventEmitter();
  
    inicializarFormulario() {
        this.oportunidadForm = this.fb.group({
          idOportunidad: [this.oportunidad.idOportunidad],
          nombre: [this.oportunidad.nombre],
          nombreOportunidad: [this.oportunidad.nombreOportunidad],
          idEmpresa: [this.loginService.obtenerIdEmpresa()],
          idEstatusOportunidad: [this.oportunidad.idEstatusOportunidad],
          idUsuario: [this.loginService.obtenerIdUsuario()], 
          iniciales: [this.oportunidad.iniciales],
          archivoDescripcion: [this.oportunidad.archivoDescripcion],
          documento: [null]
        });
        if (this.oportunidad.idOportunidad) {
          this.getDocumentos(this.oportunidad.idOportunidad);
        }
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
  
      guardarDocumento(){
        
      }
        
      getDocumentos(idOportunidad: number) {
          this.oportunidadService.getDocumentos(idOportunidad).subscribe({
            next: (result: Archivos[]) => {
              this.historialOportunidad = [...result]; 
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
        
        }

        eliminarArchivo(item: Archivos) {
        
        }
}
