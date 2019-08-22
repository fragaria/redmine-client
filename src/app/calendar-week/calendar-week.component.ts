import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RedmineService } from '../redmine.service';
import { SettingsService } from '../settings.service';

import { WeekLog, TimeEntry } from '../models/time-entries';

@Component({
  selector: 'app-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.css']
})
export class CalendarWeekComponent implements OnInit {

  @Input() weekLog: WeekLog;

  @Output() newEntryEmitter = new EventEmitter<TimeEntry>();

  dailyWorkingHours: number;

  constructor(
    private redmine: RedmineService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    this.dailyWorkingHours = this.settings.get().dailyWorkingHours;
  }

  timeLogged(entry: TimeEntry) {
    this.weekLog.hoursLogged += entry.hours;
    // resend;
    this.newEntryEmitter.emit(entry);
  }

  skippedWorkingDays(weekLog: WeekLog): number[] {
    const result = [];
    if (weekLog.startsWith !== 1) {
      for (let i = weekLog.numberOfDays; i < 7; i++) {
        result.push(i);
      }
    }
    return result;
  }

  missingWorkingDays(weekLog: WeekLog): number[] {
    const result = [];
    if (weekLog.startsWith === 1) {
      for (let i = weekLog.numberOfDays; i < 7; i++) {
        result.push(i);
      }
    }
    return result;
  }

}
