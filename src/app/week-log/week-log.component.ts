import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { MessageService } from '../message.service';
import { RedmineService } from '../redmine.service';
import { SettingsService } from '../settings.service';

import { DayLog, Week } from '../models/time-entries';
import { Issue } from '../models/issues';

@Component({
  selector: 'app-week-log',
  templateUrl: './week-log.component.html',
  styleUrls: ['./week-log.component.css']
})
export class WeekLogComponent implements OnInit {

  weekDate = moment();
  weeks = [];

  issues: Issue[];
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
    this.getIssues();
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

  getIssues() {
    this.redmine.listMyIssues().subscribe(issueList => {
      this.issues = issueList.issues;
    });
  }

  listWorkingDayLogsForWeek() {
    this.redmine.listWorkingDayLogs(this.weekDate.format(moment.HTML5_FMT.WEEK), 'week').subscribe(dayLogs => {
      // debugger;
      this.dayLogs = dayLogs;
    });
  }

  setWeek(week: number) {
    this.weekDate.week(week);
    this.listWorkingDayLogsForWeek();
  }

}
