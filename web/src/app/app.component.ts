import { Component, type OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectorSetupComponent } from './connector/setup/connector-setup.component';
import { ConnectorServiceToken } from './connector/connector.interface';
import { EngineRootComponent } from './engine/engine-root.component';
import { StopButtonComponent } from './stop-button/stop-button.component';
import { BleConnectorService } from './connector/ble.service';
import { DataService } from './services/data-service/data.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ConnectorSetupComponent, EngineRootComponent, StopButtonComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [{ provide: ConnectorServiceToken, useFactory: BleConnectorService.create }],
})
export class AppComponent implements OnInit {
    title = 'web';

    ngOnInit(): void {
        this.dataService.setup();
    }

    protected connector = inject(ConnectorServiceToken);
    protected dataService = inject(DataService);
}
