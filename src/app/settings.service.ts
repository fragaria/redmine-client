import { Injectable } from '@angular/core';

import { Settings } from './models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings: Settings;
  private defaultHoursKey = 'defaultHours';
  private defaultActivityNameKey = 'defaultActivityName';

  constructor() {
    this.settings = {
      defaultHours: this.getNumberFromLocalStorage(this.defaultHoursKey, 8),
      defaultActivityName: this.getStringFromLocalStorage(this.defaultActivityNameKey, 'Development')
    };
  }

  private getNumberFromLocalStorage(key: string, defaultValue: number): number {
    let item = localStorage.getItem(key);
    if(item !== undefined && item != null && item != '') {
      let numeric = +item;
      return numeric > 0 ? numeric : defaultValue;
    } else {
      return defaultValue;
    }
  }

  private getStringFromLocalStorage(key: string, defaultValue: string): string {
    let item = localStorage.getItem(key);
    return (item !== undefined && item != null && item != '') ? item : defaultValue;
  }

  get(): Settings {
    return this.settings;
  }

  save(settings: Settings) {
    // debugger;
    this.settings = settings;
    localStorage.setItem(this.defaultHoursKey, settings.defaultHours.toString());
    localStorage.setItem(this.defaultActivityNameKey, settings.defaultActivityName);
  }
}
