import { Component, OnInit, Input } from '@angular/core';

import { TimeEntryList, TimeEntry, NewTimeEntry } from '../models/time-entries';

@Component({
  selector: 'app-time-entries',
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.css']
})
export class TimeEntriesComponent implements OnInit {

  @Input() entries: TimeEntryList;
  @Input() showDate: boolean;
  @Input() showIssue: boolean;

  constructor() { }

  ngOnInit() {
  }

}
