import { Component, EventEmitter,Input, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RequestProspecto } from '../../../../interfaces/prospecto';
import { BaseOut } from '../../../../interfaces/utils/baseOut';
import { Prospectos } from '../../../../interfaces/prospecto';
import { ProspectoService } from '../../../../services/prospecto.service';
import { baseOut } from '../../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-modal-prospectos',
  standalone: false,
  templateUrl: './modal-prospectos.component.html',
  styleUrl: './modal-prospectos.component.css'
})
export class ModalProspectosComponent {
  constructor (private prospectoService: ProspectoService, private messageService: MessageService, private readonly loginService: LoginService, private fb: FormBuilder) { }
  @Input() prospecto!: Prospectos;
  @Input() prospectos: Prospectos[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: RequestProspecto;

  prospectoActivo: boolean = false;
  prospectoForm!: FormGroup;
  sectores: any[] = [];
  
  
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  ngOnInit() {
    this.inicializarFormulario
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['prospecto'] && this.prospecto) {
      this.inicializarFormulario();
    }
  }
  inicializarFormulario() {
    if(this.insertar){
      this.prospectoForm = this.fb.group({
        idProspecto: [0],
        nombre: ['', [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
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
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        bandera: ['INSERT']
      });
      return;
    }else{
      this.prospectoForm = this.fb.group({
        idProspecto: [this.prospecto.idProspecto],
        nombre: [this.prospecto.nombre, [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        ubicacionFisica: [this.prospecto.ubicacionFisica, [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
          ]
        ],
        idSector: [this.prospecto.idSector, Validators.required],
        estatus: [this.prospecto.estatus],
        idEmpresa: [this.loginService.obtenerIdEmpresa()],
        bandera: ['UPDATE']
      });
    }
    
  }
  onDialogShow(){
    console.log('dialogo');
    this.cargarSectores();
    this.inicializarFormulario();
  }

  cargarSectores() {
    this.prospectoService.getSectores(this.loginService.obtenerIdEmpresa()).subscribe({
      next: (result: any) => {
        console.log('sectores', result);
        this.sectores = result;
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
      return;
    }
   this.prospectoForm.controls['estatus'].setValue(this.prospectoForm.value.estatus ? 1 : 0);
   this.prospectoForm.controls['bandera'].setValue(this.prospectoForm.value.bandera);
   this.prospectoForm.controls['idEmpresa'].setValue(this.loginService.obtenerIdEmpresa());
    this.prospectoService.postInsertProspecto(this.prospectoForm.value).subscribe({
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
    console.log(this.prospectoForm);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Es necesario llenar los campos indicados.',
    });
  }
}
