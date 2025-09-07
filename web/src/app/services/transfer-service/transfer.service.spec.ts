import { TestBed } from '@angular/core/testing';

import { provideZonelessChangeDetection } from '@angular/core';
import { PersistentEngine } from '../../engine/types';
import { TransferService as TransferSerive } from './transfer.service';
import { getTestEngines } from '../../../test/testdata';

describe('TransferServiceService', () => {
    let service: TransferSerive;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(TransferSerive);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('exporting should return a base64 string', async () => {
        const engine = new PersistentEngine();

        const result = await service.exportEngine(engine);
        expect(result).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    });

    it('should be able to roundtrip an engine', async () => {
        const engine = new PersistentEngine();
        engine.name = 'test';
        engine.id = '1234';
        engine.created = new Date();
        engine.lastModified = new Date();
        engine.lastUsed = new Date();

        const exported = await service.exportEngine(engine);

        // Correctly convert base64 to binary data for the Blob
        const binaryString = atob(exported);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'application/gzip' });
        const file = new File([blob], 'test.json.gz', { type: 'application/gzip' });
        const imported = await service.importEngine(file);

        expect(imported).toBeInstanceOf(Array);
        expect(imported.length).toBe(1);
        expect(imported[0].name).toEqual(engine.name);
        expect(imported[0].id).not.toEqual(engine.id);
    });

    it('should be able to roundtrip the test data set', async () =>
    {
        const engines = getTestEngines();

        const exported = await service.exportEngines(engines);

        // Correctly convert base64 to binary data for the Blob
        const binaryString = atob(exported);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'application/gzip' });
        const file = new File([blob], 'test.json.gz', { type: 'application/gzip' });
        const imported = await service.importEngine(file);

        expect(imported).toBeInstanceOf(Array);
        expect(imported.length).toBe(engines.length);

        // not expected to be exhaustive (for now)
        for (let i = 0; i < engines.length; i++) {
            expect(imported[i].name).toEqual(engines[i].name);
            expect(imported[i].id).not.toEqual(engines[i].id);
            expect(imported[i].functions.length).toEqual(engines[i].functions.length);
            for (let j = 0; j < engines[i].functions.length; j++) {
                expect(imported[i].functions[j].number).toEqual(engines[i].functions[j].number);
                expect(imported[i].functions[j].description).toEqual(engines[i].functions[j].description);
                expect(imported[i].functions[j].duration).toEqual(engines[i].functions[j].duration);
            }
        }
    })
});
