import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroContactosComponent } from './registro-contactos.component';

describe('RegistroContactosComponent', () => {
  let component: RegistroContactosComponent;
  let fixture: ComponentFixture<RegistroContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroContactosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
