import { Component, inject } from '@angular/core';
import { SettingsService } from '../services/settings-service/settings.service';
import { StateService } from '../services/state-service/state.service';
import { FormsModule } from '@angular/forms';
import { LlmLanguage } from '../services/settings-service/settings.service.types';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  protected settingsService = inject(SettingsService);
  protected stateService = inject(StateService);

  protected languages: LlmLanguage[] = ['en', 'de'];
  protected Settings = this.settingsService.Settings.getCopy();


  save() {
    this.settingsService.updateSettings(this.Settings);
    this.stateService.showSettings.set(false);
  }

  cancel() {
    this.stateService.showSettings.set(false);
  }
}
