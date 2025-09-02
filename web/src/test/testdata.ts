import { DccFunction, PersistentEngine } from '../app/engine/types';

export function getTestEngines(): PersistentEngine[] {
    return [
        createEngine({
            name: 'SBBCI BR 193 139 (Italypiercer)',
            functions: [
                createFunction({ number: 0, description: 'Light', duration: 0 }),
                createFunction({ number: 1, description: 'Driving noise', duration: 0 }),
                createFunction({ number: 2, description: 'Train horn high - long', duration: 0 }),
                createFunction({ number: 3, description: 'Train horn, deep - long', duration: 0 }),
                createFunction({ number: 4, description: 'Compressor', duration: 0 }),
                createFunction({ number: 5, description: 'Couple/Decouple', duration: 0 }),
                createFunction({ number: 6, description: 'Shunting gear + Shunting light', duration: 0 }),
                createFunction({ number: 7, description: 'Main beam', duration: 0 }),
                createFunction({ number: 8, description: 'Train horn high - short', duration: 0 }),
                createFunction({ number: 9, description: 'Train horn, deep - short', duration: 0 }),
                createFunction({ number: 10, description: 'Driver\'s cabin light', duration: 0 }),
                createFunction({ number: 11, description: 'Curve squeaking', duration: 0 }),
                createFunction({ number: 12, description: 'Conductor\'s signal', duration: 0 }),
                createFunction({ number: 13, description: 'Passing train', duration: 0 }),
                createFunction({ number: 14, description: 'Mute', duration: 0 }),
                createFunction({ number: 15, description: 'Light function', duration: 0 }),
                createFunction({ number: 16, description: 'Light function', duration: 0 }),
                createFunction({ number: 17, description: 'Light function', duration: 0 }),
                createFunction({ number: 18, description: 'Light function', duration: 0 }),
                createFunction({ number: 19, description: 'Light function', duration: 0 }),
                createFunction({ number: 20, description: 'Light function', duration: 0 }),
                createFunction({ number: 21, description: 'Forced braking with announcements', duration: 0 }),
                createFunction({ number: 22, description: 'Doors', duration: 0 }),
                createFunction({ number: 23, description: 'Fault', duration: 0 }),
                createFunction({ number: 24, description: 'Train impact', duration: 0 }),
                createFunction({ number: 25, description: 'Safety driving switch', duration: 0 }),
                createFunction({ number: 26, description: 'Braking noise', duration: 0 }),
                createFunction({ number: 27, description: 'Volume decrease', duration: 0 }),
                createFunction({ number: 28, description: 'Volume increase', duration: 0 }),
            ],
        }),
        createEngine({
            name: 'BLS Re 475 425 (Alpinists II)',
            functions: [createFunction({ number: 0, description: 'Lights', duration: 0 })],
        }),
    ];
}

function createEngine(data: Partial<PersistentEngine>): PersistentEngine {
    const engine = new PersistentEngine();
    Object.assign(engine, data);
    return engine;
}

function createFunction(data: Partial<DccFunction>): DccFunction {
    const func = new DccFunction();
    Object.assign(func, data);
    return func;
}
