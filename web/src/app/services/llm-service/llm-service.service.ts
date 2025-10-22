import { inject, Injectable } from '@angular/core';
import { SettingsService } from '../settings-service/settings.service';

@Injectable({
  providedIn: 'root'
})
export class LlmServiceService {
  protected settingsService = inject(SettingsService);
  
}
