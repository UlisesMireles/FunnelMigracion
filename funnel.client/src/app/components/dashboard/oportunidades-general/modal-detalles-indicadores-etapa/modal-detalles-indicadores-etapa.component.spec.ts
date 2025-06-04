import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetallesIndicadoresEtapaComponent } from './modal-detalles-indicadores-etapa.component';

describe('ModalDetallesIndicadoresEtapaComponent', () => {
  let component: ModalDetallesIndicadoresEtapaComponent;
  let fixture: ComponentFixture<ModalDetallesIndicadoresEtapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetallesIndicadoresEtapaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetallesIndicadoresEtapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
