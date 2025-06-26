import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficasClientesTop20Component } from './graficas-clientes-top20.component';

describe('GraficasClientesTop20Component', () => {
  let component: GraficasClientesTop20Component;
  let fixture: ComponentFixture<GraficasClientesTop20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficasClientesTop20Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficasClientesTop20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
