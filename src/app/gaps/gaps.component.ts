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

  months = [];

  constructor(
    private messageService: MessageService,
    private redmine: RedmineService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    this.months = this.getMonths();
    this.dailyWorkingHours = this.settings.get().dailyWorkingHours;
    this.listWorkingDayLogsForMonth();
  }

  listWorkingDayLogsForMonth() {
    this.redmine.listDayLogs(this.monthDate.format(moment.HTML5_FMT.MONTH), 'month', false).subscribe(dayLogs => {
      this.dayLogs = dayLogs;
    });
  }

  setMonth(month: string) {
    this.monthDate = moment(month, moment.HTML5_FMT.MONTH);
    this.listWorkingDayLogsForMonth();
  }

  getMonths(): string[] {
    let months = [];
    let year = moment().year();
    let month = moment().month();
    for(let i = 0; i < 6; i++, month--) {
      if(month < 1) {
        month = 12;
        year--;
      }
      let monthDate = moment().month(month).year(year);
      months.push({
        html5fmt: monthDate.format(moment.HTML5_FMT.MONTH),
        period: monthDate.format('MMMM'),
      });
    }
    return months;
  }
}
