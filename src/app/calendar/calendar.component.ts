import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { MessageService } from '../message.service';
import { RedmineService } from '../redmine.service';
import { SettingsService } from '../settings.service';

import { WeekLog } from '../models/time-entries';
import { Issue } from '../models/issues';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  monthDate = moment();

  issues: Issue[];
  weekLogs: WeekLog[] = [];

  dailyWorkingHours: number;

  constructor(
    private messageService: MessageService,
    private redmine: RedmineService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    this.dailyWorkingHours = this.settings.get().dailyWorkingHours;
    this.getIssues();
    this.listWorkingWeekLogs();
  }

  getIssues() {
    this.redmine.listMyIssues().subscribe(issueList => {
      this.issues = issueList.issues;
    });
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

  skippedWorkingDays(weekLog: WeekLog): number[] {
    let result = [];
    if(weekLog.startsWith != 1) {
      for(let i = weekLog.numberOfWorkingDays; i < 7 ; i++) {
        result.push(i);
      }
    }
    return result;
  }

  missingWorkingDays(weekLog: WeekLog): number[] {
    let result = [];
    if(weekLog.startsWith == 1) {
      for(let i = weekLog.numberOfWorkingDays; i < 7 ; i++) {
        result.push(i);
      }
    }
    return result;
  }
}
