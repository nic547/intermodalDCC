import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { StopButtonComponent } from './stop-button.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { ConnectorServiceToken } from '../connector/connector.interface';
import { FakeConnectorService } from '../connector/fake-connector.service';

describe('StopButtonComponent', () => {
  let component: StopButtonComponent;
  let fixture: ComponentFixture<StopButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopButtonComponent],
      providers: [provideZonelessChangeDetection(),{ provide: ConnectorServiceToken, useValue: new FakeConnectorService() }]
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
