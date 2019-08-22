import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { RedmineService } from '../redmine.service';
import { SettingsService } from '../settings.service';

import { DayLog, TimeEntry } from '../models/time-entries';

@Component({
  selector: 'app-week-log',
  templateUrl: './week-log.component.html',
  styleUrls: ['./week-log.component.css']
})
export class WeekLogComponent implements OnInit {

  // formatting moment using HTML5_FMT has issues; use only when setting a date
  weekHtml5fmt = `${moment().year()}-W${moment().isoWeek() < 10 ? '0' : ''}${moment().isoWeek()}`;
  weeks = [];

  dayLogs: DayLog[];

  totalSum: number;
  dailyWorkingHours: number;

  constructor(
    private redmine: RedmineService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    this.initWeeks();
    this.dailyWorkingHours = this.settings.get().dailyWorkingHours;
    this.listWorkingDayLogsForWeek();
  }

  private initWeeks() {
    let weekNumber = moment().week();
    let year = moment().year();
    for (let i = 0; i < 8; i++ , weekNumber--) {
      if (weekNumber < 1) {
        weekNumber = 52;
        year--;
      }
      const min = moment().week(weekNumber).year(year).startOf('week').format('YYYY-MM-DD');
      const max = moment().week(weekNumber).year(year).endOf('week').subtract(2, 'days').format('YYYY-MM-DD');
      this.weeks.push({
        html5fmt: `${year}-W${weekNumber < 10 ? '0' : ''}${weekNumber}`,
        period: `${weekNumber}. week: ${min} - ${max}`
      });
    }
  }

  listWorkingDayLogsForWeek() {
    this.redmine.listDayLogs(this.weekHtml5fmt, 'week', true, true, false).subscribe(dayLogs => {
      this.dayLogs = dayLogs;
      this.totalSum = dayLogs.reduce((val, dayLog) => val + dayLog.hoursLogged, 0);
    });
  }

  setWeek(week: string) {
    // debugger;
    this.weekHtml5fmt = week;
    this.listWorkingDayLogsForWeek();
  }

  addToTotalSum(newEntry: TimeEntry) {
    this.totalSum += newEntry.hours;
  }

}
