import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OortunidadesMesAcordeonComponent } from './app-oportunidadesMes-acordeon.component';

describe('AcordionHorizontalComponent', () => {
  let component: OortunidadesMesAcordeonComponent;
  let fixture: ComponentFixture<OortunidadesMesAcordeonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OortunidadesMesAcordeonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OortunidadesMesAcordeonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
