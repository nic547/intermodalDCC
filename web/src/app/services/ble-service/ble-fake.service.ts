/// <reference types="web-bluetooth" />

import { Injectable, type Signal, type WritableSignal, signal } from '@angular/core';
import type { IBLEService } from './ble.interface';

@Injectable({
    providedIn: 'root',
})
export class BleFakeService implements IBLEService {
    isTrackPowerOn: Signal<boolean> = signal(false);
    isLoading = signal(false);
    isReady = signal(false);
    isAvailable = signal(true);
    errorMessage: WritableSignal<null | string> = signal(null);
    sessionUuid = signal(null);
    IsFake = true;

    async setup() {
        console.log('BLEService setup');
        this.isReady.set(true);
    }

    async setFunction(address: number, number: number, state: boolean) {
        console.log('setFunction', address, number, state);
    }

    async setSpeed128(address: number, speed: number, forwards: boolean) {
        console.log('setSpeed128', address, speed, forwards);
    }

    async setTrackPower(enabled: boolean) {
        console.log('setTrackPower', enabled);
        (this.isTrackPowerOn as WritableSignal<boolean>).set(enabled);
    }
}
