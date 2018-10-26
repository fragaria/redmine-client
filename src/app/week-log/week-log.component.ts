import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { RedmineService } from '../redmine.service';
import { TimeEntryList } from '../models/time-entries';

@Component({
  selector: 'app-week-log',
  templateUrl: './week-log.component.html',
  styleUrls: ['./week-log.component.css']
})
export class WeekLogComponent implements OnInit {

  timeEntries: TimeEntryList;

  constructor(
    private redmine: RedmineService
  ) { }

  ngOnInit() {
    this.redmine.getTimeEntriesForWeek(moment().format(moment.HTML5_FMT.WEEK)).subscribe(entryList => this.timeEntries = entryList);
  }

}
