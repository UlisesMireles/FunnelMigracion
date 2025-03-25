import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcordeonHorizontalComponent } from './app-acordeon-horizontal.component';

describe('AcordionHorizontalComponent', () => {
  let component: AcordeonHorizontalComponent;
  let fixture: ComponentFixture<AcordeonHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcordeonHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcordeonHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
