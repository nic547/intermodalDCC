import { TestBed } from '@angular/core/testing';

import { provideZonelessChangeDetection } from '@angular/core';
import { StateService } from './state.service';
import { PersistentEngine } from '../../engine/types';

describe('StateService', () => {
    let service: StateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(StateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should not let the same engine be activated twice', () => {
        const engine = new PersistentEngine();
        service.activateEngine(engine);
        service.activateEngine(engine);
        expect(service.activeEngines()).toEqual([engine]);
    });

    it('should let engines be deactivated', () => {
        const engine = new PersistentEngine();
        service.activateEngine(engine);
        service.deactivateEngine(engine);
        expect(service.activeEngines()).toEqual([]);
    });

    it('should let multiple engines be activated', () => {
        const engine1 = new PersistentEngine();
        const engine2 = new PersistentEngine();
        service.activateEngine(engine1);
        service.activateEngine(engine2);
        expect(service.activeEngines()).toEqual([engine1, engine2]);
    });
});
