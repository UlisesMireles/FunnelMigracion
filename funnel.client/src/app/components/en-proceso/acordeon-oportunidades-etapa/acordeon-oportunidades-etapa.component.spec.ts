import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcordeonOportunidadesEtapaComponent } from './acordeon-oportunidades-etapa.component';

describe('AcordeonOportunidadesEtapaComponent', () => {
  let component: AcordeonOportunidadesEtapaComponent;
  let fixture: ComponentFixture<AcordeonOportunidadesEtapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcordeonOportunidadesEtapaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcordeonOportunidadesEtapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
