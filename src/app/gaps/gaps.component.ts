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

  monthHtml5fmt: string = `${moment().year()}-${moment().month() < 9 ? '0' : ''}${moment().month() + 1}`; // formatting moment using HTML5_FMT has issues; use only when setting a date; month() starts at 0

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
    this.redmine.listDayLogs(this.monthHtml5fmt, 'month', false).subscribe(dayLogs => {
      this.dayLogs = dayLogs;
    });
  }

  setMonth(month: string) {
    this.monthHtml5fmt = month;
    this.listWorkingDayLogsForMonth();
  }

  getMonths(): string[] {
    let months = [];
    let year = moment().year();
    let month = moment().month();
    month++; // month() starts at 0
    for(let i = 0; i < 6; i++, month--) {
      if(month < 1) {
        month = 12;
        year--;
      }
      let html5fmt = `${year}-${month < 10 ? '0' : ''}${month}`;
      months.push({
        html5fmt: html5fmt,
        period: moment(html5fmt, moment.HTML5_FMT.MONTH).format('MMMM')
      });
    }
    return months;
  }
}
