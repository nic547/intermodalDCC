import { TestBed } from '@angular/core/testing';

import { ManualParsingService } from './manual-parsing.service';

describe('ManualParsingService', () => {
  let service: ManualParsingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualParsingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
