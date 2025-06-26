import { ChangeDetectorRef, Component, EventEmitter,Input, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RequestProspecto } from '../../../../interfaces/prospecto';
import { BaseOut } from '../../../../interfaces/utils/baseOut';
import { Prospectos } from '../../../../interfaces/prospecto';
import { ProspectoService } from '../../../../services/prospecto.service';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalOportunidadesService } from '../../../../services/modalOportunidades.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-prospectos',
  standalone: false,
  templateUrl: './modal-prospectos.component.html',
  styleUrl: './modal-prospectos.component.css'
})
export class ModalProspectosComponent {
  constructor (private prospectoService: ProspectoService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder, private cdr: ChangeDetectorRef,
  private modalOportunidadesService: ModalOportunidadesService
  ) { }
  @Input() prospecto!: Prospectos;
  @Input() prospectos: Prospectos[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: RequestProspecto;

  prospectoActivo: boolean = false;
  prospectoForm!: FormGroup;
  sectores: any[] = [];
  desdeSector: boolean = false;
  
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  validaGuadar: boolean = false;
  informacionProspecto: Prospectos = {idProspecto: 0,
    nombre: "",
    ubicacionFisica: "",
    estatus: 0,
    desEstatus: "",
    nombreSector: "",
    idSector: 0,
    totalOportunidades: 0,
    proceso: 0,
    ganadas: 0,
    perdidas: 0,
    canceladas: 0,
    eliminadas: 0,
    idEmpresa: 0,
    bandera: "",
    porcEfectividad: 0
  };

  ngOnInit() {
    this.modalOportunidadesService.modalProspectoState$.subscribe(state => {
      this.desdeSector = state.desdeSector;
    });
    this.inicializarFormulario()
    
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['prospecto'] && this.prospecto) {
  //     this.inicializarFormulario();
  //   }
  // }
  inicializarFormulario() {
    let idEmpresa = this.loginService.obtenerIdEmpresa();
    let valoresIniciales: Record<string, any>;
    if(this.insertar){
      this.informacionProspecto = {idProspecto: 0,
        nombre: this.prospecto?.nombre ?? "",
        ubicacionFisica: "",
        estatus: 0,
        desEstatus: "",
        nombreSector: "",
        idSector: 0,
        totalOportunidades: 0,
        proceso: 0,
        ganadas: 0,
        perdidas: 0,
        canceladas: 0,
        eliminadas: 0,
        idEmpresa: 0,
        bandera: "",
        porcEfectividad: 0
      };

      this.prospectoForm = this.fb.group({
        idProspecto: [0],
        nombre: [this.prospecto?.nombre ?? "", [
            Validators.required,
            Validators.maxLength(50),
            // Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')
          ]
        ],
        ubicacionFisica: ['', [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        idSector: [null, Validators.required],
        estatus: [true],
        idEmpresa: [idEmpresa],
        bandera: ['INSERT']
      });

      valoresIniciales = this.prospectoForm.getRawValue();

        this.prospectoForm.valueChanges.subscribe((changes) => {
          this.validarCambios(valoresIniciales, changes);
        });
        this.validaGuadar = false;
        this.cdr.detectChanges(); 
    }else{
      this.informacionProspecto = this.prospecto;
      this.prospectoForm = this.fb.group({
        idProspecto: [this.prospecto?.idProspecto],
        nombre: [this.prospecto?.nombre, [
            Validators.required,
            Validators.maxLength(50),
            // Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        ubicacionFisica: [this.prospecto?.ubicacionFisica, [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        idSector: [this.prospecto?.idSector, Validators.required],
        estatus: [this.prospecto?.estatus === 1 ? true : false],
        idEmpresa: [idEmpresa],
        bandera: ['UPDATE']
      });

      valoresIniciales = this.prospectoForm.getRawValue();

        this.prospectoForm.valueChanges.subscribe((changes) => {
          this.validarCambios(valoresIniciales, changes);
        });
        this.validaGuadar = false;
        this.cdr.detectChanges(); 
    }
    
  }

  validarCambios(valoresIniciales: any, cambios: any) {
    const valoresActuales = cambios;

    if (this.prospectoForm.dirty) {
      this.validaGuadar = true;
    }
    const valoresRegresaron = this.compararValores(valoresIniciales, valoresActuales);
    if (valoresRegresaron) {
      this.validaGuadar = false;
    }
  }

  compararValores(valoresIniciales: any, valoresActuales: any) {
    let valoresInicialesJson = JSON.stringify(valoresIniciales);
    let valoresActualesJson = JSON.stringify(valoresActuales);
    return valoresInicialesJson === valoresActualesJson;
  }

  onDialogShow(){
    this.cargarSectores();
  }

  cargarSectores() {
    this.prospectoService.getSectores(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        this.sectores = result;
        this.inicializarFormulario();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      }
    });
  }
  
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

    guardarProspecto() {
    if (this.prospectoForm.invalid) {
      this.mostrarToastError();
      console.log(this.prospectoForm.errors);
      console.log(this.prospectoForm.controls['nombre'].errors);
      console.log(this.prospectoForm.controls['ubicacionFisica'].errors);
      return;
    }
    this.prospectoForm.controls['estatus'].setValue(this.prospectoForm.value.estatus ? 1 : 0);
     this.prospectoForm.controls['bandera'].setValue(this.prospectoForm.value.bandera);
     this.prospectoForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());

    this.informacionProspecto = {
      ...this.informacionProspecto,
      bandera: this.prospectoForm.get('bandera')?.value,
      idProspecto: this.prospectoForm.get('idProspecto')?.value,
      nombre: this.prospectoForm.get('nombre')?.value,
      ubicacionFisica: this.prospectoForm.get('ubicacionFisica')?.value,
      idSector: this.prospectoForm.get('idSector')?.value,
      estatus: this.prospectoForm.get('estatus')?.value,
      idEmpresa: this.prospectoForm.get('idEmpresa')?.value
    }
   

    this.prospectoService.postInsertProspecto(this.informacionProspecto).subscribe({
      next: (result: baseOut) => {
        this.result.emit(result);
        this.close();
      },
      error: (error: baseOut) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
      },
    });
  }

  

  mostrarToastError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Es necesario llenar los campos indicados.',
    });
  }
}
