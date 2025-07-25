import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalBarComponent } from './vertical-bar.component';

describe('VerticalBarComponent', () => {
  let component: VerticalBarComponent;
  let fixture: ComponentFixture<VerticalBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerticalBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
