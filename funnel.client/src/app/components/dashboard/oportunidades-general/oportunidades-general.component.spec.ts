import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OportunidadesGeneralComponent } from './oportunidades-general.component';

describe('OportunidadesGeneralComponent', () => {
  let component: OportunidadesGeneralComponent;
  let fixture: ComponentFixture<OportunidadesGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OportunidadesGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OportunidadesGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
