import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { RedmineService } from '../redmine.service';
import { TimeEntryList, TimeEntry } from '../models/time-entries';
import { Issue } from '../models/issues';


@Component({
  selector: 'app-week-log',
  templateUrl: './week-log.component.html',
  styleUrls: ['./week-log.component.css']
})
export class WeekLogComponent implements OnInit {

  @Input() weekDate = moment();

  timeEntries: TimeEntryList;
  issues: Issue[];
  weekModel: Map<Issue, TimeEntry[]>;
  total = 0;

  constructor(
    private redmine: RedmineService
  ) { }

  ngOnInit() {
    this.getIssues();
    this.listTimeEntriesForWeek();
  }

  listTimeEntriesForWeek() {
    // TODO rewrite - too complicated
    this.redmine.listTimeEntriesForWeek(this.weekDate.format(moment.HTML5_FMT.WEEK)).subscribe(entryList => {
      this.timeEntries = entryList;

      let result = [];
      let monday = moment(this.weekDate, moment.HTML5_FMT.WEEK).startOf("week").format("YYYY-MM-DD");
      result[monday] = this.getNewIssueMap();
      let tuesday = moment(this.weekDate, moment.HTML5_FMT.WEEK).startOf("week").add(1, 'd').format("YYYY-MM-DD");
      result[tuesday] = this.getNewIssueMap();
      let wednesday = moment(this.weekDate, moment.HTML5_FMT.WEEK).startOf("week").add(2, 'd').format("YYYY-MM-DD");
      result[wednesday] = this.getNewIssueMap();
      let thursday = moment(this.weekDate, moment.HTML5_FMT.WEEK).startOf("week").add(3, 'd').format("YYYY-MM-DD");
      result[thursday] = this.getNewIssueMap();
      let friday = moment(this.weekDate, moment.HTML5_FMT.WEEK).startOf("week").add(4, 'd').format("YYYY-MM-DD");
      result[friday] = this.getNewIssueMap();
      let saturday = moment(this.weekDate, moment.HTML5_FMT.WEEK).startOf("week").add(5, 'd').format("YYYY-MM-DD");
      result[saturday] = this.getNewIssueMap();
      let sunday = moment(this.weekDate, moment.HTML5_FMT.WEEK).startOf("week").add(6, 'd').format("YYYY-MM-DD");
      result[sunday] = this.getNewIssueMap();

      // for(let entry of entryList.time_entries) {
      //   if(result[entry.spent_on].has(entry.issue.id)) {
      //     result[entry.spent_on].set(entry.issue.id)
      //   }
      // }
      // TODO change key to ID, add issue to structe
      // TODO parse structure
    });
  }

  private getNewIssueMap() {
    let result = new Map<Issue, TimeEntry[]>();
    for(let issue of this.issues) {
      result.set(issue, []);
    }
    return result;
  }

  getIssues() {
    this.redmine.listMyIssues().subscribe(issueList => {
      this.issues = issueList.issues;
    });
  }

}
