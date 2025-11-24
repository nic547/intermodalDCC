import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
