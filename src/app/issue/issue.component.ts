import { Component, OnInit, Input } from '@angular/core';

import { RedmineService } from '../redmine.service';
import { Issue } from '../models/issues';
import { TimeEntryList, TimeEntry } from '../models/time-entries';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {

  @Input() issue: Issue;

  lastLogEntry: string;
  showLog: boolean = false;
  log: TimeEntryList;
  showLogTime: boolean = false;

  constructor(
    private redmine: RedmineService
  ) { }

  ngOnInit() {
    this.redmine.getLastTime(this.issue.id).subscribe(lastTime => this.lastLogEntry = lastTime)
  }

  toggleLog() {
    // debugger;
    if(!this.showLog && !this.log) {
      this.redmine.getTimeEntries(this.issue.id).subscribe(entries => {
        console.log('retrieved: ' + entries.time_entries.length);
        this.log = entries;
        this.showLog = true;
      });
    } else {
      this.showLog = !this.showLog;
    }
  }

  toggleLogTime() {
    // debugger;
    this.showLogTime = !this.showLogTime;
  }

  timeLogged(newEntry: TimeEntry) {
    // debugger;
    this.redmine.getLastTime(this.issue.id).subscribe(
      time => this.lastLogEntry = time
    );
    if(this.showLog && (this.log === undefined || this.log == null)) {
      this.log = new TimeEntryList();
    }
    if(this.log !== undefined && this.log != null) {
      this.log.time_entries.splice(0, 0, newEntry
        // {
        //   id: null,
        //   project: this.issue.project,
        //   issue: {
        //     id: this.issue.id
        //   },
        //   user: null,
        //   activity: {
        //     id: newEntry.activity_id,
        //     name: newEntry.activity_name
        //   },
        //   hours: newEntry.hours,
        //   comments: newEntry.comments,
        //   spent_on: newEntry.spent_on,
        //   created_on: null,
        //   updated_on: null
        // }
      );
      this.log.total_count += 1;
    }
  }

}
