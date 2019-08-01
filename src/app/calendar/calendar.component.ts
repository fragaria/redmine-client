import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { RedmineService } from '../redmine.service';

import { WeekLog } from '../models/time-entries';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  // formatting moment using HTML5_FMT has issues; use only when setting a date; month() starts at 0
  monthHtml5fmt = `${moment().year()}-${moment().month() < 9 ? '0' : ''}${moment().month() + 1}`;
  weekLogs: WeekLog[] = [];
  months = [];

  constructor(
    private redmine: RedmineService
  ) { }

  ngOnInit() {
    this.months = this.getMonths();
    this.listWorkingWeekLogs();
  }

  listWorkingWeekLogs() {
    this.redmine.listWeekLogs(this.monthHtml5fmt).subscribe(weekLogs => {
      // debugger;
      this.weekLogs = weekLogs;
    });
  }

  setMonth(month: string) {
    this.monthHtml5fmt = month;
    this.listWorkingWeekLogs();
  }


  getMonths(): string[] {
    const months = [];
    let year = moment().year();
    let month = moment().month();
    month++; // month() starts at 0
    for (let i = 0; i < 6; i++ , month--) {
      if (month < 1) {
        month = 12;
        year--;
      }
      const html5fmt = `${year}-${month < 10 ? '0' : ''}${month}`;
      months.push({
        html5fmt: html5fmt,
        period: moment(html5fmt, moment.HTML5_FMT.MONTH).format('MMMM')
      });
    }
    return months;
  }
}
