import { Component, OnInit, Input } from '@angular/core';

import { TimeEntryList, TimeEntry, DayLog } from '../models/time-entries';
import { Issue } from '../models/issues';

import { RedmineService } from '../redmine.service';
import { MessageService } from '../message.service';
import { SettingsService } from '../settings.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.css']
})
export class CalendarItemComponent implements OnInit {

  @Input() issues: Issue[];
  @Input() dayLog: DayLog;

  dailyWorkingHours: number;

  showLog: boolean = false;
  showNewLogForm: boolean = false;

  newEntryTimeout = 10000;

  constructor(
    private redmine: RedmineService,
    private messageService: MessageService,
    private settings: SettingsService,
    private utils: UtilService
  ) { }

  ngOnInit() {
    this.dailyWorkingHours = this.settings.get().dailyWorkingHours;
  }

  toggleLog() {
    this.showLog = !this.showLog;
  }

  toggleLogTime() {
    this.showNewLogForm = !this.showNewLogForm;
  }

  timeLogged(entry: TimeEntry) {
    // debugger;
    if(!this.showLog) {
      this.messageService.add(`${entry.hours}h spent on ${entry.spent_on} was logged.`);
    }
    entry.isNew = true;
    setTimeout(function() {
      entry.isNew = false;
    }, this.newEntryTimeout);
    this.dayLog.timeEntries.time_entries.splice(0, 0, entry);
    this.dayLog.hoursLogged += entry.hours;
    if(this.dayLog.hoursLogged == this.settings.get().dailyWorkingHours) {
      this.messageService.add(`${this.utils.formatDayOfWeek(this.dayLog.dayOfWeek)} ${this.dayLog.date} is fully logged.`);
    }
  }

}
