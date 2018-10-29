import { Component, OnInit, Input } from '@angular/core';

import { RedmineService } from '../redmine.service';
import { MessageService } from '../message.service';
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
  showNewLogForm: boolean = false;

  newEntryTimeout = 10000;

  constructor(
    private redmine: RedmineService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.redmine.getLastTime(this.issue.id).subscribe(lastTime => this.lastLogEntry = lastTime)
  }

  toggleLog() {
    // debugger;
    if(!this.showLog && !this.log) {
      this.loadLog();
    } else {
      this.showLog = !this.showLog;
    }
  }

  loadLog() {
    this.redmine.listTimeEntries(this.issue.id).subscribe(entries => {
      console.log('retrieved: ' + entries.time_entries.length);
      this.log = entries;
      this.showLog = true;
    });
  }

  toggleLogTime() {
    // debugger;
    this.showNewLogForm = !this.showNewLogForm;
  }

  timeLogged(entry: TimeEntry) {
    // debugger;
    this.redmine.getLastTime(this.issue.id).subscribe(
      time => this.lastLogEntry = time
    );
    if(!this.showLog) {
      this.messageService.add(`Time spent on ${entry.spent_on} was logged to ${this.issue.subject}.`);
    }
    if(this.showLog && (this.log === undefined || this.log == null)) {
      this.log = new TimeEntryList();
    }
    if(this.log !== undefined && this.log != null) {
      // debugger;
      entry.isNew = true;
      setTimeout(function() {
        entry.isNew = false;
      }, this.newEntryTimeout);
      this.log.time_entries.splice(0, 0, entry);
      this.log.total_count += 1;
    }
  }

}
