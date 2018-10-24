import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RedmineService } from '../redmine.service';
import { Field } from '../models/fields';
import { NewTimeEntry, TimeEntry } from '../models/time-entries';

@Component({
  selector: 'app-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.css']
})
export class TimeEntryComponent implements OnInit {

  @Input() issueId: number;
  @Output() newEntry = new EventEmitter<TimeEntry>();

  private commentMaxLength = 255;

  private timeEntryForm: FormGroup;

  private activities: Field[] = [];

  private msg = "";

  private error = "";

  constructor(
    private redmine: RedmineService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.initTimeEntryForm();
  }

  initTimeEntryForm() {
    // debugger;
    const defaultHours = this.redmine.defaultHours;
    this.timeEntryForm = this.formBuilder.group ({
      from: [(new Date()).toISOString().substring(0, 10), Validators.required],
      hours: [defaultHours, [Validators.required, Validators.min(0.25), Validators.max(24)]],
      activityId: [null, Validators.required],
      comment: ['', Validators.maxLength(this.commentMaxLength)]
    });
    this.redmine.getActivitiesEnum().subscribe((activities: Field[]) => {
      this.activities = activities;
      // debugger;
      this.redmine.getDefaultActivity().subscribe((defaultActivity: Field) => {
        // debugger;
        this.timeEntryForm.patchValue({activityId: defaultActivity.id});
      });
    });
    this.msg = "";
    this.error = "";
  }

  createNewTimeEntry() {
    debugger;
    const activityId = (typeof this.timeEntryForm.value.activityId == "string") ? parseInt(this.timeEntryForm.value.activityId, 10) : this.timeEntryForm.value.activityId;
    const activityName = this.redmine.getActivityById(activityId).name;
    const newTimeEntry = {
      issue_id: this.issueId,
      spent_on: this.timeEntryForm.value.from,
      hours: this.timeEntryForm.value.hours,
      activity_id: activityId,
      activity_name: activityName,
      comments: this.timeEntryForm.value.comment
    };
    this.redmine.createNewTimeEntry(newTimeEntry).subscribe(created => {
      this.msg = "Time entry added";
      this.initTimeEntryForm()
      this.newEntry.emit(created);
    });
  }

}
