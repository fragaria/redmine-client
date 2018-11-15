import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { MessageService } from '../message.service';
import { RedmineService } from '../redmine.service';
import { SettingsService } from '../settings.service';

import { TimeEntryList, TimeEntry, DayLog } from '../models/time-entries';

@Component({
  selector: 'app-gaps',
  templateUrl: './gaps.component.html',
  styleUrls: ['./gaps.component.css']
})
export class GapsComponent implements OnInit {

  monthDate = moment();

  dayLogs: DayLog[];

  dailyWorkingHours: number;

  constructor(
    private messageService: MessageService,
    private redmine: RedmineService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    this.dailyWorkingHours = this.settings.get().dailyWorkingHours;
    this.listWorkingDayLogsForMonth();
  }

  listWorkingDayLogsForMonth() {
    this.redmine.listDayLogs(this.monthDate.format(moment.HTML5_FMT.MONTH), 'month').subscribe(dayLogs => {
      // debugger;
      this.dayLogs = dayLogs;
    });
  }

  setMonth(month: string) {
    this.monthDate.month(month);
    this.listWorkingDayLogsForMonth();
  }

  months(): string[] {
    let months = [];
    for(let i = 0; i < 6; i++) {
      months.push(moment().subtract(i, 'months').format('MMMM'));
    }
    return months;
  }
}
