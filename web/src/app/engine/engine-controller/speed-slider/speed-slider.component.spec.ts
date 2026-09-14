import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedSliderComponent } from './speed-slider.component';

describe('SpeedSliderComponent', () => {
  let component: SpeedSliderComponent;
  let fixture: ComponentFixture<SpeedSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedSliderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
