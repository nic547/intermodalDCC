import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BleConnectorService } from './ble.service';

describe('BLEService', () => {
    let service: BleConnectorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(BleConnectorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
