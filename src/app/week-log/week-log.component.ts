import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { MessageService } from '../message.service';
import { RedmineService } from '../redmine.service';
import { SettingsService } from '../settings.service';

import { DayLog, Week } from '../models/time-entries';

@Component({
  selector: 'app-week-log',
  templateUrl: './week-log.component.html',
  styleUrls: ['./week-log.component.css']
})
export class WeekLogComponent implements OnInit {

  weekDate = moment();
  weeks = [];

  dayLogs: DayLog[];

  dailyWorkingHours: number;

  constructor(
    private messageService: MessageService,
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
    // debugger;
    for(let i = 0; i < 8; i++, weekNumber--) {
      const min = moment().week(weekNumber).startOf("week").format("YYYY-MM-DD");
      const max = moment().week(weekNumber).endOf("week").subtract(2, 'days').format("YYYY-MM-DD");
      this.weeks.push({
       weekNumber: weekNumber,
       period: `${weekNumber}. week: ${min} - ${max}`
     });
    }
  }

  listWorkingDayLogsForWeek() {
    this.redmine.listDayLogs(this.weekDate.format(moment.HTML5_FMT.WEEK), 'week', true, true, false).subscribe(dayLogs => {
      // debugger;
      this.dayLogs = dayLogs;
    });
  }

  setWeek(week: number) {
    this.weekDate.week(week);
    this.listWorkingDayLogsForWeek();
  }

}
