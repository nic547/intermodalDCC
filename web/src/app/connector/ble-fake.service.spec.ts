import { TestBed } from '@angular/core/testing';

import { provideZonelessChangeDetection } from '@angular/core';
import { FakeConnectorService } from './fake-connector.service';

describe('BleFakeService', () => {
    let service: FakeConnectorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(FakeConnectorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
