import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIngresosUsuariosComponent } from './reporte-ingresos-usuarios.component';

describe('ReporteIngresosUsuariosComponent', () => {
  let component: ReporteIngresosUsuariosComponent;
  let fixture: ComponentFixture<ReporteIngresosUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteIngresosUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteIngresosUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
