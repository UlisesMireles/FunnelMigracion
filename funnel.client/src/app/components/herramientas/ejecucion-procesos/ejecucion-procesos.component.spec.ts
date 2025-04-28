import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionProcesosComponent } from './ejecucion-procesos.component';

describe('EjecucionProcesosComponent', () => {
  let component: EjecucionProcesosComponent;
  let fixture: ComponentFixture<EjecucionProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EjecucionProcesosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecucionProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
