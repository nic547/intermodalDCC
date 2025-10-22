import { Component, inject } from '@angular/core';
import { SettingsService } from '../services/settings-service/settings.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  protected settingsService = inject(SettingsService);

  protected Settings = this.settingsService.Settings.getCopy();
    
}
