import { Component, inject } from '@angular/core';
import { ConnectorServiceToken } from '../connector/connector.interface';

@Component({
  selector: 'app-stop-button',
  imports: [],
  templateUrl: './stop-button.component.html',
  styleUrl: './stop-button.component.css'
})
export class StopButtonComponent {
  protected connector = inject(ConnectorServiceToken);

  async toggleTrackPower() {
    await this.connector.setTrackPower(!this.connector.isTrackPowerOn());
  }
}
