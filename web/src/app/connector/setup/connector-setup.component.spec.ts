import { provideZonelessChangeDetection } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FakeConnectorService } from '../fake-connector.service';
import { ConnectorServiceToken } from '../connector.interface';
import { ConnectorSetupComponent } from './connector-setup.component';

describe('ConnectorSetupComponent', () => {
    let component: ConnectorSetupComponent;
    let fixture: ComponentFixture<ConnectorSetupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConnectorSetupComponent],
            providers: [{ provide: ConnectorServiceToken, useValue: new FakeConnectorService() }, provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(ConnectorSetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
