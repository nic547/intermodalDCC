import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ConnectorServiceToken } from '../connector.interface';

@Component({
    selector: 'app-connector-setup',
    imports: [],
    templateUrl: './connector-setup.component.html',
    styleUrl: './connector-setup.component.css',
})
export class ConnectorSetupComponent {
    protected connector = inject(ConnectorServiceToken);

    async connect() {
        await this.connector.setup();
    }
}
