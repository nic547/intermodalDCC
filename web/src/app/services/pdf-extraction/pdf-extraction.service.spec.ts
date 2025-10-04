import { TestBed } from '@angular/core/testing';

import { PdfExtractionService } from './pdf-extraction.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PdfExtractionService', () => {
  let service: PdfExtractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(PdfExtractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
