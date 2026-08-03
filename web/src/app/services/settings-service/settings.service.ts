import { Injectable } from '@angular/core';
import { Settings, SettingsDto } from './settings.service.types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _settings = new Settings();

  public get Settings(): Settings {
    return this._settings;
  }

  private set Settings(value: Settings) {
    this._settings = value;
  }

  constructor() { 
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      this.Settings.updateFromDto(Object.assign(new SettingsDto(), JSON.parse(savedSettings)));
    }
  }

  updateSettings(newSettings: Settings) {
    this.Settings = newSettings;
    localStorage.setItem('settings', JSON.stringify(this.Settings.toDto()));
  }

}
