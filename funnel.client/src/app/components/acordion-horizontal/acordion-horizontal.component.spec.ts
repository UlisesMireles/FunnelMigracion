import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcordionHorizontalComponent } from './acordion-horizontal.component';

describe('AcordionHorizontalComponent', () => {
  let component: AcordionHorizontalComponent;
  let fixture: ComponentFixture<AcordionHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcordionHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcordionHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
