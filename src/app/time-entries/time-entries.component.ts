import { Component, OnInit, Input } from '@angular/core';

import { TimeEntryList, TimeEntry, NewTimeEntry } from '../dto/time-entries';

import { RedmineService } from '../redmine.service'

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
