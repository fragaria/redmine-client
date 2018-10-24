import { Component, OnInit, Input } from '@angular/core';

import { RedmineService } from '../redmine.service';
import { TimeEntryList, TimeEntry, NewTimeEntry } from '../models/time-entries';

@Component({
  selector: 'app-time-entries',
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.css']
})
export class TimeEntriesComponent implements OnInit {

  @Input() entries: TimeEntryList;

  constructor(
  ) { }

  ngOnInit() {
  }

}
