import { Injectable } from '@angular/core';
import { Settings } from './settings.service.types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public Settings: Settings = new Settings();

  constructor() { 
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      this.Settings = Object.assign(new Settings(), JSON.parse(savedSettings));
    }
  }
}
