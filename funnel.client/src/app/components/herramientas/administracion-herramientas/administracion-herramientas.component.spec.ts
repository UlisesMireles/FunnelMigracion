import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionHerramientasComponent } from './administracion-herramientas.component';

describe('AdministracionHerramientasComponent', () => {
  let component: AdministracionHerramientasComponent;
  let fixture: ComponentFixture<AdministracionHerramientasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministracionHerramientasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionHerramientasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
