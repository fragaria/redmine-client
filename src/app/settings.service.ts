import { Injectable } from '@angular/core';

import { Settings } from './models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings: Settings;
  private defaultHoursKey = 'defaultHours';
  private defaultActivityNameKey = 'defaultActivityName';
  private defaultIssueIdKey = 'defaultIssueId';
  private dailyWorkingHoursKey = 'dailyWorkingHours';

  constructor() {
    this.initSettings();
  }

  initSettings() {
    this.settings = {
      defaultHours: this.getNumberFromLocalStorage(this.defaultHoursKey, 8),
      defaultActivityName: this.getStringFromLocalStorage(this.defaultActivityNameKey, 'Development'),
      defaultIssueId: this.getNumberFromLocalStorage(this.defaultIssueIdKey, -1),
      dailyWorkingHours: this.getNumberFromLocalStorage(this.dailyWorkingHoursKey, 8)
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
    this.saveState;
  }

  private saveState() {
    localStorage.setItem(this.defaultHoursKey, this.settings.defaultHours.toString());
    localStorage.setItem(this.defaultActivityNameKey, this.settings.defaultActivityName);
    localStorage.setItem(this.defaultIssueIdKey, this.settings.defaultIssueId.toString());
    localStorage.setItem(this.dailyWorkingHoursKey, this.settings.dailyWorkingHours.toString());
  }

  reset(): Settings {
    // debugger;
    localStorage.clear();
    this.initSettings();
    this.saveState();
    return this.settings;
  }
}
