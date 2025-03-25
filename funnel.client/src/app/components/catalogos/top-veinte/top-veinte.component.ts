import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from 'lodash-es';
import{ ProspectoService } from '../../../services/prospecto.service';
import { ClientesTopVeinte } from '../../../interfaces/prospecto';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-top-veinte',
  standalone: false,
  templateUrl: './top-veinte.component.html',
  styleUrl: './top-veinte.component.css'
})
export class TopVeinteComponent {
  @ViewChild('dt')
  dt!: Table ;


  disableProspectos = true;
  isDescargando = false;
  anchoTabla = 100;
  topveinte: ClientesTopVeinte[] = [];
  TopVeinteOriginal: ClientesTopVeinte[] = [];
  TopVeinteSeleccionado!: ClientesTopVeinte;


  loading: boolean = true;
  insertar: boolean = false;
  modalVisible: boolean = false;
  selectedEstatus: any = null;

  EstatusDropdown = [
  { label: 'Todo', value: null },
  { label: 'Activo', value: 'Activo' },
  { label: 'Inactivo', value: 'Inactivo' },
  ];

  
}
