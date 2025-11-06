import { TestBed } from '@angular/core/testing';

import { PdfService } from './pdf.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PdfExtractionService', () => {
  let service: PdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(PdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
