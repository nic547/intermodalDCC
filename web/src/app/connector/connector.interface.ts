import { InjectionToken, type Signal } from '@angular/core';

export interface IConnector {
    setup(): Promise<void>;
    
    setSpeed128(address: number, speed: number, forwards: boolean): Promise<void>;
    setFunction(address: number, number: number, state: boolean): Promise<void>;
    setTrackPower(enabled: boolean): Promise<void>;

    isLoading: Signal<boolean>;
    isReady: Signal<boolean>;
    isAvailable: Signal<boolean>;
    errorMessage: Signal<null | string>;
    sessionUuid: Signal<string | null>;

    isTrackPowerOn: Signal<boolean>;

    IsFake: boolean;
}

const ConnectorServiceToken = new InjectionToken<IConnector>('IConnector');
export { ConnectorServiceToken };
