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

  timeLogged(entry: TimeEntry) {
    // debugger;
    this.redmine.getLastTime(this.issue.id).subscribe(
      time => this.lastLogEntry = time
    );
    if(this.showLog && (this.log === undefined || this.log == null)) {
      this.log = new TimeEntryList();
    }
    if(this.log !== undefined && this.log != null) {
      // debugger;
      entry.isNew = true;
      setTimeout(function() {
        entry.isNew = false;
      }, 20000);
      this.log.time_entries.splice(0, 0, entry);
      this.log.total_count += 1;
    } else {
      // TODO add message to a message service
    }
  }

}
