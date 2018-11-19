import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TimeEntryList, TimeEntry, DayLog } from '../models/time-entries';

import { RedmineService } from '../redmine.service';
import { MessageService } from '../message.service';
import { SettingsService } from '../settings.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-gap',
  templateUrl: './gap.component.html',
  styleUrls: ['./gap.component.css']
})
export class GapComponent implements OnInit {

  @Input() dayLog: DayLog;
  @Input() showLog: boolean = false;

  @Output() newEntryEmitter = new EventEmitter<TimeEntry>();

  dailyWorkingHours: number;
  showNewLogForm: boolean = false;

  newEntryTimeout = 10000;

  constructor(
    private redmine: RedmineService,
    private messageService: MessageService,
    private settings: SettingsService,
    public utils: UtilService
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
    this.newEntryEmitter.emit(entry);
  }

}
