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

  constructor(
    private redmine: RedmineService
  ) { }

  ngOnInit() {
    this.listWorkingWeekLogs();
  }

  listWorkingWeekLogs() {
    this.redmine.listWeekLogs(this.monthDate.format(moment.HTML5_FMT.MONTH)).subscribe(weekLogs => {
      // debugger;
      this.weekLogs = weekLogs;
    });
  }

  setMonth(month: string) {
    this.monthDate.month(month);
    this.listWorkingWeekLogs();
  }


  months(): string[] {
    let months = [];
    for(let i = 0; i < 6; i++) {
      months.push(moment().subtract(i, 'months').format('MMMM'));
    }
    return months;
  }
}
