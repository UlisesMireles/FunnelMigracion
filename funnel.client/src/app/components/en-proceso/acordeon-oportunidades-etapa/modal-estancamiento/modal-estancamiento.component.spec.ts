import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEstancamientoComponent } from './modal-estancamiento.component';

describe('ModalEstancamientoComponent', () => {
  let component: ModalEstancamientoComponent;
  let fixture: ComponentFixture<ModalEstancamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEstancamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEstancamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
