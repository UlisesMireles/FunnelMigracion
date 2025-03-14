import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { baseOut } from '../../../interfaces/utils/utils/baseOut';
import { LoginService } from '../../../services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnasDisponiblesComponent } from '../../shared/columnas-disponibles/columnas-disponibles.component';
import { sumBy, map as mapping, omit, sortBy, groupBy, keys as getKeys } from "lodash-es";
import { OportunidadesPerdidasService } from '../../../services/oportunidades-perdidas.service';
import { OportunidadPerdida } from '../../../interfaces/oportunidades-perdidas';


@Component({
  selector: 'app-oportunidades-perdidas',
  standalone: false,
  templateUrl: './oportunidades-perdidas.component.html',
  styleUrl: './oportunidades-perdidas.component.css'
})
export class OportunidadesPerdidasComponent {

}
