import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenteBienvenidaComponent } from './asistente-bienvenida.component';

describe('AsistenteBienvenidaComponent', () => {
  let component: AsistenteBienvenidaComponent;
  let fixture: ComponentFixture<AsistenteBienvenidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsistenteBienvenidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenteBienvenidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
