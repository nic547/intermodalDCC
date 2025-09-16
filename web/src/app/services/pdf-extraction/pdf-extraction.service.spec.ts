import { TestBed } from '@angular/core/testing';

import { PdfExtractionService } from './pdf-extraction.service';

describe('PdfExtractionService', () => {
  let service: PdfExtractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfExtractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
