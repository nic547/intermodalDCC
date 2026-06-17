import { Component, inject } from '@angular/core';
import { BLEServiceToken } from '../services/ble-service/ble.interface';

@Component({
  selector: 'app-stop-button',
  imports: [],
  templateUrl: './stop-button.component.html',
  styleUrl: './stop-button.component.css'
})
export class StopButtonComponent {
  protected bleService = inject(BLEServiceToken);

  async toggleTrackPower() {
    await this.bleService.setTrackPower(!this.bleService.isTrackPowerOn());
  }
}
