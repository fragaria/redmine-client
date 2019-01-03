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

  monthDate = moment();
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
    this.redmine.listWeekLogs(this.monthDate.format(moment.HTML5_FMT.MONTH)).subscribe(weekLogs => {
      // debugger;
      this.weekLogs = weekLogs;
    });
  }

  setMonth(month: string) {
    this.monthDate = moment(month, moment.HTML5_FMT.MONTH);
    this.listWorkingWeekLogs();
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
