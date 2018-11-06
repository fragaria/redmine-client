import { Component, OnInit, Input } from '@angular/core';

import { TimeEntryList, TimeEntry, DayLog } from '../models/time-entries';
import { Issue } from '../models/issues';

import { RedmineService } from '../redmine.service';
import { MessageService } from '../message.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-gap',
  templateUrl: './gap.component.html',
  styleUrls: ['./gap.component.css']
})
export class GapComponent implements OnInit {

  @Input() issues: Issue[];
  @Input() dayLog: DayLog;

  dailyWorkingHours: number;

  showLog: boolean = false;
  showNewLogForm: boolean = false;

  newEntryTimeout = 10000;

  constructor(
    private redmine: RedmineService,
    private messageService: MessageService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
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
      this.messageService.add(`${this.formatDayOfWeek(this.dayLog.dayOfWeek)} ${this.dayLog.date} is fully logged.`);
    }
  }

  formatDayOfWeek(num: number): string {
    switch(num) {
      case 1: {
        return "Monday";
      }
      case 2: {
        return "Tuesday";
      }
      case 3: {
        return "Wednesday";
      }
      case 4: {
        return "Thursday";
      }
      case 5: {
        return "Friday";
      }
      case 6: {
        return "Saturday";
      }
      case 7: {
        return "Sunday";
      }
      default: {
        return "";
      }
    }
  }

}
