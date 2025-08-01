import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalCamposAdicionalesService } from '../../../services/modalCamposAdicionales.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../../../services/login.service';
import { CamposAdicionales } from '../../../interfaces/campos-adicionales';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { CamposAdicionalesService } from '../../../services/campos-adicionales.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-campos-nuevos',
  standalone: false,
  templateUrl: './modal-campos-nuevos.component.html',
  styleUrl: './modal-campos-nuevos.component.css'
})
export class ModalCamposNuevosComponent {

  @Input() visible: boolean = false;
  @Input() pantalla: string = '';

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  private modalSubscription!: Subscription;

  idUsuario: number = 0;
  idEmpresa: number = 0;
  filtroCampoNoUtilizado: string = '';


  camposAdicionales: CamposAdicionales[] = [];
  camposAdicionalesOriginal: CamposAdicionales[] = [];

  camposNoUtilizados: CamposAdicionales[] = [];
  connectedDropLists: string[] = [];
  validaGuadar: boolean = false;

  constructor(private readonly camposAdicionalesService: ModalCamposAdicionalesService,
    private readonly loginService: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private readonly camposAdicionalesMetodosService: CamposAdicionalesService,
    private messageService: MessageService
  ) { }

  onDialogShow() {
    this.inicializarModal()
  }

  inicializarModal() {
    this.modalSubscription = this.camposAdicionalesService.modalState$.subscribe((state) => {
      this.visible = state.showModal;
    });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  cerrar() {
    this.visible = false;
    this.camposAdicionalesService.closeModal();
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  ngOnInit() {
    this.idUsuario = this.loginService.obtenerIdUsuario();
    this.idEmpresa = this.loginService.obtenerIdEmpresa();

    this.modalSubscription = this.camposAdicionalesService.modalState$.subscribe((state) => {
      this.visible = state.showModal;
      if (state.showModal) {
        this.pantalla = state.pantalla;
        this.camposAdicionales = state.camposPorCatalogo;
        this.camposAdicionalesOriginal = [...this.camposAdicionales];
        this.camposNoUtilizados = state.campos.filter(campo => !this.camposAdicionales.find(adicional => adicional.idInput === campo.idInput))
        this.connectedDropLists = this.camposAdicionales.map((_, i) => `ListEtapa${i}`);
      }
    });
  }

  get camposAdicionalesActivos() {
    return this.camposAdicionales.filter(e => e.activo);
  }

  camposNoUtilizadosFiltrados(): any[] {
    if (!this.filtroCampoNoUtilizado?.trim()) {
      return this.camposNoUtilizados;
    }

    const filtro = this.filtroCampoNoUtilizado.toLowerCase();
    return this.camposNoUtilizados.filter(campo =>
      campo.nombre.toLowerCase().includes(filtro)
    );
  }

  dropCampo(event: CdkDragDrop<any[]>) {
    console.log("cambios")
    const draggedItem = event.item.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const sourceList = event.previousContainer.data;
      const targetList = event.container.data;

      const realIndex = sourceList.findIndex(item => item.idInput === draggedItem.idInput);

      if (realIndex > -1) {
        const [itemToMove] = sourceList.splice(realIndex, 1);
        if (
          event.previousContainer.id === 'camposAdicionalesList' &&
          event.container.id === 'camposNoUtilizadosList'
        ) {
          itemToMove.orden = 0;
          itemToMove.activo = false;
          itemToMove.tipoCatalogoInput = this.pantalla;
        }
        targetList.splice(event.currentIndex, 0, itemToMove);
      }
      this.filtroCampoNoUtilizado = '';
    }
    this.camposAdicionales.forEach((campo, index) => {
      campo.activo = true;
      campo.orden = index + 1;
      campo.tipoCatalogoInput = this.pantalla;
    });

    this.cdr.detectChanges();
    this.validarCambios();
  }

  trackByCampo(index: number, campo: any): any {
    return campo.idInput;
  }

  validarCambios() {
    const valoresRegresaron = this.compararValores(this.camposAdicionalesOriginal, this.camposAdicionales);
    if (valoresRegresaron) 
      this.validaGuadar = false;
    else
      this.validaGuadar = true;
    
  }

  compararValores(valoresIniciales: any[], valoresActuales: any[]) {
    let valoresInicialesJson = JSON.stringify(valoresIniciales);
    let valoresActualesJson = JSON.stringify(valoresActuales);
    return valoresInicialesJson === valoresActualesJson;
  }

  guardarCamposAdicionales() {
    let listaFinalCamposAdicionales: CamposAdicionales[] = [];
    const camposNoUtilizados = this.camposNoUtilizados.filter(campo => campo.rCatalogoInputId !== 0);
    if (camposNoUtilizados.length > 0)
      listaFinalCamposAdicionales = [...this.camposAdicionales, ...camposNoUtilizados];
    else
      listaFinalCamposAdicionales = [...this.camposAdicionales];

    this.camposAdicionalesMetodosService.postCamposAdicionales(listaFinalCamposAdicionales,this.idEmpresa).subscribe({
      next: (result: baseOut) => {
        this.result.emit(result);
        //this.cerrar();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error al guardar los campos adicionales.',
          detail: error.errorMessage,
        });
      },
    });
  }
}
