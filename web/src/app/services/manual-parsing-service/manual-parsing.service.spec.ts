import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ManualParsingService } from './manual-parsing.service';

describe('ManualParsingService', () => {
  let service: ManualParsingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(ManualParsingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
