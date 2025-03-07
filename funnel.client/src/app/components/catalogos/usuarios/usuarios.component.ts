import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Usuario } from '../../../interfaces/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(private UsuariosService: UsuariosService, private messageService: MessageService, private cdr: ChangeDetectorRef, private loginService:LoginService) { }

  ngOnInit(): void {
    this.getUsuarios();
  }
  @ViewChild('dt') dt!: Table;


  usuarios: Usuario[] = [];
  usuariosOriginal: Usuario[] = [];
  usuarioSeleccionado!: Usuario;

  selectedEstatus: string = 'Activo';
  loading: boolean = true;
  first: number = 0;
  rows: number = 10;

  filtroNombre = '';
  filtroCorreo = '';
  filtroApellidoPaterno = '';
  filtroApellidoMaterno = '';
  filtroUsuario = '';
  filtroDescripcion = '';


  
  insertar: boolean = false;
  modalVisible: boolean = false;


  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];
  rowsOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 }
  ];

  getUsuarios(idEmpresa: number = 1) {
      this.UsuariosService.getUsuarios(this.loginService.obtenerIdEmpresa()).subscribe({
      
        next: (result: Usuario[]) => {

          console.log("Datos recibidos en Angular:", result);
          if (!result || result.length === 0) {
            console.warn("No hay usuarios en la respuesta.");}

          this.usuariosOriginal = result;
          this.selectedEstatus = 'Activo';  
          this.cdr.detectChanges();
          this.loading = false;
          this.FiltrarPorEstatus();   
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

    pageChange(event: LazyLoadEvent) {
        if (event.first !== undefined) {
          this.first = event.first;
        }
        if (event.rows !== undefined) {
          this.rows = event.rows;
        }
      }
      getVisibleTotal(campo: string, dt: any): number {
        const registrosVisibles = dt.filteredValue
          ? dt.filteredValue
          : this.usuarios;
        if (campo === 'nombre') {
          return registrosVisibles.length; 
        }
        return registrosVisibles.reduce(
          (acc: number, _usuario: Usuario) =>
            acc + Number(_usuario[campo as keyof Usuario] || 0),
          0
        );
      }

      updateFilter(event: any, field: string) {
        this.dt.filter(event, field, 'contains');
      }
      FiltrarPorEstatus() {
        this.usuarios = this.selectedEstatus === null
          ? [...this.usuariosOriginal]
          : [...this.usuariosOriginal.filter((x) => x.desEstatus.toString() === this.selectedEstatus)];
        if (this.dt) {
          this.dt.first = 0;
        }
      }
      
      reset() {
        this.first = 0;
        this.getUsuarios();
        this.dt.reset();
      }

      onModalClose() {
        this.modalVisible = false;
      }
    
      manejarResultado(result: baseOut) {
        if (result.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'La operación se realizó con éxito.',
            detail: result.errorMessage,
          });
          this.getUsuarios();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Se ha producido un error.',
            detail: result.errorMessage,
          });
        }
      }

      inserta() {
          console.log(this.usuarioSeleccionado);
          this.usuarioSeleccionado = {
            result: true,
            errorMessage: 'No hay error',
            id: 0,  
            idUsuario: 0, 
            usuario: '',
            password: '',
            tipoUsuario: '',
            nombre: '',
            correo: '',
            idEmpresa: 0,
            idTipoUsuario: 0,
            descripcion: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            fechaRegistro: '',  
            fechaModificacion: '',  
            estatus: 1,  
            desEstatus: 'Activo',
            archivoImagen: '',
            usuarioCreador: 0,  
            codigoAutenticacion: '',
            fechaInicio: '',
            fechaFin: '',
            iniciales: ''
          };
          this.insertar = true;
          this.modalVisible = true;
        }
       
        actualiza(licencia: Usuario) {
          this.usuarioSeleccionado = licencia;
          this.insertar = false;
          this.modalVisible = true;
        }

}
