import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { StopButtonComponent } from './stop-button.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { BLEServiceToken } from '../services/ble-service/ble.interface';
import { BleFakeService } from '../services/ble-service/ble-fake.service';

describe('StopButtonComponent', () => {
  let component: StopButtonComponent;
  let fixture: ComponentFixture<StopButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopButtonComponent],
      providers: [provideZonelessChangeDetection(),{ provide: BLEServiceToken, useValue: new BleFakeService() }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
