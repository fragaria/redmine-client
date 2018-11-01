import { Component, OnInit, Input } from '@angular/core';

import { RedmineService } from '../redmine.service';

import { TimeEntryList, TimeEntry, NewTimeEntry } from '../models/time-entries';
import { Issue } from '../models/issues';

@Component({
  selector: 'app-time-entries',
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.css']
})
export class TimeEntriesComponent implements OnInit {

  @Input() entries: TimeEntryList;
  @Input() showDate: boolean;
  @Input() showIssue: boolean;
  @Input() issues: Issue[];

  issueMap = [];

  constructor(
  ) { }

  ngOnInit() {
    if(this.showIssue) {
      for(let issue of this.issues) {
        this.issueMap['id' + issue.id] = issue.subject;
      }
    }
  }

  getIssueSubject(issueId: number): string {
    let result = this.issueMap['id' + issueId];
    return (result !== undefined) ? result : "Issue #" + issueId;
  }

}
