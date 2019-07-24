import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as moment from 'moment';

import { RedmineService } from '../redmine.service';
import { SettingsService } from '../settings.service';
import { Field } from '../models/fields';
import { NewTimeEntry, TimeEntry } from '../models/time-entries';

@Component({
  selector: 'app-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.css']
})
export class TimeEntryComponent implements OnInit {

  @Input() issueId: number;
  @Output() newEntryEmitter = new EventEmitter<TimeEntry>();

  public commentMaxLength = 255;
  public timeEntryForm: FormGroup;
  public activities: Field[] = [];
  public logPeriod = false;
  public saving = false;

  constructor(
    private redmine: RedmineService,
    private settings: SettingsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initTimeEntryForm();
  }

  initTimeEntryForm() {
    // debugger;
    const defaultHours = this.settings.get().defaultHours;
    const now = moment().format('YYYY-MM-DD');
    this.timeEntryForm = this.formBuilder.group ({
      from: [now, Validators.required],
      // from: [(new Date()).toISOString().substring(0, 10), Validators.required],
      period: [[now, now], Validators.required],
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
  }

  createNewTimeEntry() {
    // debugger;
    const activityId = (typeof this.timeEntryForm.value.activityId === 'string') ?
      parseInt(this.timeEntryForm.value.activityId, 10) :
      this.timeEntryForm.value.activityId;
    const activityName = this.redmine.getActivityById(activityId).name;
    this.saving = true;
    if (this.logPeriod) {
      this.timeEntryForm.disable();
      const to = moment(this.timeEntryForm.value.period[1]).format('YYYY-MM-DD');
      const createActions = [];
      for (const mmt = moment(this.timeEntryForm.value.period[0]); mmt.format('YYYY-MM-DD') <= to; mmt.add(1, 'days')) {
        const newTimeEntry = {
          issue_id: this.issueId,
          spent_on: mmt.format('YYYY-MM-DD'),
          hours: this.timeEntryForm.value.hours,
          activity_id: activityId,
          activity_name: activityName,
          comments: this.timeEntryForm.value.comment
        };
        createActions.push(this.redmine.createNewTimeEntry(newTimeEntry).pipe(
          tap(created => { this.newEntryEmitter.emit(created); })));
      }
      combineLatest(createActions).subscribe(() => {
        this.saving = false;
        this.timeEntryForm.enable();
        this.initTimeEntryForm();
      });
    } else {
      const newTimeEntry = {
        issue_id: this.issueId,
        spent_on: moment(this.timeEntryForm.value.from).format('YYYY-MM-DD'),
        hours: this.timeEntryForm.value.hours,
        activity_id: activityId,
        activity_name: activityName,
        comments: this.timeEntryForm.value.comment
      };
      this.redmine.createNewTimeEntry(newTimeEntry).subscribe(created => {
        this.initTimeEntryForm();
        this.newEntryEmitter.emit(created);
      });
    }
  }

  toggleLogPeriod() {
    this.logPeriod = !this.logPeriod;
  }

}
